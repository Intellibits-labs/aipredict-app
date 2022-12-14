import {
  FacebookLoginProvider,
  GoogleLoginProvider,
  SocialAuthService,
  SocialUser,
} from '@abacritt/angularx-social-login';
import {
  Component,
  ElementRef,
  Input,
  OnInit,
  SimpleChanges,
  ViewChild,
} from '@angular/core';
import { ModalController } from '@ionic/angular';
import { HttpApi } from 'src/app/core/general/http/http-api';
import { CookieService } from 'src/app/core/general/service/cookie.service';
import { DataService } from 'src/app/core/general/service/data.service';

@Component({
  selector: 'app-login-modal',
  templateUrl: './login-modal.component.html',
  styleUrls: ['./login-modal.component.scss'],
})
export class LoginModalComponent implements OnInit {
  @Input('retracted') retracted: boolean = false;
  user: SocialUser | undefined;

  constructor(
    private readonly _authService: SocialAuthService,
    private cookieService: CookieService,
    private modalController: ModalController,
    private dataService: DataService
  ) {}

  ngOnInit() {
    // (P x r x t) ÷ 100;

    console.log(12000 * 12);

    // this.cookieService.deleteCookie('idToken');
    this._authService.authState.subscribe((user: any) => {
      this.user = user;
      console.log('🚀 ~ 37 ~ LoginModalComponent  ~ user', user);
      if (user) {
        this.cookieService.setCookie({ name: 'idToken', value: user.idToken });
        localStorage.setItem('googleUser', JSON.stringify(user));
        this.dataService
          .postMethod(HttpApi.googleLogin, { idToken: user.idToken })
          .subscribe({
            next: (res) => {
              console.log(res);
              localStorage.setItem('user', JSON.stringify(res.user));
              localStorage.setItem('session', JSON.stringify(res.tokens));
            },
            error: (e) => console.log(e.message),
            complete: () => console.log('complete'),
          });
        this.modalController.dismiss();
      }
    });
  }
  dismiss() {
    this.modalController.dismiss();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes[0]) {
      this.retracted = changes[0].currentValue;
    }
  }

  signOut(): void {
    this._authService.signOut();
  }
}
