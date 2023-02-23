import React from 'react';
import { CognitoUserAttribute } from 'amazon-cognito-identity-js';

import CircularProgress from '@mui/material/CircularProgress';
import TextField from '@mui/material/TextField';
import LoadingButton from '@mui/lab/LoadingButton';
import Box from '@mui/material/Box';

import { UserPool } from '../../utils/UserPool';

export default function Dashboard() {
  // Retrieve Session and display attributes
  const [user, setUser] = React.useState(null);
  const [name, setName] = React.useState(null);

  const cognitoUser = UserPool.getCurrentUser();
  cognitoUser.getSession(() => {
    cognitoUser.getUserAttributes(function(err, result) {
      if (err) {
        console.log(err.message || JSON.stringify(err));
        return;
      }
      const attributes = result.reduce((obj, item) => (obj[item.getName()] = item.getValue(), obj) ,{});
      setUser(attributes.email)
      setName(attributes.name)
    });
  });

  // Update attributes
  const [state , setState] = React.useState({
    name : '',
  })

  const handleChange = (e) => {
    const {id , value} = e.target   
    setState(prevState => ({
      ...prevState,
      [id] : value
    }))
  }

  const [disabled, setDisableButton] = React.useState(false);
  const [loading, setButtonLoading] = React.useState(false);

  const updateAttributes = (event) => {
    event.preventDefault();
  
    setButtonLoading(true);
    setDisableButton(true);
  
    const attributeList = [];

    const attributeName = {
      Name: 'name',
      Value: state.name,
    };

    var attribute = new CognitoUserAttribute(attributeName);
    attributeList.push(attribute);
    
    const cognitoUser = UserPool.getCurrentUser();
    cognitoUser.getSession(() => {
      cognitoUser.updateAttributes(attributeList, function(err, result) {
        if (err) {
          console.log(err.message || JSON.stringify(err));
          return;
        }
        setName(state.name)
      });
    });
  }

  if (name) {
    return (
      <div>
        Hello, {name}
      </div>
    )
  } else if (user) {
    return (
      <Box
        component='form'
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          '& > :not(style)': { m: 1, width: '35ch' },
        }}
        noValidate
        autoComplete='off'
      >
        Hello, {user}
        <TextField
          id='name'
          label="Add Name"
          variant='standard'
          type='name'
          value={state.name}
          onChange={handleChange}
        />
        <LoadingButton
          style={{maxWidth: '100px', minWidth: '100px'}}
          onClick={updateAttributes}
          loading={loading}
          disabled={disabled}
          variant='outlined'
          type='submit'
        >
          Submit
        </LoadingButton>
      </Box>
    )
  } else {
    return (
      <CircularProgress />
    )
  }
}
