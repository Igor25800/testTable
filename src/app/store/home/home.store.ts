import {patchState, signalStore, withMethods, withState} from '@ngrx/signals';
import {headerTable} from './home.mock';
import {PeriodicElement} from './home.model';
import {inject} from '@angular/core';
import {DateTableService} from '../../shared/services/dateTable.service';
import {firstValueFrom} from 'rxjs';
import {MatSnackBar} from '@angular/material/snack-bar';

export interface homeState {
  elements: PeriodicElement[];
  isLoading: boolean;
  displayedColumns: string[];
  titleDialog: string
}

export const initialState: homeState = {
  elements: [],
  isLoading: false,
  displayedColumns: [],
  titleDialog: ''
};

export const HomeStore = signalStore(
  {providedIn: 'root'},
  withState<homeState>(initialState),
  withMethods((store, api = inject(DateTableService), snackBar = inject(MatSnackBar)) => ({
    async getData() {
      patchState(store, {isLoading: true});
      const elements = await firstValueFrom(api.getData());
      patchState(store, {elements, isLoading: false});
    },
    getDateColum() {
      patchState(store, {displayedColumns: headerTable});
    },
    createData(item: PeriodicElement) {
      item.position = store.elements().length + 1
      const updatedElements = [...store.elements(), item];
      patchState(store, {elements: updatedElements});
    },
    editData(item: PeriodicElement) {
      const updatedElements = store.elements().map((el: PeriodicElement) =>
        el.position === item.position ? {...el, ...item} : el);
      patchState(store, {elements: updatedElements});
    },
    deleteData(id: number | undefined) {
      if (id) {
        const updatedElements = store.elements().filter((el: PeriodicElement) => el.position !== id)
          .map((el: PeriodicElement, inx: number) => ({...el, position: inx + 1}));
        patchState(store, {elements: updatedElements})
      }
    },
    openSnackBar(message: string) {
      snackBar.open(message, 'Cancel', {
        duration: 1000,
      });
    }
  }))
)

