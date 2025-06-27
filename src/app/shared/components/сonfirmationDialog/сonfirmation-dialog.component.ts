import {ChangeDetectionStrategy, Component, inject, OnInit, signal} from '@angular/core';
import {MatButton} from '@angular/material/button';
import {
  MAT_DIALOG_DATA,
  MatDialogActions,
  MatDialogClose,
  MatDialogRef,
  MatDialogTitle
} from '@angular/material/dialog';
import {DialogComponent} from '../dialog/dialog.component';
import {TitleCasePipe} from '@angular/common';

@Component({
  selector: 'app-dialog',
  templateUrl: 'сonfirmation-dialog.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    MatButton,
    MatDialogActions,
    MatDialogClose,
    MatDialogTitle,
    TitleCasePipe,
  ],
  standalone: true
})
export class ConfirmationDialogComponent {
  readonly dialogRef = inject(MatDialogRef<DialogComponent>);
  data = inject(MAT_DIALOG_DATA);
  title = signal<string>('Confirmation');
  typeNameBtn = signal<string>(this.data.type);

  save(): void {
    this.dialogRef.close(true);
  }
}
