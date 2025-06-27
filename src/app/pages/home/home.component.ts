import {Component, computed, inject, OnInit, Signal} from '@angular/core'
import {TableComponent} from '../../shared/components/table/table.component';
import {HomeStore} from '../../store/home/home.store';
import {MatTableDataSource} from '@angular/material/table';
import {PeriodicElement} from '../../store/home/home.model';
import {MatButton} from '@angular/material/button';
import {ComponentType} from '@angular/cdk/portal';
import {DialogComponent} from '../../shared/components/dialog/dialog.component';
import {ConfirmationDialogComponent} from '../../shared/components/сonfirmationDialog/сonfirmation-dialog.component';
import {MatDialog} from '@angular/material/dialog';

@Component({
  selector: 'app-home',
  templateUrl: 'home.component.html',
  styleUrl: 'home.component.scss',
  imports: [
    TableComponent,
    MatButton
  ],
  standalone: true
})
export class HomeComponent implements OnInit {
  homeState = inject(HomeStore);
  readonly dialog = inject(MatDialog);
  tableDataSource: Signal<MatTableDataSource<PeriodicElement>> = computed(() =>
    new MatTableDataSource(this.homeState.elements())
  );

  ngOnInit(): void {
    this.initializeData();
  }

  initializeData(): void {
    this.homeState.getData();
    this.homeState.getDateColum();
  }

  openDialog(item?: PeriodicElement, type?: string): void {
    if (type) {
      const isType = ['save', 'create'].includes(type);
      const dialogComponent: ComponentType<DialogComponent | ConfirmationDialogComponent> = isType
        ? DialogComponent
        : ConfirmationDialogComponent;
      const dialogRef = this.dialog.open(dialogComponent, {
        data: {...item, type},
        width: isType ? '400px' : ''
      });

      dialogRef.afterClosed().subscribe(result => {
        if (result) {
          switch (type) {
            case 'create':
              this.homeState.createData(result);
              this.homeState.openSnackBar(`Create ${result.name}`)
              break
            case 'save':
              this.homeState.editData({...result, position: item?.position});
              this.homeState.openSnackBar(`Save ${item?.name}`)
              break
            case 'delete':
              this.homeState.deleteData(item?.position);
              this.homeState.openSnackBar(`delete ${item?.name}`)
              break
          }
        }
      });
    }
  }
}
