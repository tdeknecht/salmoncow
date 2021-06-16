import React from 'react';
import logo from './salmoncow.png';
import './App.css';
import AwsCognitoSignUp from './AwsCognito';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
      </header>
      
      <Welcome name="Tyler" />

      <SignupFormFunc />

    </div>
  );
}

export default App;

// this is equivalent to class Welcome below
function Welcome(props) {
  return <h1>Hello, {props.name}</h1>;
}

// class Welcome extends React.Component {
//   render() {
//     return <h1>Hello, {this.props.name}</h1>;
//   }
// }

function SignupFormFunc() {
  const handleSubmit = (event) => {
    event.preventDefault();
    console.log(event)
    // AwsCognitoSignUp(event);
  }

  const [email, setEmail] = React.useState('');

  const [password, setPassword] = React.useState('');

  return (
    <form onSubmit={event => {handleSubmit(event)}}>
      <label>
        <input type="text" name="email" placeholder="Email" value={email} onChange={(event) => setEmail(event.target.value)} required />
      </label>
      <label>
        <input type="password" name="password" placeholder="Password" value={password} onChange={(event) => setPassword(event.target.value)} required />
      </label>
      <input type="submit" value="Join" />
    </form>
  );
}

// class SignupForm extends React.Component {
//   constructor(props) {
//     super(props);
//     this.state = {email: '', password: ''};
//     this.handleChange = this.handleChange.bind(this);
//     this.handleSubmit = this.handleSubmit.bind(this);
//   }

//   handleChange(event){
//     this.setState({
//       [event.target.name] : event.target.value
//     })
//   }
  
//   handleSubmit(event) {
//     event.preventDefault();
//     signUp(this.state);
//   }

//   render() {
//     return (
//       <form onSubmit={this.handleSubmit}>
//         <label>
//           <input type="text" name="email" placeholder="Email" value={this.state.email} onChange={this.handleChange} required />
//         </label>
//         <label>
//           <input type="password" name="password" placeholder="Password" value={this.state.password} onChange={this.handleChange} />
//         </label>
//         <input type="submit" value="Join" />
//       </form>
//     );
//   }
// }


// var AmazonCognitoIdentity = require("amazon-cognito-identity-js");

// const poolData = {
//   UserPoolId: 'us-east-1_vM9ZeVvX6',
//   ClientId: '1kpdb8dcjqpv7i9fhh1859rkbu'
// }

// const userPool = new AmazonCognitoIdentity.CognitoUserPool(poolData);

// function signUp(formData) {
//   // attributes that should be placed onto user object
//   // I have no additional attributes, but this is a good reference for how
//   const attributes = [
//     // { Name: 'name', Value: formData.name }
//   ]
//   userPool.signUp(formData.email, formData.password, attributes, null, onSignUp);
// }

// function onSignUp(err, userData) {
//   if (err) {
//     // alert (JSON.stringify(err)); // page alert if there's an error (invalid password, user exists, etc.)
//     return alert (JSON.stringify(err));
//   } else {
//     console.log(userData); // log if user was created successfully. useful for debugging
//     confirmUser(userData.user);
//   }
// }

// // allow user to put in their confirmation code if user is successfully created
// function confirmUser(user) {
//   const confirmCode = prompt('Confirmation code:'); // quick and dirty prompt box
//   // user here is an instance of CognitoUser, so it already inherits necessary method
//   user.confirmRegistration(confirmCode, true, onConfirmed);
// }

// function onConfirmed(err) {
//   if (err) {
//     return alert (JSON.stringify(err));
//   } else {
//     alert('Success');
//   }
// }
