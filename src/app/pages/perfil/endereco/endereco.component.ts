import {
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    Input,
    OnDestroy,
    OnInit,
    ViewEncapsulation
} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {Endereco} from '../../../shared/models/endereco.model';
import {MatSnackBar} from '@angular/material/snack-bar';
import {CepService} from '../../../shared/services/http/cep.service';
import {MASKS, NgBrazilValidators} from 'ng-brazil';
import {UserService} from '../../../shared/services/http/user.service';
import {Subscription} from 'rxjs';

@Component({
    selector: 'endereco',
    templateUrl: './endereco.component.html',
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class EnderecoComponent implements OnInit, OnDestroy {

    @Input() enderecoUser: Endereco;
    @Input() idUser: number;
    masks = MASKS;
    addressForm: FormGroup;
    plans: any[];
    cep: string;
    estados = ['AC', 'AL', 'AP', 'AM', 'BA', 'CE', 'DF', 'ES', 'GO', 'MA', 'MS', 'MT', 'MG', 'PA', 'PB', 'PR', 'PE',
        'PI', 'RJ', 'RN', 'RS', 'RO', 'RR', 'SC', 'SP', 'SE', 'TO'];
    private userSub: Subscription;
    private cepSub: Subscription;

    constructor(
        private _formBuilder: FormBuilder,
        private _snackBar: MatSnackBar,
        private _changeDetectorRef: ChangeDetectorRef,
        private _cepService: CepService,
        private _userService: UserService,
    ) {
    }

    ngOnInit(): void {
        // Create the form
        this.prepareForm();

    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    update(): void{
        this.addressForm.disable();
        //Verifica se o formulário é valido
        if (this.prepareFormToSend() === false) {
            return null;
        }

        this.userSub = this._userService.updateAddress(this.enderecoUser).subscribe((res: any)=>{
            console.log(res);
            if (res.error) {
                this.openSnackBar(res.error.detail, 'warn');
                this.addressForm.enable();
                this._changeDetectorRef.markForCheck();
                return;
            }
            //Retorna a mensagem de atualizado
            this.openSnackBar('Atualizado');
            this.addressForm.enable();
            this._changeDetectorRef.markForCheck();

        });
    }

    /**
     * Track by function for ngFor loops
     *
     * @param index
     * @param item
     */
    trackByFn(index: number, item: any): any {
        return item.id || index;
    }

    buscaCep(event): void {
        if (event.value.replace(/[^0-9,]*/g, '').length < 8) {
            this.openSnackBar('Cep inválido');
            return;
        }
        this.cepSub = this._cepService.buscar(event.value.replace(/[^0-9,]*/g, '')).subscribe((res) => {
            this.addressForm.patchValue({
                bairro: res.bairro,
                enderecoLogradouro: res.logradouro,
                cidade: res.localidade,
                cep: res.cep,
                uf: res.uf
            });
            this._changeDetectorRef.markForCheck();
        });
    }

    ngOnDestroy(): void {
        if(this.cepSub){
            this.cepSub.unsubscribe();
        }
        if(this.userSub){
            this.userSub.unsubscribe();
        }
        this._changeDetectorRef.markForCheck();
    }

    private prepareFormToSend(): boolean {
        const formValue = this.addressForm.value;
        let result = true;
        if (this.addressForm.invalid) {
            this.openSnackBar('Dados Inválidos');
            result = false;
            return result;
        }
        if (formValue.uf.length !== 2) {
            this.openSnackBar('UF Inválida');
            this.addressForm.enable();
            result = false;
            return result;
        }
        this.enderecoUser.id = formValue.id;
        this.enderecoUser.uf = formValue.uf;
        this.enderecoUser.cep = formValue.cep.replace(/[^0-9,]*/g, '');
        this.enderecoUser.enderecoLogradouro = formValue.enderecoLogradouro;
        this.enderecoUser.bairro = formValue.bairro;
        this.enderecoUser.cidade = formValue.cidade;
        this.enderecoUser.numero = formValue.numero;
        return result;
    }

    private prepareForm(): void {
        this.addressForm = this._formBuilder.group({
            id: [this.enderecoUser.id],
            uf: [this.enderecoUser, Validators.compose([
                Validators.required,
                Validators.nullValidator,
                Validators.minLength(2),
                Validators.maxLength(2)
            ])],
            cep: [this.enderecoUser.cep, Validators.compose([
                Validators.required,
                Validators.nullValidator,
                NgBrazilValidators.cep,
                Validators.minLength(5),
                Validators.maxLength(14)
            ])],
            enderecoLogradouro: [this.enderecoUser.enderecoLogradouro, Validators.compose([
                Validators.required,
                Validators.nullValidator,
                Validators.minLength(5),
                Validators.maxLength(100)
            ])],
            bairro: [this.enderecoUser.bairro, Validators.compose([
                Validators.required,
                Validators.nullValidator,
                Validators.minLength(5),
                Validators.maxLength(100)
            ])],
            cidade: [this.enderecoUser.cidade, Validators.compose([
                Validators.required,
                Validators.nullValidator,
                Validators.minLength(5),
                Validators.maxLength(100)
            ])],
            numero: [this.enderecoUser.numero, Validators.compose([
                Validators.required,
                Validators.nullValidator,
                Validators.minLength(1),
                Validators.maxLength(10)
            ])],
        });
    }

    private openSnackBar(message: string, type: string = 'accent'): void {
        this._snackBar.open(message, '', {
            duration: 5 * 1000,
            horizontalPosition: 'center',
            verticalPosition: 'top',
            panelClass: ['mat-toolbar', 'mat-' + type]
        });
    }
}
