/**
 * This represents some generic auth provider API, like Firebase. 
 * It shouldn't be part of my code design, but acts as an API
 */
const fakeAuthProvider = {
  isAuthenticated: false,
  signin(callback) {
    fakeAuthProvider.isAuthenticated = true;
    setTimeout(callback, 250); // fake async
  },
  signout(callback) {
    fakeAuthProvider.isAuthenticated = false;
    setTimeout(callback, 250);
  },
};
  
  export { fakeAuthProvider };