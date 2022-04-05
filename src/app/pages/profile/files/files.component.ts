import {ChangeDetectorRef, Component, Input, OnDestroy, OnInit} from '@angular/core';
import {FileModel, FileModelUpdate} from '../../../shared/models/file.model';
import {MatSnackBar} from '@angular/material/snack-bar';
import {UserService} from '../../../shared/services/http/user.service';
import {Subscription} from 'rxjs';

@Component({
    selector: 'app-files',
    templateUrl: './files.component.html'
})

export class FilesComponent implements OnInit, OnDestroy {
    @Input() userId: number;
    @Input() items: FileModel[];
    loading: boolean;
    files: Set<File>;
    private fileModel = new FileModelUpdate();
    private user$: Subscription;

    constructor(
        private _snackBar: MatSnackBar,
        private _changeDetectorRef: ChangeDetectorRef,
        private _userServices: UserService
    ) {
        this.files = new Set();
        this.fileModel.files = [];
    }

    ngOnInit(): void {
    }

    trackByFn(index: number, item: any): any {
        return item.id || index;
    }

    save(): void {
        if (this.files.size === 0) {
            return this.openSnackBar('Sem arquivos para atualizar', 'warn');
        }
        this.fileModel.userId = this.userId;
        this.files.forEach((item) => {
            this.fileModel.files.push(item);
        });
        this.loading = true;
        this.user$ = this._userServices.createFormEncoded(this.fileModel, '/files-upload').subscribe((res: any) => {
            console.log(res);
            if (res.error) {
                return;
            }
            console.log(this.items);
            this.items = [...res];
            console.log(this.items);
            this.loading = false;
            this.openSnackBar('Upload completo');
            this._changeDetectorRef.markForCheck();
        });
    }

    uploadFile(event: any): void {
        // eslint-disable-next-line @typescript-eslint/consistent-type-assertions
        const selectedFiles = <FileList>event.srcElement.files;
        // eslint-disable-next-line @typescript-eslint/prefer-for-of
        for (let i = 0; i < selectedFiles.length; i++) {
            if (selectedFiles[i].name.length < 50) {
                this.files.add(selectedFiles[i]);

                const newFile = new FileModel();
                newFile.file = selectedFiles[i];
                newFile.fileName = selectedFiles[i].name;
                newFile.extension = selectedFiles[i].type.replace(/(.*)\//g, '.');
                this.items.push(newFile);
                this._changeDetectorRef.markForCheck();
            } else {
                return this.openSnackBar('Nome do arquivo muito gande', 'warn');
            }
        }
    }

    ngOnDestroy(): void {
        if (this.user$) {
            this.user$.unsubscribe();
        }
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
