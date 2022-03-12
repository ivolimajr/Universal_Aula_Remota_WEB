import {ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, OnDestroy, OnInit} from '@angular/core';
import {AdministrativeService} from '../../../../../shared/services/http/administrative.service';
import {AdministrativePost} from '../../../../../shared/models/administrative.model';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {Subscription} from 'rxjs';
import {MatDialog, MatDialogRef} from '@angular/material/dialog';
import {fuseAnimations} from '../../../../../../@fuse/animations';
import {MatSnackBar} from '@angular/material/snack-bar';
import {CepService} from '../../../../../shared/services/http/cep.service';

@Component({
    selector: 'app-administrative-form',
    templateUrl: './administrative-form.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
    animations: fuseAnimations
})
export class AdministrativeFormComponent implements OnInit, OnDestroy {

    @Input() id: number;
    loading: boolean = false;
    userForm: FormGroup;
    ufOrigin = new FormControl();
    ufList = ['AC', 'AL', 'AP', 'AM', 'BA', 'CE', 'DF', 'ES', 'GO', 'MA', 'MS', 'MT', 'MG', 'PA', 'PB',
        'PR', 'PE', 'PI', 'RJ', 'RN', 'RS', 'RO', 'RR', 'SC', 'SP', 'SE', 'TO'];
    addressForm: FormGroup;
    private userPost = new AdministrativePost(); //Objeto para envio dos dados para API
    private userSub: Subscription;
    private cepSub: Subscription;

    constructor(
        public dialog: MatDialog,
        private _snackBar: MatSnackBar,
        private _formBuilder: FormBuilder,
        public dialogRef: MatDialogRef<AdministrativeFormComponent>,
        private _changeDetectorRef: ChangeDetectorRef,
        private _cepService: CepService,
        private _administrativeServices: AdministrativeService
    ) {
    }

    ngOnDestroy(): void {
        if (this.userSub) {
            this.userSub.unsubscribe();
        }
        if (this.cepSub) {
            this.cepSub.unsubscribe();
        }
    }

    ngOnInit(): void {
        this.prepareForm();
    }

    //Fecha o formulário
    onNoClick(): void {
        this.dialogRef.close();
    }

    submit(): void {
        if (!this.id) {
            this.userForm.value.origin = this.userForm.value.origin + '-' + this.ufOrigin.value;
            console.log(this.userForm.value);
        }
    }

    removePhoneNumber(id: number, index: number): void {

    }

    addPhoneNumberField(): void {

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

    private prepareForm(): void {
        if (this.id != null) {
            this.prepareEditForm();
        }
        this.userForm = this._formBuilder.group({
            name: ['',
                Validators.compose([
                    Validators.required,
                    Validators.nullValidator,
                    Validators.min(5),
                    Validators.maxLength(100)
                ])],
            email: ['@edriving.com',
                Validators.compose([
                    Validators.required,
                    Validators.nullValidator,
                    Validators.min(5),
                    Validators.maxLength(100)
                ])],
            cpf: ['',
                Validators.compose([
                    Validators.required,
                    Validators.nullValidator,
                    Validators.min(5),
                    Validators.maxLength(100)
                ])],
            identity: ['',
                Validators.compose([
                    Validators.required,
                    Validators.nullValidator,
                    Validators.min(5),
                    Validators.maxLength(100)
                ])],
            origin: ['',
                Validators.compose([
                    Validators.required,
                    Validators.nullValidator,
                    Validators.min(5),
                    Validators.maxLength(100)
                ])]
        });
        this.addressForm = this._formBuilder.group({
            cep: ['',
                Validators.compose([
                    Validators.required,
                    Validators.nullValidator,
                    Validators.minLength(8),
                    Validators.maxLength(10)])],
            address: ['',
                Validators.compose([
                    Validators.required,
                    Validators.nullValidator,
                    Validators.minLength(3),
                    Validators.maxLength(150)])],
            district: ['',
                Validators.compose([
                    Validators.required,
                    Validators.nullValidator,
                    Validators.minLength(3),
                    Validators.maxLength(150)])],
            uf: ['', Validators.compose([
                Validators.required,
                Validators.nullValidator,
                Validators.minLength(2),
                Validators.maxLength(2)
            ])],
            city: ['',
                Validators.compose([
                    Validators.required,
                    Validators.nullValidator,
                    Validators.minLength(3),
                    Validators.maxLength(150)])],
            addressNumber: ['',
                Validators.compose([
                    Validators.required,
                    Validators.nullValidator,
                    Validators.minLength(1),
                    Validators.maxLength(50)])],
        });
        this._changeDetectorRef.markForCheck();
    }

    private prepareEditForm(): void {
        this.loading = true;
        this._changeDetectorRef.markForCheck();
        this.userSub = this._administrativeServices.getOne(this.id)
            .subscribe((res) => {
                if (!res.id) {
                    return;
                }
                this.userForm = this._formBuilder.group({
                    name: [res.name,
                        Validators.compose([
                            Validators.required,
                            Validators.nullValidator,
                            Validators.min(5),
                            Validators.maxLength(100)
                        ])],
                    email: [res.email,
                        Validators.compose([
                            Validators.required,
                            Validators.nullValidator,
                            Validators.min(5),
                            Validators.maxLength(100)
                        ])],
                    cpf: [res.cpf,
                        Validators.compose([
                            Validators.required,
                            Validators.nullValidator,
                            Validators.min(5),
                            Validators.maxLength(100)
                        ])],
                    identity: [res.identity,
                        Validators.compose([
                            Validators.required,
                            Validators.nullValidator,
                            Validators.min(5),
                            Validators.maxLength(100)
                        ])],
                    origin: [res.origin,
                        Validators.compose([
                            Validators.required,
                            Validators.nullValidator,
                            Validators.min(5),
                            Validators.maxLength(100)
                        ])]
                });
                this.addressForm = this._formBuilder.group({
                    cep: [res.address.cep,
                        Validators.compose([
                            Validators.required,
                            Validators.nullValidator,
                            Validators.minLength(8),
                            Validators.maxLength(10)])],
                    address: [res.address.address,
                        Validators.compose([
                            Validators.required,
                            Validators.nullValidator,
                            Validators.minLength(3),
                            Validators.maxLength(150)])],
                    district: [res.address.district,
                        Validators.compose([
                            Validators.required,
                            Validators.nullValidator,
                            Validators.minLength(3),
                            Validators.maxLength(150)])],
                    uf: [res.address.uf,
                        Validators.compose([
                        Validators.required,
                        Validators.nullValidator,
                        Validators.minLength(2),
                        Validators.maxLength(2)
                    ])],
                    city: [res.address.city,
                        Validators.compose([
                            Validators.required,
                            Validators.nullValidator,
                            Validators.minLength(3),
                            Validators.maxLength(150)])],
                    addressNumber: [res.address.addressNumber,
                        Validators.compose([
                            Validators.required,
                            Validators.nullValidator,
                            Validators.minLength(1),
                            Validators.maxLength(50)])],
                });

                const uf = res.origin.substr(res.origin.length - 2, res.origin.length - 1);
                if (this.ufList.indexOf(uf) > 0) {
                    this.ufOrigin.setValue(res.origin.substr(res.origin.length - 2, res.origin.length - 1));
                }
                this.loading = false;
                this._changeDetectorRef.markForCheck();
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
