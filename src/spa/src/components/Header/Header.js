import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom'

import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import MenuItem from '@mui/material/MenuItem';
import Menu from '@mui/material/Menu';
import AccountCircle from '@mui/icons-material/AccountCircle';

function Header() {
  const location = useLocation()
  const navigate = useNavigate()

  const capitalize = (s) => {
      if (typeof s !== 'string') return ''
      return s.charAt(0).toUpperCase() + s.slice(1)
  }
  let title = capitalize(location.pathname.substring(1,location.pathname.length))

  if(location.pathname === '/') {
    title = 'Welcome'
  }

  // profile menu
  const [anchorEl, setAnchorEl] = React.useState(null);
  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  function renderProfile() {
    return(
      <div>
        <IconButton
          size="large"
          aria-label="account of current user"
          aria-controls="menu-appbar"
          aria-haspopup="true"
          onClick={handleMenu}
          color="inherit"
        >
          <AccountCircle />
        </IconButton>
        <Menu
          id="menu-appbar"
          anchorEl={anchorEl}
          anchorOrigin={{
            vertical: 'top',
            horizontal: 'right',
          }}
          keepMounted
          transformOrigin={{
            vertical: 'top',
            horizontal: 'right',
          }}
          open={Boolean(anchorEl)}
          onClose={handleClose}
        >
          <MenuItem>Profile</MenuItem>
          <MenuItem onClick={handleLogout}>Logout</MenuItem>
        </Menu>
      </div>
    )
  }

  function handleLogout() {
    handleClose() // needed to prevent anchorEl not existing if user immediately logs back in

    // TODO: Find a way to truly log out, not just delete local token
    // const { store } = this.context;
    // const state = store.getState();
    // state.cognito.user.signOut();

    localStorage.removeItem(process.env.REACT_APP_COGNITO_REFRESH_TOKEN)
    localStorage.removeItem(process.env.REACT_APP_COGNITO_ID_TOKEN)

    navigate('/login')
  }

  return(
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="fixed">
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            {title}
          </Typography>
          {renderProfile()}
        </Toolbar>
      </AppBar>
      <Toolbar />
    </Box>
  )
}
export default Header;
