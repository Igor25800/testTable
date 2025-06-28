import {ChangeDetectionStrategy, Component, DestroyRef, inject, input, OnInit, output} from '@angular/core'
import {
  MatCell,
  MatCellDef,
  MatColumnDef,
  MatHeaderCell,
  MatHeaderCellDef,
  MatHeaderRow, MatHeaderRowDef, MatNoDataRow, MatRow, MatRowDef,
  MatTable, MatTableDataSource
} from '@angular/material/table';
import {MatFormField, MatInput, MatLabel} from '@angular/material/input';
import {MatButton} from '@angular/material/button';
import {PeriodicElement} from '../../../store/home/home.model';
import {debounceTime, distinctUntilChanged, Subject} from 'rxjs';
import {takeUntilDestroyed} from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-table',
  templateUrl: 'table.component.html',
  styleUrl: 'table.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    MatTable,
    MatColumnDef,
    MatHeaderCell,
    MatCell,
    MatHeaderCellDef,
    MatCellDef,
    MatHeaderRow,
    MatRow,
    MatHeaderRowDef,
    MatRowDef,
    MatFormField,
    MatLabel,
    MatInput,
    MatNoDataRow,
    MatButton
  ],
  standalone: true
})

export class TableComponent implements OnInit {
  private _filterSubject = new Subject<string>();
  private _destroyRef = inject(DestroyRef);
  displayedColumns = input.required<string[]>();
  dataSource = input.required<MatTableDataSource<PeriodicElement>>();
  eventOpenDialog = output<{ type: string, item: PeriodicElement }>();

  ngOnInit(): void {
    this.filter();
  }

  filter(): void {
    this._filterSubject.pipe(
      debounceTime(2000),
      distinctUntilChanged(),
      takeUntilDestroyed(this._destroyRef)
    ).subscribe(filterValue => {
      this.dataSource().filter = filterValue.trim().toLowerCase();
    });
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this._filterSubject.next(filterValue);
  }

  openDialog(item: PeriodicElement, type: string): void {
    this.eventOpenDialog.emit({type, item})
  }
}
