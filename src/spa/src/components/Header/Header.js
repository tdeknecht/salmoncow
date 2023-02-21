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

export default function Header() {
  const location = useLocation()
  const navigate = useNavigate()
  const auth = useAuth();

  const capitalize = (s) => {
      if (typeof s !== 'string') return ''
      return s.charAt(0).toUpperCase() + s.slice(1)
  }
  let title = capitalize(location.pathname.substring(1,location.pathname.length))

  if(location.pathname === '/') {
    title = 'Home'
  }

  const [anchorEl, setAnchorEl] = React.useState(null);

  function renderProfileMenuOptions() {
    if (auth.idToken) {
      return(
        <div>
          <MenuItem onClick={() => {navigate('/dashboard'); setAnchorEl(null)}}>Dashboard</MenuItem>
          <MenuItem onClick={() => {auth.onLogout(() => navigate('/')); setAnchorEl(null)}}>Logout</MenuItem>
        </div>
      )
    } else {
      return(
        <div>
          <MenuItem onClick={() => {navigate('/dashboard'); setAnchorEl(null)}}>Dashboard</MenuItem>
        </div>
      )
    }
  }

  return(
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position='fixed'>
        <Toolbar>
          <Typography variant='h6' component='div' sx={{ flexGrow: 1 }}>
            {title}
          </Typography>
          <IconButton
            size='large'
            aria-label="account of current user"
            aria-controls='menu-appbar'
            aria-haspopup='true'
            onClick={(event) => setAnchorEl(event.currentTarget)}
            color='inherit'
          >
            <AccountCircle />
          </IconButton>
          <Menu
            id='menu-appbar'
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
            onClose={() => setAnchorEl(null)}
          >
            {renderProfileMenuOptions()}
          </Menu>
        </Toolbar>
      </AppBar>
      <Toolbar />
    </Box>
  )
}
