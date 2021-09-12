import {ChangeDetectionStrategy, Component, Input, OnInit, ViewEncapsulation} from '@angular/core';
import {FormBuilder, FormGroup} from '@angular/forms';
import {Endereco} from '../../../shared/models/endereco.model';

@Component({
    selector: 'endereco',
    templateUrl: './endereco.component.html',
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class EnderecoComponent implements OnInit {

    @Input() enderecoUser: Endereco;
    @Input() idUser: number;
    planBillingForm: FormGroup;
    plans: any[];

    constructor(
        private _formBuilder: FormBuilder
    ) {
    }

    ngOnInit(): void {
        // Create the form
        this.planBillingForm = this._formBuilder.group({
            plan: ['team'],
            cardHolder: ['Brian Hughes'],
            cardNumber: [''],
            cardExpiration: [''],
            cardCVC: [''],
            country: ['usa'],
            zip: ['']
        });

        // Setup the plans
        this.plans = [
            {
                value: 'basic',
                label: 'BASIC',
                details: 'Starter plan for individuals.',
                price: '10'
            },
            {
                value: 'team',
                label: 'TEAM',
                details: 'Collaborate up to 10 people.',
                price: '20'
            },
            {
                value: 'enterprise',
                label: 'ENTERPRISE',
                details: 'For bigger businesses.',
                price: '40'
            }
        ];
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
}
