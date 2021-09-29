import {Component, Input, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';

@Component({
    selector: 'step-dados-pessoais',
    templateUrl: './step-dados-pessoais.component.html'
})
export class StepDadosPessoaisComponent implements OnInit {

    @Input() firstFormGroup: FormGroup;

    constructor(
        private _formBuilder: FormBuilder
    ) {
    }

    ngOnInit(): void {
    }

}
