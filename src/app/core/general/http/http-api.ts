export class HttpApi {
  // OAuth
  static oauthLogin = 'auth/login';
  static me = 'users/me';
  static profileme = 'profile/me';
  static profilesearch = 'profile/search';

  // Forget Password
  static forgetPassword = 'auth/email-send-otp';
  static verifyemailotp = 'auth/verifyemailotp';
  static resetPassword = 'auth/reset-password';

  static userRegister = 'user/register';
  static userLogin = 'user/login';
  static userLogout = 'user/revoketoken';
  static verifyOtp = 'user/verifyotp';
  static refreshToken = 'auth/refresh-tokens';

  //  googleLogin
  static googleLogin = 'auth/google';
}
