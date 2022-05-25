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
import { Dashboard } from './components/Dashboard/Dashboard';
import RegistrationForm from './components/RegistrationForm/RegistrationForm';
// import { fakeAuthProvider } from './utils/fakeAuthProvider';
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
          <Route path='/loginpage' element={<DemoLoginPage />} />
          <Route
            path="/dashboard"
            element={
              <RequireAuth>
                <Dashboard />
              </RequireAuth>
            }
          />
          <Route
            path="/protected"
            element={
              <RequireAuth>
                <ProtectedPage />
              </RequireAuth>
            }
          />
          <Route
            path="*"
            element={
              <main style={{ padding: "1rem" }}>
                <p>There's nothing here!</p>
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
          <Link to="/">Demo Public Page</Link>
        </li>
        <li>
          <Link to="/protected">Demo Protected Page</Link>
        </li>
        <li>
          <Link to="/loginpage">Demo Login Page</Link>
        </li>
        <li>
          <Link to="/dashboard">Demo Dashboard Page</Link>
        </li>
        {/* <li>
          <Link to="/login">Login Page</Link>
        </li>
        <li>
          <Link to="/register">Registration Page</Link>
        </li> */}
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

function DemoLoginPage() {
  let location = useLocation();
  let auth = useAuth();

  let from = location.state?.from?.pathname || '/';

  function handleSubmit(event) {
    event.preventDefault();

    let formData = new FormData(event.currentTarget);

    const loginProps={
      loginDetails : {
        'Username' : formData.get('username'),
        'Password' : formData.get('password'),
      },
      from : from,
    }

    auth.onLogin(loginProps, () => {
      console.log("navigate() used to be here, but isn't getting called for some reason...")
    });
  }

  return (
    <div>
      <p>You must log in to view the page at {from}</p>

      <form onSubmit={handleSubmit}>
        <label>
          Username: <input name="username" type="text" />
        </label>{' '}
        <label>
          Password: <input name="password" type="text" />
        </label>{' '}
        <button type="submit">Login</button>
      </form>
    </div>
  );
}

function ProtectedPage() {
  return <h3>Protected page</h3>;
}
