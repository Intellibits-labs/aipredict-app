import { Injectable, OnInit } from '@angular/core';
import { BehaviorSubject, Observable, of, Subject } from 'rxjs';
import { map } from 'rxjs/operators';
import { HttpApi } from '../http/http-api';
import { DataService } from './data.service';

@Injectable({
  providedIn: 'root',
})
export class ShortlistService {
  private shortList!: Observable<any[]>;

  constructor(private data: DataService) {
    // this.loadData();
  }

  loadData() {
    this.data.getMethod(HttpApi.shortlistedprofilesid).subscribe((res) => {
      this.shortList = res.data;
    });
  }
  getItems(): Observable<any[]> {
    if (this.shortList) {
      return this.shortList;
    } else {
      return this.data.getMethod(HttpApi.shortlistedprofilesid).pipe(
        map((res) => {
          return res.data;
          // return this.shortList;
        })
      );
    }
  }

  fetchData(): Observable<any[]> {
    return this.data.getMethod(HttpApi.shortlistedprofilesid).pipe(
      map((res) => {
        return res.data;
        // return this.shortList;
      })
    );
  }
  clearData() {
    this.shortList = of([]);
  }
}
