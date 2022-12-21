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
  static userLogout = 'auth/logout';
  static verifyOtp = 'user/verifyotp';
  static refreshToken = 'auth/refresh-tokens';

  //  googleLogin
  static googleLogin = 'auth/google';

  // Prediction
  static searchStock = 'stock/search/';
  static getStock = 'stock/quote/';
  static predictionNew = 'prediction/new';
  static getPrediction = 'prediction';
  static userPredictors = 'users/predictors';
  static singlePredictor = 'prediction/user/';

  // Stock
  static getStocks = 'stock';
  static singleStock = 'prediction/';

  // Search
  static getSearch = 'stock/searchstock/';
}
