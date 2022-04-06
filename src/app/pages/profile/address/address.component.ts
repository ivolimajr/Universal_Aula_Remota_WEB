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
    loading: boolean;
    states = ['AC', 'AL', 'AP', 'AM', 'BA', 'CE', 'DF', 'ES', 'GO', 'MA', 'MS', 'MT', 'MG', 'PA', 'PB', 'PR', 'PE',
        'PI', 'RJ', 'RN', 'RS', 'RO', 'RR', 'SC', 'SP', 'SE', 'TO'];
    private user$: Subscription;
    private cep$: Subscription;

    constructor(
        private _formBuilder: FormBuilder,
        private _snackBar: MatSnackBar,
        private _changeDetectorRef: ChangeDetectorRef,
        private _cepService: CepService,
        private _userServices: UserService,
    ) {
    }

    ngOnInit(): void {
        this.prepareForm();
    }

    update(): void {
        if(this.addressForm.invalid){
            return null;
        }
        this.addressForm.disable();
        this.loading = true;
        this.setData();

        this.user$ = this._userServices.updateAddress(this.addressModel).subscribe((res: any) => {
            if (res.error) {
                return this.closeAlerts();
            }
            //Retorna a mensagem de atualizado
            this.openSnackBar('Atualizado');
            this.closeAlerts();

        });
    }

    trackByFn(index: number, item: any): any {
        return item.id || index;
    }

    getCep(event): void {
        if (event.value.replace(/[^0-9,]*/g, '').length < 8) {
            return this.openSnackBar('Cep inválido');
        }
        this.cep$ = this._cepService.getCep(event.value.replace(/[^0-9,]*/g, '')).subscribe((res) => {
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
        if (this.cep$) {
            this.cep$.unsubscribe();
        }
        if (this.user$) {
            this.user$.unsubscribe();
        }
        this._changeDetectorRef.markForCheck();
    }

    private setData(): void {
        const addressFormValue = this.addressForm.value;

        if (addressFormValue.uf.length !== 2) {
            this.openSnackBar('UF Inválida');
            this.closeAlerts();
        }
        addressFormValue.cep = addressFormValue.cep.replace(/[^0-9,]*/g, '');
        this.addressModel = addressFormValue;
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
            addressNumber: [this.addressModel.addressNumber, Validators.compose([
                Validators.required,
                Validators.nullValidator,
                Validators.minLength(1),
                Validators.maxLength(10)
            ])],
            complement:[this.addressModel.complement,  Validators.compose([
                Validators.maxLength(100)
            ])],
        });
    }

    private closeAlerts(): void{
        this.addressForm.enable();
        this.loading = false;
        this._changeDetectorRef.markForCheck();
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
