const fakeAuthToken = () =>
  new Promise((resolve) => {
    setTimeout(() => resolve('abc123'), 250);
});

export { fakeAuthToken }
