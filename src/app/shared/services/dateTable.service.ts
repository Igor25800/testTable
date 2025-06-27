import {Injectable} from '@angular/core';
import {Observable, of} from 'rxjs';
import {PeriodicElement} from '../../store/home/home.model';
import {dataTable} from '../../store/home/home.mock';

@Injectable({providedIn: 'root'})

export class DateTableService {

  getData(): Observable<PeriodicElement[]> {
    return of(dataTable).pipe();
  }
}
