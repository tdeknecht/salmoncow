// cognito javascript SDK install (https://github.com/aws-amplify/amplify-js/tree/master/packages/amazon-cognito-identity-js#setup)
import React from 'react';

function SignUpFormFunc() {
  const handleSubmit = (event) => {
    event.preventDefault(); // prevents loading new window on event
    awsCognitoSignUp({
      name: name,
      email: email, 
      password: password,
    });
  }

  const [name, setName] = React.useState('');
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');

  return (
    <form onSubmit={event => {handleSubmit(event)}}>
      <label>
        <input type="text" name="name" placeholder="Name" value={name} onChange={(event) => setName(event.target.value)} required />
      </label><br/>
      <label>
        <input type="text" name="email" placeholder="Email" value={email} onChange={(event) => setEmail(event.target.value)} required />
      </label><br/>
      <label>
        <input type="password" name="password" placeholder="Password" value={password} onChange={(event) => setPassword(event.target.value)} required />
      </label><br/>
      <input type="submit" value="Join" />
    </form>
  );
}

export default SignUpFormFunc

var AmazonCognitoIdentity = require("amazon-cognito-identity-js");

const poolData = {
  UserPoolId: 'us-east-1_vM9ZeVvX6',
  ClientId: '1kpdb8dcjqpv7i9fhh1859rkbu'
}

const userPool = new AmazonCognitoIdentity.CognitoUserPool(poolData);

function awsCognitoSignUp(formData) {
  const attributes = [
    { Name: 'name', Value: formData.name }
  ]
  userPool.signUp(formData.email, formData.password, attributes, null, function(
    err,
    result
  ) {
    if (err) {
      alert(err.message || JSON.stringify(err));
      return;
    }
    var cognitoUser = result.user;
    console.log('user name is ' + cognitoUser.getUsername());
    // confirmUser(cognitoUser);
  });
}

// Prompts the NEW user to input a confirmation code sent to them by Cognito (if confirmation set to TRUE)
function confirmUser(user) {
  const confirmCode = prompt('Confirmation code:');
  // user here is an instance of CognitoUser, so it already inherits necessary method
  // otherwise I would have to define a new cognitoUser if handled independently
  user.confirmRegistration(confirmCode, true, onConfirmed);
}

function onConfirmed(err) {
  if (err) {
    return alert (JSON.stringify(err));
  } else {
    alert('Success');
  }
}
