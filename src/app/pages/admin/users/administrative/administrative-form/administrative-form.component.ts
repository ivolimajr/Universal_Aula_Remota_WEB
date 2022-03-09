import {Component, Input, OnInit} from '@angular/core';
import {AdministrativeService} from '../../../../../shared/services/http/administrative.service';
import {AdministrativePost, AdministrativeUser} from '../../../../../shared/models/administrative.model';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {Subscription} from 'rxjs';

@Component({
    selector: 'app-administrative-form',
    templateUrl: './administrative-form.component.html',
    styleUrls: ['./administrative-form.component.scss']
})
export class AdministrativeFormComponent implements OnInit {

    @Input() id: number;
    userForm: FormGroup;
    addressForm: FormGroup;
    private userPost = new AdministrativePost(); //Objeto para envio dos dados para API
    private userSub: Subscription;

    constructor(
        private _formBuilder: FormBuilder,
        private _administrativeServices: AdministrativeService
    ) {
    }

    ngOnInit(): void {
        this.getUser();
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
