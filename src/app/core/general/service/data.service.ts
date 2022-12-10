import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of, throwError } from 'rxjs';
import { EMPTY } from 'rxjs/internal/observable/empty';
import { catchError } from 'rxjs/internal/operators/catchError';
import { map } from 'rxjs/internal/operators/map';
import { retry, tap } from 'rxjs/operators';
@Injectable({
  providedIn: 'root',
})
export class DataService {
  constructor(private http: HttpClient) {}
  getMethod(endpoint: any) {
    return this.http.get(endpoint).pipe(
      map((response: any) => response),
      catchError((err, caught) => EMPTY)
    );
  }
  postMethod(endpoint: any, body: any) {
    return this.http.post(endpoint, body).pipe(
      map((response: any) => response),
      catchError(this.handleError)
    );
  }
  patchMethod(endpoint: any, body: any) {
    return this.http.patch(endpoint, body).pipe(
      map((response: any) => response),
      catchError((err, caught) => EMPTY)
    );
  }
  handleError(error: any) {
    // console.log(
    //   "🚀 ~ file: data.service.ts ~ line 31 ~ DataService ~ handleError ~ error",
    //   error
    // );
    let errorMessage = '';
    if (error.error instanceof ErrorEvent) {
      // client-side error
      errorMessage = `Error: ${error.error.message}`;
    } else {
      // server-side error
      errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
    }
    // window.alert(errorMessage);
    return throwError(error);
  }
}
