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

import { AuthContext } from '../../utils/AuthProvider';

function useAuth() {
  return React.useContext(AuthContext);
}

function Header() {
  const location = useLocation()
  const navigate = useNavigate()
  const auth = useAuth();

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

  // BUG: when a new signup occurs or you log in, then log out, then log back in, the following error 
  //   occurs along with the profile menu appears on the top left-hand side:
  //     Warning: Failed prop type: MUI: The `anchorEl` prop provided to the component is invalid.
  //     The anchor element should be part of the document layout.
  //     Make sure the element is present in the document or that it's not display none.

  function renderProfile() {
    if (auth.token) {
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
            <MenuItem onClick={() => navigate('/dashboard')}>Dashboard</MenuItem>
            <MenuItem onClick={() => {auth.onLogout(() => navigate('/'))}}>Logout</MenuItem>
          </Menu>
        </div>
      )
    }
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
