// Used some of this guide: https://medium.com/technoetics/create-basic-login-forms-using-react-js-hooks-and-bootstrap-2ae36c15e551
// AWS Cognito guide: https://github.com/aws-amplify/amplify-js/tree/master/packages/amazon-cognito-identity-js#setup

import React, {useState} from 'react';

import './App.css';

import Home from './components/Home/Home';
import Header from './components/Header/Header';
import LoginForm from './components/LoginForm/LoginForm';
import RegistrationForm from './components/RegistrationForm/RegistrationForm';
import AlertComponent from './components/AlertComponent/AlertComponent'; 
import PrivateRoute from './utils/PrivateRoute';

import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';

import logo from './images/salmoncow.png';
import {
  BrowserRouter as Router,
  Switch,
  Route
} from 'react-router-dom';

export default function App() {
  const [title, updateTitle] = useState(null);
  const [errorMessage, updateErrorMessage] = useState(null);

  return (
    <Router>
      <Header title={title} updateTitle={updateTitle} />
      <Grid
        container
        spacing={0}
        direction="column"
        alignItems="center"
        style={{ minHeight: '100vh' }}
      >
        <img src={logo} className='logo' alt='logo' />
          <Switch>
            <Route path='/register'>
              <RegistrationForm showError={updateErrorMessage} updateTitle={updateTitle} />
            </Route>
            <Route path='/login'>
              <LoginForm showError={updateErrorMessage} updateTitle={updateTitle} />
            </Route>
            <PrivateRoute path='/'>
              <Home />
            </PrivateRoute>
          </Switch>
          <AlertComponent errorMessage={errorMessage} hideError={updateErrorMessage} />
        <p className='footer'>
          This is a dev site. Nothing will be saved. It's simply an experimental <a href='https://github.com/tdeknecht/salmoncow' target='_blank' rel='noopener noreferrer'>side project</a>.
        </p>
      </Grid>
    </Router>
  );
}

// function App() {
//   return (
//     <div>
//       <img src={logo} className='App-logo' alt='logo' />
//       <Welcome name='Tyler D' />
//     </div>
//   );
// }
// export default App;

// (A) function approach to Welcome
// function Welcome(props) {
//   return <h1>Hello, {props.name}</h1>;
// }

// (B) alternative syntax to above. Useful for defining functions within a function...?
// const Welcome = (props) => {
//   return <h1>Hello, {props.name}</h1>;
// }

// (C) class approach to Welcome
// class Welcome extends React.Component {
//   render() {
//     return <h1>Hello, {this.props.name}</h1>;
//   }
// }
