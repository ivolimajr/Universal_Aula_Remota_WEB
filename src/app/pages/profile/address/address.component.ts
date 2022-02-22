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
import {MatSnackBar} from '@angular/material/snack-bar';
import {MASKS, NgBrazilValidators} from 'ng-brazil';
import {Subscription} from 'rxjs';
import {AddressModel} from '../../../shared/models/address.model';
import {CepService} from '../../../shared/services/http/cep.service';
import {UserService} from '../../../shared/services/http/user.service';

@Component({
    selector: 'app-address',
    templateUrl: './address.component.html',
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class AddressComponent implements OnInit, OnDestroy {

    @Input() addressModel: AddressModel;
    @Input() idUser: number;
    masks = MASKS;
    addressForm: FormGroup;
    plans: any[];
    cep: string;
    states = ['AC', 'AL', 'AP', 'AM', 'BA', 'CE', 'DF', 'ES', 'GO', 'MA', 'MS', 'MT', 'MG', 'PA', 'PB', 'PR', 'PE',
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

    update(): void {
        this.addressForm.disable();
        //Verifica se o formulário é valido
        if (this.prepareFormToSend() === false) {
            return null;
        }

        this.userSub = this._userService.updateAddress(this.addressModel).subscribe((res: any) => {
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
                district: res.bairro,
                address: res.logradouro,
                city: res.localidade,
                cep: res.cep,
                uf: res.uf
            });
            this._changeDetectorRef.markForCheck();
        });
    }

    ngOnDestroy(): void {
        if (this.cepSub) {
            this.cepSub.unsubscribe();
        }
        if (this.userSub) {
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
        this.addressModel.id = formValue.id;
        this.addressModel.uf = formValue.uf;
        this.addressModel.cep = formValue.cep.replace(/[^0-9,]*/g, '');
        this.addressModel.address = formValue.address;
        this.addressModel.district = formValue.district;
        this.addressModel.city = formValue.city;
        this.addressModel.number = formValue.number;
        return result;
    }

    private prepareForm(): void {
        this.addressForm = this._formBuilder.group({
            id: [this.addressModel.id],
            uf: [this.addressModel.uf, Validators.compose([
                Validators.required,
                Validators.nullValidator,
                Validators.minLength(2),
                Validators.maxLength(2)
            ])],
            cep: [this.addressModel.cep, Validators.compose([
                Validators.required,
                Validators.nullValidator,
                Validators.minLength(8),
                Validators.maxLength(10),
                NgBrazilValidators.cep
            ])],
            address: [this.addressModel.address, Validators.compose([
                Validators.required,
                Validators.nullValidator,
                Validators.minLength(5),
                Validators.maxLength(100)
            ])],
            district: [this.addressModel.district, Validators.compose([
                Validators.required,
                Validators.nullValidator,
                Validators.minLength(5),
                Validators.maxLength(100)
            ])],
            city: [this.addressModel.city, Validators.compose([
                Validators.required,
                Validators.nullValidator,
                Validators.minLength(5),
                Validators.maxLength(100)
            ])],
            number: [this.addressModel.number, Validators.compose([
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
            verticalPosition: 'bottom',
            panelClass: ['mat-toolbar', 'mat-' + type]
        });
    }
}
