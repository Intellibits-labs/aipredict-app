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
  static facebookLogin = 'auth/facebook';

  // Prediction
  static searchStock = 'stock/search/';
  static getStock = 'stock/quote/';
  static predictionNew = 'prediction/new';
  static getPredictionMy = 'prediction/my';
  static userPredictors = 'users/predictors';
  static singlePredictor = 'prediction/user/';
  static getPrediction = 'prediction';
  static searchPredction = 'prediction/search/';

  // Stock
  static getStocks = 'stock';
  static predictionStock = 'prediction/stock/';

  // Search
  static getSearch = 'stock/searchstock/';
}
