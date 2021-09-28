import React, {useState} from 'react';
import './LoginForm.css';
import {AWS_REGION, USER_POOL_ID, CLIENT_ID} from '../../constants/cognito';
import { withRouter } from "react-router-dom";
import * as AWS from 'aws-sdk/global';

function LoginForm(props) {
  const [state , setState] = useState({
    email : "",
    password : "",
    successMessage: null
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
    const payload={
      "email":state.email,
      "password":state.password,
    }

    // use case 4
    const authenticationDetails = new AmazonCognitoIdentity.AuthenticationDetails(
      payload
    );
    const poolData = {
      UserPoolId: USER_POOL_ID,
      ClientId: CLIENT_ID,
    }
    const userPool = new AmazonCognitoIdentity.CognitoUserPool(poolData);
    const userData = {
      Username: 'username',
      Pool: userPool,
    };
    const cognitoUser = new AmazonCognitoIdentity.CognitoUser(userData);

    cognitoUser.authenticateUser(authenticationDetails, {
      onSuccess: function(result) {
        const accessToken = result.getAccessToken().getJwtToken();
    
        AWS.config.region = AWS_REGION;
    
        AWS.config.credentials = new AWS.CognitoIdentityCredentials({
          IdentityPoolId: USER_POOL_ID,
          Logins: {
            ['cognito-idp.'+AWS_REGION+'.amazonaws.com/'+USER_POOL_ID]: result
              .getIdToken()
              .getJwtToken(),
          },
        });
    
        //refreshes credentials using AWS.CognitoIdentity.getCredentialsForIdentity()
        AWS.config.credentials.refresh(error => {
          if (error) {
            console.error(error);
          } else {
            // Instantiate aws sdk service objects now that the credentials have been updated.
            // example: var s3 = new AWS.S3();
            console.log('Successfully logged!');
          }
        });
      },
    
      onFailure: function(err) {
        alert(err.message || JSON.stringify(err));
      },
    });


    // axios.post(API_BASE_URL+'/user/login', payload)
    //   .then(function (response) {
    //     if(response.status === 200){
    //       setState(prevState => ({
    //         ...prevState,
    //         'successMessage' : 'Login successful. Redirecting to home page..'
    //       }))
    //       localStorage.setItem(ACCESS_TOKEN_NAME,response.data.token);
    //       redirectToHome();
    //       props.showError(null)
    //     }
    //     else if(response.code === 204){
    //       props.showError("Username and password do not match");
    //     }
    //     else{
    //       props.showError("Username does not exists");
    //     }
    //   })
    //   .catch(function (error) {
    //     console.log(error);
    //   });
  }

  const redirectToHome = () => {
    props.updateTitle('Home')
    props.history.push('/home');
  }

  const redirectToRegister = () => {
    props.history.push('/register'); 
    props.updateTitle('Register');
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
        <div className="form-check">
        </div>
        <button 
          type="submit" 
          className="btn btn-primary"
          onClick={handleSubmitClick}
        >Submit</button>
      </form>
      <div className="alert alert-success mt-2" style={{display: state.successMessage ? 'block' : 'none' }} role="alert">
        {state.successMessage}
      </div>
      <div className="registerMessage">
        <span>Dont have an account? </span>
        <span className="loginText" onClick={() => redirectToRegister()}>Register</span> 
      </div>
    </div>
  )
}

export default withRouter(LoginForm);