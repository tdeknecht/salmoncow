import React, {useState} from 'react';
import './LoginForm.css';
import { withRouter } from 'react-router-dom';
import LoginCognitoUser from '../../utils/LoginCognitoUser'

import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import LoadingButton from '@mui/lab/LoadingButton';

function LoginForm(props) {
  const [state , setState] = useState({
    email : '',
    password : '',
    successMessage: null
  })

  const handleChange = (e) => {
    const {id , value} = e.target   
    setState(prevState => ({
      ...prevState,
      [id] : value
    }))
  }

  // Login Button
  const [disabled, setDisableButton] = React.useState(false); //https://sebhastian.com/react-disable-button/
  const [loading, setButtonLoading] = React.useState(false);

  const awsCognitoLogin = (p) => {
    const loginDetails={
      'Username' : p.email,
      'Password' : p.password,
    }

    LoginCognitoUser(loginDetails)
      .then(tokenSet => {
        localStorage.setItem(process.env.REACT_APP_COGNITO_REFRESH_TOKEN, tokenSet.getIdToken().getJwtToken());
        setState(prevState => ({
          ...prevState,
          'successMessage' : "Authentication successful."
        }))
        redirectToHome();
        props.showError(null);
      })
      .catch(err => {
        props.showError(err.message || JSON.stringify(err));
        setButtonLoading(false);
        setDisableButton(false);
      });
  }

  const redirectToHome = () => {
    props.updateTitle('Home')
    props.history.push('/');
  }

  const redirectToRegister = () => {
    props.updateTitle('Register');
    props.history.push('/register'); 
  }

  const onClick = (e) => {
    e.preventDefault();

    setButtonLoading(true);
    setDisableButton(true);

    awsCognitoLogin({
      email: state.email, 
      password: state.password,
    });
  }
  return(
    <Box
      component="form"
      justifyContent="center"
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        '& > :not(style)': { m: 1, width: '35ch' },
      }}
      noValidate
      autoComplete="off"
    >
      <TextField
        id="email"
        label="E-mail"
        variant="standard"
        required
        value={state.email}
        onChange={handleChange}
      />
      <TextField
          id="password"
          label="Password"
          variant="standard"
          required
          type="password"
          value={state.password}
          onChange={handleChange}
      />
      <LoadingButton
        style={{maxWidth: '100px', minWidth: '100px'}}
        onClick={onClick}
        loading={loading}
        disabled={disabled}
        variant='outlined'
      >
        Login
      </LoadingButton>
      <div>
        Don't have an account?
        <Button
          variant="text"
          onClick={() => redirectToRegister()}
        >
          Register
        </Button>
      </div>
    </Box>
  )

  // return(
  //   <div>
  //     <form>
  //       <div>
  //         <label htmlFor='inputEmail'>Email address</label>
  //         <input type='email' 
  //           className='form-control' 
  //           id='email' 
  //           aria-describedby='emailHelp' 
  //           placeholder='Enter email' 
  //           value={state.email}
  //           onChange={handleChange}
  //         />
  //         <small>We'll never share your email with anyone else.</small>
  //       </div>
  //       <div>
  //         <label htmlFor='inputPassword'>Password</label>
  //         <input type='password' 
  //           className='form-control' 
  //           id='password' 
  //           placeholder='Password'
  //           value={state.password}
  //           onChange={handleChange} 
  //         />
  //       </div>
  //       <LoadingButton
  //         style={{minWidth: '100px'}}
  //         onClick={onClick}
  //         loading={loading}
  //         disabled={disabled}
  //         variant='outlined'
  //       >
  //         Login
  //       </LoadingButton>
  //     </form>
  //     <div style={{display: state.successMessage ? 'block' : 'none' }} role='alert'>
  //       {state.successMessage}
  //     </div>
  //     <div>
  //       <span>Dont have an account? </span>
  //       <span onClick={() => redirectToRegister()}>Register</span> 
  //     </div>
  //   </div>
  // )
}
export default withRouter(LoginForm);
