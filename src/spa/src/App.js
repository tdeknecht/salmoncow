// Used some of this guide: https://medium.com/technoetics/create-basic-login-forms-using-react-js-hooks-and-bootstrap-2ae36c15e551
// AWS Cognito guide: https://github.com/aws-amplify/amplify-js/tree/master/packages/amazon-cognito-identity-js#setup

import React from 'react';
import {
  Routes,
  Route,
  Link,
  useNavigate,
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
import RegistrationForm from './components/RegistrationForm/RegistrationForm';
import { Dashboard } from './components/Dashboard/Dashboard';
import { AuthContext, AuthProvider } from './utils/AuthProvider';

export default function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="/home" element={<Home />} />
          <Route path='/register' element={<RegistrationForm />} />
          <Route path='/login' element={<LoginForm />} />
          <Route
            path="/dashboard"
            element={
              <RequireAuth>
                <Dashboard />
              </RequireAuth>
            }
          />
          <Route
            path="*"
            element={
              <main style={{ padding: "1rem" }}>
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
      <img src={logo} className='logo' alt='logo' />

      <AuthStatus />

      <ul>
        <li>
          <Link to="/">Home (Public)</Link>
        </li>
        <li>
          <Link to="/dashboard">Dashboard (Private)</Link>
        </li>
      </ul>

      <Outlet />

      <p className='footer'>
        This is a dev site. It's simply a fun <a href='https://github.com/tdeknecht/salmoncow' target='_blank' rel='noopener noreferrer'>side project</a>.
      </p>

      </Grid>
    </div>
  );
}

function useAuth() {
  return React.useContext(AuthContext);
}

function AuthStatus() {
  let auth = useAuth();
  let navigate = useNavigate();

  if (!auth.token) { // if used in Protected, remove this. Assumed already logged in
    return <p>You are not logged in.</p>;
  }

  return (
    <p>
      {/* Welcome {auth.token}!{' '} */}
      Welcome, user!
      <button
        onClick={() => {
          auth.onLogout(() => navigate('/'));
        }}
      >
        Sign out
      </button>
    </p>
  );
}

function RequireAuth({ children }) {
  const auth = useAuth();
  const location = useLocation();

  if (!auth.token) {
    // Redirect them to the /login page, but save the current location they were
    // trying to go to when they were redirected. This allows us to send them
    // along to that page after they login, which is a nicer user experience
    // than dropping them off on the home page.
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
}
