import {Component, Input, OnInit} from '@angular/core';
import {FileModel} from '../../../shared/models/file.model';

@Component({
    selector: 'app-files',
    templateUrl: './files.component.html'
})
export class FilesComponent implements OnInit {
    @Input() idUser: number;
    @Input() items: FileModel[];

    constructor() {
    }

    ngOnInit(): void {
        console.log(this.items);
    }

    trackByFn(index: number, item: any): any {
        return item.id || index;
    }

}
