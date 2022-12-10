import { Injectable } from '@angular/core';
import {
  HttpClient,
  HttpErrorResponse,
  HttpHeaders,
} from '@angular/common/http';
import { empty, Observable, of, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

import { HttpApi } from '../http/http-api';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';

const OAUTH_DATA = environment.oauth;

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(private http: HttpClient, private router: Router) {}

  register(userRequest: any): Observable<any> {
    // const data = {
    //   // code: userRequest.codigo,
    //   email: userRequest.email,
    //   password: userRequest.password,
    // };

    return this.http.post(HttpApi.userRegister, userRequest).pipe(
      map((response: any) => {
        return response;
      })
    );
  }
  login(userRequest: any): Observable<any> {
    // const data = {
    //   // code: userRequest.codigo,
    //   email: userRequest.email,
    //   password: userRequest.password,
    // };

    return this.http.post(HttpApi.userLogin, userRequest).pipe(
      map((response: any) => {
        return response;
      })
    );
  }
  verifyOtp(userRequest: any): Observable<any> {
    // const data = {
    //   // code: userRequest.codigo,
    //   email: userRequest.email,
    //   password: userRequest.password,
    // };

    return this.http.post(HttpApi.verifyOtp, userRequest).pipe(
      map((response: any) => {
        return response;
      })
    );
  }

  loginWithUserCredentials(email: string, password: string): Observable<any> {
    let headers = new HttpHeaders();
    headers = headers.set('Content-Type', 'application/json');

    const body: any = {};
    // body.set("grant_type", "password");
    // body.set("client_id", OAUTH_DATA.client_id);
    // body.set("client_secret", OAUTH_DATA.client_secret);
    body['email'] = email;
    body['password'] = password;
    // body.set("scope", OAUTH_DATA.scope);

    return this.http.post(HttpApi.oauthLogin, body, { headers }).pipe(
      map((response: any) => {
        localStorage.setItem('token', JSON.stringify(response));
        return response;
      })
    );
  }

  loginWithRefreshToken(): Observable<any> {
    let headers = new HttpHeaders();
    headers = headers.set('Content-Type', 'application/json');
    headers = headers.set('Authorization', 'Bearer ' + this.refreshToken);
    headers = headers.set('Retry', 'True');

    const body = new URLSearchParams();
    body.set('grant_type', 'refresh_token');
    body.set('client_secret', OAUTH_DATA.client_secret);
    body.set('refresh_token', this.refreshToken);
    body.set('scope', OAUTH_DATA.scope);
    let rtoken = this.refreshToken;

    return this.http
      .post(
        HttpApi.refreshToken,
        { refreshToken: rtoken },
        { headers: headers }
      )
      .pipe(
        map(
          (response: any) => {
            let temp = {
              token: response.token,
              refresh_token: response.refreshToken,
            };
            localStorage.setItem('token', JSON.stringify(response));

            return response;
          },
          (error: any) => {
            console.log(
              '🚀 ~ file: auth.service.ts ~ line 138 ~ AuthService ~ loginWithRefreshToken ~ error',
              error
            );

            return error;
          }
        ),
        catchError(this.errorHandler)
      );
  }
  errorHandler(error: HttpErrorResponse) {
    console.log(
      '🚀 ~ file: auth.service.ts ~ line 146 ~ AuthService ~ errorHandler ~ error',
      error
    );
    return throwError(new Error('Unauthenticated'));
  }
  isLogged(): boolean {
    return localStorage.getItem('token') ? true : false;
  }
  isStatusIncomplete(): boolean {
    return localStorage.getItem('token') ? true : false;
  }
  isprofileStatusIncomplete(): any {
    let user: any = localStorage.getItem('user');
    let userData = JSON.parse(user);
    if (userData.personalInfoStatus == 0) {
      return 0;
    } else if (userData.verified == 1) {
      return 1;
    }
  }

  logout() {
    // let headers = new HttpHeaders();
    // headers = headers.set('Content-Type', 'application/json');
    // headers = headers.set('Authorization', 'Bearer ' + this.refreshToken);
    // let rtoken = this.refreshToken;
    // return this.http
    //   .post(HttpApi.userLogout, { refresh_token: rtoken }, { headers: headers })
    //   .pipe(
    //     map((response: any) => {
    //       return response;
    //     })
    //   );
  }
  logoutUser() {
    // this.logout().subscribe(
    //   (x) => {
    //     localStorage.clear();
    //     this.router.navigate(['/splash']);
    //   },
    //   (err) => {
    //     // console.log(
    //     //   "🚀 ~ file: auth.service.ts ~ line 186 ~ AuthService ~ logoutUser ~ err",
    //     //   err
    //     // );
    //     localStorage.clear();
    //     this.router.navigate(['/splash']);
    //   }
    // );
  }
  get googleToken() {
    return localStorage['user']
      ? JSON.parse(localStorage['user']).idToken
      : null;
  }
  get accessToken() {
    return localStorage['token']
      ? JSON.parse(localStorage['token']).access.token
      : null;
  }

  get refreshToken() {
    let session: any = localStorage.getItem('token');
    let refresh = JSON.parse(session)?.refresh.token;
    return session ? refresh : null;
  }
  get googleRefreshToken() {
    let session: any = localStorage.getItem('user');
    let refresh = JSON.parse(session)?.idToken;
    return session ? refresh : null;
  }
}
