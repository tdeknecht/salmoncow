import React from 'react';
import { withRouter } from "react-router-dom";

import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';

function Header(props) {
  const capitalize = (s) => {
      if (typeof s !== 'string') return ''
      return s.charAt(0).toUpperCase() + s.slice(1)
  }
  let title = capitalize(props.location.pathname.substring(1,props.location.pathname.length))

  if(props.location.pathname === '/') {
    title = 'Welcome'
  }

  function renderLogout() {
    if(props.location.pathname === '/'){
      return(
        <Button
          color="inherit"
          onClick={() => handleLogout()}
        >
          Logout
        </Button>
      )
    }
  }

  function handleLogout() {
    // TODO: Find a way to truly log out, not just delete local token
    // const { store } = this.context;
    // const state = store.getState();
    // state.cognito.user.signOut();

    localStorage.removeItem(process.env.REACT_APP_COGNITO_REFRESH_TOKEN)
    localStorage.removeItem(process.env.REACT_APP_COGNITO_ID_TOKEN)
    props.updateTitle('Login')
    props.history.push('/login')
  }

  return(
    // <nav className="navbar navbar-dark bg-primary">
    //   <div className="row col-12 d-flex justify-content-center text-white">
    //     <span className="h3">{props.title || title}</span>
    //     {renderLogout()}
    //   </div>
    // </nav>
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static">
        <Toolbar>
          <IconButton
            size="large"
            edge="start"
            color="inherit"
            aria-label="menu"
            sx={{ mr: 2 }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            {props.title || title}
          </Typography>
          {renderLogout()}
        </Toolbar>
      </AppBar>
    </Box>
  )
}
export default withRouter(Header);
