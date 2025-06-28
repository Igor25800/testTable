import {Component, DestroyRef, inject, OnInit, signal} from '@angular/core';
import {
  MAT_DIALOG_DATA, MatDialog,
  MatDialogActions,
  MatDialogClose,
  MatDialogContent, MatDialogRef,
  MatDialogTitle
} from '@angular/material/dialog';
import {MatFormField, MatInput, MatLabel} from '@angular/material/input';
import {MatButton} from '@angular/material/button';
import {TableComponent} from '../table/table.component';
import {FormControl, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {ConfirmationDialogComponent} from '../сonfirmationDialog/сonfirmation-dialog.component';
import {TitleCasePipe} from '@angular/common';
import {takeUntilDestroyed} from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-dialog',
  templateUrl: 'dialog.component.html',
  styleUrl: 'dialog.component.scss',
  imports: [
    MatDialogContent,
    MatFormField,
    MatInput,
    MatButton,
    MatDialogClose,
    MatFormField,
    MatDialogActions,
    MatDialogTitle,
    MatLabel,
    ReactiveFormsModule,
    TitleCasePipe
  ],
  standalone: true
})

export class DialogComponent implements OnInit {
  private _destroyRef = inject(DestroyRef);
  readonly dialog = inject(MatDialog);
  readonly dialogRef = inject(MatDialogRef<TableComponent>);
  data = inject(MAT_DIALOG_DATA);
  dialogForm!: FormGroup;
  title = signal('Edit');

  ngOnInit(): void {
    this.getForm();
    this.title.set(this.data.type)
  }

  getForm(): void {
    this.dialogForm = new FormGroup({
      name: new FormControl('', Validators.required),
      weight: new FormControl('', Validators.required),
      symbol: new FormControl('', Validators.required),
    })
    if (this.data) {
      this.dialogForm.patchValue(this.data);
    }
  }

  onNoClick(): void {
    if (this.dialogForm.invalid) {
      this.dialogForm.markAllAsTouched();
      return;
    }
    if (this.data.type === 'create') {
      this.dialogRef.close(this.dialogForm.value);
      return;
    }
    if (this.dialogForm.valid) {
      const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
        data: this.data,
      });

      dialogRef.afterClosed().pipe(
        takeUntilDestroyed(this._destroyRef)
      ).subscribe(result => {
        if (result) {
          this.dialogRef.close(this.dialogForm.value);
        }
      });
    }
  }
}

