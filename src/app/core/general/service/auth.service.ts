import { Injectable } from '@angular/core';
import {
  HttpClient,
  HttpErrorResponse,
  HttpHeaders,
} from '@angular/common/http';
import { empty, Observable, of, Subject, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

import { HttpApi } from '../http/http-api';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import { SocialAuthService } from '@abacritt/angularx-social-login';

const OAUTH_DATA = environment.oauth;

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  userSub = new Subject();
  constructor(
    private http: HttpClient,
    private router: Router,
    private readonly _authService: SocialAuthService
  ) {}

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
  setUser(user: any) {
    this.userSub.next(user);
  }
  getUser() {
    return this.userSub;
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
            localStorage.setItem('session', JSON.stringify(response));

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
    return localStorage.getItem('session') ? true : false;
  }

  logout() {
    let headers = new HttpHeaders();
    headers = headers.set('Content-Type', 'application/json');
    headers = headers.set('Authorization', 'Bearer ' + this.refreshToken);
    let rtoken = this.refreshToken;
    return this.http
      .post(HttpApi.userLogout, { refresh_token: rtoken }, { headers: headers })
      .pipe(
        map((response: any) => {
          console.log(response);

          return response;
        })
      );
  }
  logoutUser() {
    this.logout().subscribe(
      (x: any) => {
        localStorage.clear();
        this.router.navigate(['/splash']);
        this.setUser(null);
      },
      (err: any) => {
        // console.log(
        //   "🚀 ~ file: auth.service.ts ~ line 186 ~ AuthService ~ logoutUser ~ err",
        //   err
        // );
        this.setUser(null);
        this._authService.signOut();
        localStorage.clear();
        this.router.navigate(['/splash']);
      }
    );
  }
  get googleToken() {
    return localStorage['googleUser']
      ? JSON.parse(localStorage['googleUser']).idToken
      : null;
  }
  get accessToken() {
    return localStorage['session']
      ? JSON.parse(localStorage['session']).access.token
      : null;
  }

  get refreshToken() {
    let session: any = localStorage.getItem('session');
    let refresh = JSON.parse(session)?.refresh.token;
    return session ? refresh : null;
  }
}
