import { SocialAuthService } from '@abacritt/angularx-social-login';
import { Directive, ElementRef, Input } from '@angular/core';
import { take } from 'rxjs';
declare var google: any;
@Directive({
  selector: 'google-signin-butt',
})
export class GoogleSigninButtonDirective {
  // constructor(el: ElementRef, socialAuthService: SocialAuthService) {
  //   socialAuthService.initState.pipe(take(1)).subscribe(() => {
  //     // @ts-ignore
  //     google.accounts.id.renderButton(el.nativeElement, {
  //       theme: 'filled_blue',
  //       size: 'medium',
  //       'data-logo_alignment': 'left',
  //       width: '100%',
  //     });
  //   });
  // }

  @Input('selectable') option!: boolean;

  constructor(
    private el: ElementRef,
    private socialAuthService: SocialAuthService
  ) {}

  ngOnInit() {
    if (!this.option) return;
    this.socialAuthService.initState.pipe(take(1)).subscribe(() => {
      google.accounts.id.renderButton(this.el.nativeElement, {
        type: 'standard',
        size: 'large',
        text: 'signin_with',
        theme: 'filled_blue',
        width: '300px',
        height: '50px',
      });
    });
  }
}
