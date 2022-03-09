import {ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, OnInit} from '@angular/core';
import {AdministrativeService} from '../../../../../shared/services/http/administrative.service';
import {AdministrativePost, AdministrativeUser} from '../../../../../shared/models/administrative.model';
import {FormArray, FormBuilder, FormGroup, Validators} from '@angular/forms';
import {Subscription} from 'rxjs';
import {MASKS} from 'ng-brazil';
import {MatDialog, MatDialogRef} from '@angular/material/dialog';
import {AlertModalComponent} from '../../../../../layout/common/alert/alert-modal.component';
import {fuseAnimations} from '../../../../../../@fuse/animations';
import {MatSnackBar} from '@angular/material/snack-bar';

@Component({
    selector: 'app-administrative-form',
    templateUrl: './administrative-form.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
    animations: fuseAnimations
})
export class AdministrativeFormComponent implements OnInit {

    @Input() id: number;
    masks = MASKS;
    loading: boolean = false;
    userForm: FormGroup;
    addressForm: FormGroup;
    private userPost = new AdministrativePost(); //Objeto para envio dos dados para API
    private userSub: Subscription;

    constructor(
        public dialog: MatDialog,
        private _snackBar: MatSnackBar,
        private _formBuilder: FormBuilder,
        public dialogRef: MatDialogRef<AdministrativeFormComponent>,
        private _changeDetectorRef: ChangeDetectorRef,
        private _administrativeServices: AdministrativeService
    ) {
    }

    ngOnInit(): void {
        this.getUser();
    }
    //Fecha o formulário
    onNoClick(): void {
        this.dialogRef.close();
    }

    submit(): void{

    }
    removePhoneNumber(id: number, index: number): void {

    }
    addPhoneNumberField(): void {

    }
    private getUser(): void {
        if (!this.id) {
            this.prepareForm(null);
        } else {
            this.userSub = this._administrativeServices.getOne(this.id)
                .subscribe((res) => {
                    console.log(res);
                    if (!res.id) {
                        return;
                    }
                    this.prepareForm(res);
                });
        }
    }

    private prepareForm(user: AdministrativeUser): void {
        this.userForm = this._formBuilder.group({
            name: [user ? user.name : '',
                Validators.compose([
                    Validators.required,
                    Validators.nullValidator,
                    Validators.min(5),
                    Validators.maxLength(100)
                ])],
            email: [user ? user.email : '',
                Validators.compose([
                    Validators.required,
                    Validators.nullValidator,
                    Validators.min(5),
                    Validators.maxLength(100)
                ])],
            cpf: [user ? user.cpf : '',
                Validators.compose([
                    Validators.required,
                    Validators.nullValidator,
                    Validators.min(5),
                    Validators.maxLength(100)
                ])],
            identity: [user ? user.identity : '',
                Validators.compose([
                    Validators.required,
                    Validators.nullValidator,
                    Validators.min(5),
                    Validators.maxLength(100)
                ])],
            birthdate: [user ? user.birthDate : '',
                Validators.compose([
                    Validators.required,
                    Validators.nullValidator,
                    Validators.min(5),
                    Validators.maxLength(100)
                ])]
        });
    }
}
