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
import { environment } from 'src/environments/environment';

const APP_XHR_TIMEOUT = 30000;

@Injectable()
export class AppInterceptor implements HttpInterceptor {
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

    if (this.isAuthenticationRequired(req.url)) {
      return req.clone({
        url: `${environment.backend.host}/${req.url}`,
        headers,
      });
    } else {
      return req.clone({
        url: `${req.url}`,
        headers,
      });
    }
  }
  // Helpers and Casuistics
  private isAuthenticationRequired(apiUrl: any): boolean {
    // const blockedApiList = [HttpApi.oauthLogin, "assets/i18n"];
    return apiUrl.includes('assets/i18n', 'www.alphavantage.co') ? false : true;
  }

  private handleSuccessfulResponse(event: any): HttpResponse<any> {
    if (event instanceof HttpResponse) {
      event = event.clone({ body: event.body.response });
    }
    return event;
  }

  private handleErrorResponse(errorResponse: any): Observable<HttpEvent<any>> {
    if (errorResponse.url.includes('refresh-tokens')) {
      this.authService.logout();
      this.navCtrl.navigateRoot(['/']);
    }
    if (errorResponse instanceof TimeoutError) {
      return throwError('Timeout Exception');
    }

    switch (errorResponse.status) {
      case 401: // Unauthorized
        if (errorResponse.url.includes('login')) {
          return throwError(errorResponse.error);
        } else {
          return throwError(errorResponse);

          // this.authService.logout();
          // this.navCtrl.navigateRoot(['/']);
        }
        break;

      default: // Other Error
        return throwError(errorResponse.error);
    }

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
    console.log(`Request finished`);
  }
}
