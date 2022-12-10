import { Injectable } from "@angular/core";
import {
  HttpEvent,
  HttpInterceptor,
  HttpHandler,
  HttpHeaders,
  HttpRequest,
  HttpResponse,
  HttpErrorResponse
} from "@angular/common/http";
import { from, Observable, throwError, TimeoutError } from "rxjs";
import { map, catchError, finalize, timeout } from "rxjs/operators";

import { AuthService } from "../service/auth.service";

@Injectable()
export class LogoutInterceptor implements HttpInterceptor {
  constructor(private authenticationService: AuthService) {}

  intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    return next.handle(request).pipe(
      catchError((error) => {
        console.log(
          "🚀 ~ file: logout.interceptor.ts ~ line 26 ~ LogoutInterceptor ~ catchError ~ error",
          error
        );
        // handle only 401 error
        if (error instanceof HttpErrorResponse && error.status === 401) {
          from(this.handleRequest(request));
          return throwError(error);
        }

        return next.handle(request);
      })
    );
  }

  private async handleRequest(request: HttpRequest<any>) {
    const isRetriedRequest = request.headers.get("retry");
    console.log(
      "🚀 ~ file: logout.interceptor.ts ~ line 43 ~ LogoutInterceptor ~ handleRequest ~ isRetriedRequest",
      request.headers
    );

    if (isRetriedRequest) {
      await this.authenticationService.logoutUser();
    }
  }
}
