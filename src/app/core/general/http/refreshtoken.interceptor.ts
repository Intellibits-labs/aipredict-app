import { Injectable } from '@angular/core';
import {
  HttpEvent,
  HttpInterceptor,
  HttpHandler,
  HttpHeaders,
  HttpRequest,
  HttpResponse,
} from '@angular/common/http';
import { Observable, throwError, TimeoutError } from 'rxjs';
import { map, catchError, finalize, timeout } from 'rxjs/operators';

import { HttpError } from './http-error';
import { Router } from '@angular/router';
import { AuthService } from '../service/auth.service';
import { HttpApi } from './http-api';
import { NavController } from '@ionic/angular';

const APP_XHR_TIMEOUT = 30000;

@Injectable()
export class RefreshTokenInterceptor implements HttpInterceptor {
  constructor(
    private authService: AuthService,
    private router: Router,
    private navCtrl: NavController
  ) {}

  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    return next.handle(this.performRequest(req)).pipe(
      timeout(APP_XHR_TIMEOUT),
      map((res) => this.handleSuccessfulResponse(res)),
      catchError((err) => this.handleErrorResponse(err)),
      finalize(this.handleRequestCompleted.bind(this))
    );
  }

  private performRequest(req: HttpRequest<any>): HttpRequest<any> {
    // console.log(
    //   "🚀 ~ file: http.interceptor.ts ~ line 37 ~ AppInterceptor ~ performRequest ~ req",
    //   req
    // );
    let headers: HttpHeaders = req.headers;

    return req.clone({
      url: `${req.url}`,
      headers,
    });
  }
  // Helpers and Casuistics
  private isAuthenticationRequired(apiUrl: string): boolean {
    const blockedApiList = [HttpApi.oauthLogin, 'assets/i18n'];
    return apiUrl.includes('assets/i18n') ? false : true;
  }

  private handleSuccessfulResponse(event: any): HttpResponse<any> {
    return event;
  }

  private handleErrorResponse(errorResponse: any): Observable<HttpEvent<any>> {
    let customError = new HttpError();
    try {
      customError = HttpError.initWithCode(
        errorResponse.error.errors[0].code
          ? errorResponse.error.errors[0].code
          : errorResponse.error.errors[0].message
      );
    } catch (e) {}

    return throwError(customError);
  }

  private handleRequestCompleted(): void {
    // console.log(`Request finished`);
  }
}
