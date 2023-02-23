// Used some of this guide: https://medium.com/technoetics/create-basic-login-forms-using-react-js-hooks-and-bootstrap-2ae36c15e551
// AWS Cognito guide: https://github.com/aws-amplify/amplify-js/tree/master/packages/amazon-cognito-identity-js#setup

import React from 'react';
import {
  Routes,
  Route,
  Link,
  useLocation,
  Navigate,
  Outlet,
} from 'react-router-dom';

import Grid from '@mui/material/Grid';

import './App.css';
import logo from './images/salmoncow.png';

import Home from './components/Home/Home';
import Header from './components/Header/Header';
import LoginForm from './components/LoginForm/LoginForm';
import SignupForm from './components/SignupForm/SignupForm';
import { Dashboard } from './components/Dashboard/Dashboard';
import { AuthProvider } from './utils/AuthProvider';
import { UserPool } from './utils/UserPool';

export default function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route element={<Layout />}>
          <Route index element={<Home />} />
          <Route path='/home' element={<Home />} />
          <Route path='/signup' element={<SignupForm />} />
          <Route path='/login' element={<LoginForm />} />
          <Route
            path='/dashboard'
            element={
              <RequireAuth>
                <Dashboard />
              </RequireAuth>
            }
          />
          <Route
            path='*'
            element={
              <main style={{ padding: '1rem' }}>
                <p>404 Page not found.</p>
              </main>
            }
          />
        </Route>
      </Routes>
    </AuthProvider>
  );
}

function Layout() {
  return (
    <div>
      <Header />
      <Grid
        container
        spacing={0}
        direction='column'
        alignItems='center'
        style={{ minHeight: '100vh' }}
      >
        <Link to='/'><img src={logo} className='logo' alt='logo' /></Link>

        <Outlet />

        <p className='footer'>
          This is a dev site. It's simply a fun <a href='https://github.com/tdeknecht/salmoncow' target='_blank' rel='noopener noreferrer'>side project</a>.
        </p>
      </Grid>
    </div>
  );
}

function RequireAuth({ children }) {
  // const { idToken } = React.useContext(AuthContext);
  const user = UserPool.getCurrentUser();
  
  const location = useLocation();

  if (!user) {
    // Redirect them to the /login page, but save the current location they were
    // trying to go to when they were redirected. This allows us to send them
    // along to that page after they login, which is a nicer user experience
    // than dropping them off on the home page.
    return <Navigate to='/login' state={{ from: location }} replace />;
  }

  return children;
}
