export function handler(event, context, callback) {
  event.response.autoVerifyEmail = true;
  // event.response.autoConfirmUser = true;
  // event.response.autoVerifyPhone = true;
  
  context.done(null, event);
}