// https://docs.aws.amazon.com/cognito/latest/developerguide/user-pool-lambda-pre-sign-up.html

exports.handler = function(event, context, callback) {
  event.response.autoConfirmUser = true;
  // event.response.autoVerifyEmail = true;
  // event.response.autoVerifyPhone = true;
  
  context.done(null, event);
}
