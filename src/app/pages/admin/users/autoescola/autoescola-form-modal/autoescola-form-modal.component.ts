import {Component, Input, OnInit} from '@angular/core';

@Component({
    selector: 'app-autoescola-form-modal',
    templateUrl: './autoescola-form-modal.component.html'
})
export class AutoescolaFormModalComponent implements OnInit {

    @Input() id: number; //Se vier um ID, exibir e atualizar o usuário

    constructor() {
    }

    ngOnInit(): void {
        console.log(this.id);
    }

}
