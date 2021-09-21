import {ChangeDetectorRef, Component, Input, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {FormArray, FormBuilder, FormGroup, Validators} from '@angular/forms';
import {MASKS, NgBrazilValidators} from 'ng-brazil';

@Component({
    selector: 'app-autoescola-form',
    templateUrl: './autoescola-form.component.html'
})
export class AutoescolaFormComponent implements OnInit {

    verticalStepperForm: FormGroup;
    masks = MASKS;
    public id: number = parseInt(this.routeAcitve.snapshot.paramMap.get('id'), 10);
    private phoneArray = [];
    private fileArray = [];

    constructor(
        private routeAcitve: ActivatedRoute,
        private _changeDetectorRef: ChangeDetectorRef,
        private _formBuilder: FormBuilder
    ) {
    }

    ngOnInit(): void {
        this.loadForm();
    }

    goBack(): void {
        window.history.back();
    }

    /**
     * Adiciona mais um campo no formulário de contato
     *
     * @return void
     */
    addPhoneNumberField(): void {

        const phoneNumberFormGroup = this._formBuilder.group({
            telefone: ['', Validators.compose([
                Validators.required,
                Validators.nullValidator
            ])]
        });

        // Adiciona o formGroup ao array de telefones
        (this.verticalStepperForm.get('step3').get('telefones') as FormArray).push(phoneNumberFormGroup);
        this._changeDetectorRef.markForCheck();
    }

    /**
     * Remove um telefone do formulário de contato e do banco de dados
     *
     * @param id do telefone a ser removido
     * @param index do array de telefones a ser removido
     */
    removePhoneNumber(id: number, index: number): void {
        const phoneNumbersFormArray = this.verticalStepperForm.get('step3').get('telefones') as FormArray;
        if (phoneNumbersFormArray.length === 1) {
            return;
        }
        phoneNumbersFormArray.removeAt(index);
        this._changeDetectorRef.markForCheck();
    }

    /**
     * Adiciona mais um campo no formulário de contato
     *
     * @return void
     */
    addFileField(): void {

        const phoneNumberFormGroup = this._formBuilder.group({
            arquivo: ['', Validators.compose([
                Validators.required,
                Validators.nullValidator
            ])]
        });

        // Adiciona o formGroup ao array de telefones
        (this.verticalStepperForm.get('step4').get('arquivos') as FormArray).push(phoneNumberFormGroup);
        this._changeDetectorRef.markForCheck();
    }

    /**
     * Remove um telefone do formulário de contato e do banco de dados
     *
     * @param id do telefone a ser removido
     * @param index do array de telefones a ser removido
     */
    removeFileField(id: number, index: number): void {
        const phoneNumbersFormArray = this.verticalStepperForm.get('step4').get('arquivos') as FormArray;
        if (phoneNumbersFormArray.length === 1) {
            return;
        }
        phoneNumbersFormArray.removeAt(index);
        this._changeDetectorRef.markForCheck();
    }

    submit(id: number){
        if(!id){
            console.log(this.verticalStepperForm.value);
        }
    }

    private loadForm(): void {
        // Vertical stepper form
        this.verticalStepperForm = this._formBuilder.group({
            step1: this._formBuilder.group({
                razaoSocial: ['Isadora e Ricardo Telecomunicações Ltda',
                    Validators.compose([
                        Validators.required,
                        Validators.maxLength(150)
                    ])],
                nomeFantasia: ['Eduardo e Antonio Filmagens Ltda',
                    Validators.compose([
                        Validators.required,
                        Validators.maxLength(150)
                    ])],
                inscricaoEstadual: ['669.503.958.772',
                    Validators.compose([
                        Validators.required,
                        Validators.minLength(15),
                        Validators.maxLength(20)
                    ])],
                dataFundacao: ['2021-01-30',
                    Validators.required,
                ],
                email: ['autoescola@edriving.com',
                    Validators.compose([
                        Validators.required,
                        Validators.email,
                        Validators.maxLength(70)
                    ])],
                descricao: ['Auto Escola Brasil',
                    Validators.compose([
                        Validators.required,
                        Validators.maxLength(150)
                    ])],
                site: ['cacoesltda.com.br',
                    Validators.compose([
                        Validators.required,
                        Validators.maxLength(100)
                    ])],
                cnpj: ['55.228.271/0001-90',
                    Validators.compose([
                        Validators.required,
                        Validators.maxLength(18),
                        NgBrazilValidators.cnpj
                    ])],
            }),
            step2: this._formBuilder.group({
                cep: ['14786-006',
                    Validators.compose([
                        Validators.required,
                        Validators.nullValidator,
                        Validators.minLength(8),
                        Validators.maxLength(10),
                        NgBrazilValidators.cep])],
                enderecoLogradouro: ['Travessa SF-2',
                    Validators.compose([
                        Validators.required,
                        Validators.nullValidator,
                        Validators.minLength(3),
                        Validators.maxLength(150)])],
                bairro: ['São Francisco',
                    Validators.compose([
                        Validators.required,
                        Validators.nullValidator,
                        Validators.minLength(3),
                        Validators.maxLength(150)])],
                uf: ['SP', Validators.compose([
                    Validators.required,
                    Validators.nullValidator,
                    Validators.minLength(2),
                    Validators.maxLength(2)
                ])],
                cidade: ['Barretos',
                    Validators.compose([
                        Validators.required,
                        Validators.nullValidator,
                        Validators.minLength(3),
                        Validators.maxLength(150)])],
                numero: ['240',
                    Validators.compose([
                        Validators.required,
                        Validators.nullValidator,
                        Validators.minLength(1),
                        Validators.maxLength(50)])],
            }),
            step3: this._formBuilder.group({
                telefones: this._formBuilder.array([],
                    Validators.compose([
                        Validators.required,
                        Validators.nullValidator
                    ]))
            }),
            step4: this._formBuilder.group({
                arquivos: this._formBuilder.array([],
                    Validators.compose([
                        Validators.required,
                        Validators.nullValidator
                    ]))
            })
        });

        // Create a phone number form group
        this.phoneArray.push(
            this._formBuilder.group({
                telefone: ['', Validators.compose([
                    Validators.required,
                    Validators.nullValidator
                ])]
            })
        );

        // Adiciona o array de telefones ao fomrGroup
        this.phoneArray.forEach((item) => {
            (this.verticalStepperForm.get('step3').get('telefones') as FormArray).push(item);
        });

        // Create a phone number form group
        this.fileArray.push(
            this._formBuilder.group({
                arquivo: [null, Validators.compose([
                    Validators.required,
                    Validators.nullValidator
                ])]
            })
        );

        // Adiciona o array de telefones ao fomrGroup
        this.fileArray.forEach((item) => {
            (this.verticalStepperForm.get('step4').get('arquivos') as FormArray).push(item);
        });

        this._changeDetectorRef.markForCheck();
        this.phoneArray = [];
        this.fileArray = [];
    }

}
