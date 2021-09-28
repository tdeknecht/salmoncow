import React, {useState} from 'react';
import './RegistrationForm.css';
import {USER_POOL_ID, CLIENT_ID} from '../../constants/cognito';

function RegistrationForm(props) {

  const [state , setState] = useState({
    email : "",
    password : "",
    confirmPassword : ""
  })

  const handleChange = (e) => {
    const {id , value} = e.target   
    setState(prevState => ({
      ...prevState,
      [id] : value
    }))
  }

  const handleSubmitClick = (e) => {
    e.preventDefault();
    if(state.password === state.confirmPassword) {
      awsCognitoSignUp({
        email: state.email, 
        password: state.password
      });
    } else {
      props.showError('Passwords do not match');
    }
  }

  // use case 1
  const AmazonCognitoIdentity = require("amazon-cognito-identity-js");
  const poolData = {
    UserPoolId: USER_POOL_ID,
    ClientId: CLIENT_ID,
  }
  const userPool = new AmazonCognitoIdentity.CognitoUserPool(poolData);
  
  const awsCognitoSignUp = (formData) => {
    const attributes = [
      // { Name: 'name', Value: formData.name }
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

      confirmUser(cognitoUser);
    });
  }

  // use case 2
  const confirmUser = (cognitoUser) => {
    const confirmCode = prompt('Confirmation code:')
    cognitoUser.confirmRegistration(confirmCode, true, function(err, result) {
      if (err) {
        alert(err.message || JSON.stringify(err));
        return;
      }
      console.log('call result: ' + result);
    });
  }

  return(
    <div className="card col-12 col-lg-4 login-card mt-2 hv-center">
      <form>
        <div className="form-group text-left">
        <label htmlFor="exampleInputEmail1">Email address</label>
        <input type="email" 
          className="form-control" 
          id="email" 
          aria-describedby="emailHelp" 
          placeholder="Enter email"
          value={state.email}
          onChange={handleChange}
        />
        <small id="emailHelp" className="form-text text-muted">We'll never share your email with anyone else.</small>
        </div>
        <div className="form-group text-left">
          <label htmlFor="exampleInputPassword1">Password</label>
          <input type="password" 
            className="form-control" 
            id="password" 
            placeholder="Password"
            value={state.password}
            onChange={handleChange} 
          />
        </div>
        <div className="form-group text-left">
          <label htmlFor="exampleInputPassword1">Confirm Password</label>
          <input type="password" 
            className="form-control" 
            id="confirmPassword" 
            placeholder="Confirm Password"
            value={state.confirmPassword}
            onChange={handleChange} 
          />
        </div>
        <button 
          type="submit" 
          className="btn btn-primary"
          onClick={handleSubmitClick}
        >
          Register
        </button>
      </form>
    </div>
  )
}
export default RegistrationForm;
