import {ChangeDetectionStrategy, Component, Input, OnInit, ViewEncapsulation} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {Endereco} from '../../../shared/models/endereco.model';
import {MatSnackBar} from "@angular/material/snack-bar";

@Component({
    selector: 'endereco',
    templateUrl: './endereco.component.html',
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class EnderecoComponent implements OnInit {

    @Input() enderecoUser: Endereco;
    @Input() idUser: number;
    addressForm: FormGroup;
    plans: any[];

    constructor(
        private _formBuilder: FormBuilder,
        private _snackBar: MatSnackBar,
    ) {
    }

    ngOnInit(): void {
        // Create the form
        this.prepareForm();

    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Track by function for ngFor loops
     *
     * @param index
     * @param item
     */
    trackByFn(index: number, item: any): any {
        return item.id || index;
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
