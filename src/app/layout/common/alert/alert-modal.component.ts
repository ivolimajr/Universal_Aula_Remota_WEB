import {Component, Inject} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';

export interface DialogData {
    title: string;
    content: string;
    oneButton: boolean;
}

@Component({
  selector: 'app-delete-modal',
  templateUrl: './alert-modal.component.html',
  styleUrls: ['./alert-modal.component.scss']
})
export class AlertModalComponent {

    constructor(
        public dialogRef: MatDialogRef<AlertModalComponent>,
        @Inject(MAT_DIALOG_DATA) public data: DialogData) {}

  onNoClick(): void {
        this.dialogRef.close();
    }
}
