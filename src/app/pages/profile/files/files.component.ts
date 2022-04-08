import {ChangeDetectorRef, Component, Input, OnDestroy, OnInit} from '@angular/core';
import {Observable, Subscription} from 'rxjs';
import {MatSnackBar} from '@angular/material/snack-bar';
import {MatDialog} from '@angular/material/dialog';
import {FileModel} from '../../../shared/models/file.model';
import {UserService} from '../../../shared/services/http/user.service';
import {AlertModalComponent} from '../../../layout/common/alert/alert-modal.component';

@Component({
    selector: 'app-files',
    templateUrl: './files.component.html'
})

export class FilesComponent implements OnInit, OnDestroy {
    @Input() userId: number;
    @Input() items: FileModel[];
    loading: boolean;
    files: Set<File>;
    private fileModel = new FileModel();
    private file$: Subscription;

    constructor(
        public _dialog: MatDialog,
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
            return this.closeAlerts();
        }
        this.fileModel.userId = this.userId;
        this.files.forEach((item) => {
            this.fileModel.files.push(item);
        });
        this.loading = true;
        this.file$ = this._userServices.createFormEncoded(this.fileModel, '/files-upload').subscribe((res: FileModel[]) => {
            if (res.length === 0) {
                return;
            }
            this.removeItemFromFileList();
            res.forEach((item) => {
                this.items.push(item);
            });
            this.openSnackBar('Upload completo!');
            this.closeAlerts();
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
        if (this.file$) {
            this.file$.unsubscribe();
        }
    }

    removeFile(fileModel: FileModel): void {
        this.loading = true;
        this._changeDetectorRef.markForCheck();
        if (fileModel.id === 0 && this.items.length > 1) {
            this.removeItemFromFileList(fileModel);
            return this.closeAlerts();
        }
        if (this.items.length === 1) {
            this.openSnackBar('Remoção Inválida', 'warn');
            return this.closeAlerts();
        }
        const dialogRef = this._dialog.open(AlertModalComponent, {
            width: '280px',
            data: {title: 'Confirma remoção do arquivo?'}
        });
        dialogRef.afterClosed().subscribe((result) => {
            if (!result) {
                return this.closeAlerts();
            }
            this.removeFileFromApi(fileModel.id).subscribe((res: any) => {
                if (res) {
                    this.openSnackBar('Removido');
                    this.removeItemFromFileList(fileModel);
                    return this.closeAlerts();
                }
                this.openSnackBar('Remoção Inválida', 'warn');
                return this.closeAlerts();
            });
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

    private removeItemFromFileList(file?: FileModel): void {
        if (file) {
            const index = this.items.indexOf(file);
            if (index > -1) {
                this.items.splice(index, 1);
            }
        }
        this.items.forEach((item) => {
            if (!item.id) {
                const index = this.items.indexOf(item);
                if (index > -1) {
                    this.items.splice(index, 1);
                }
            }
        });
    }

    private removeFileFromApi(id: number): Observable<boolean> {
        return this._userServices.removeFile(id);
    }

    private closeAlerts(): void {
        this.loading = false;
        this._changeDetectorRef.markForCheck();
    }
}
