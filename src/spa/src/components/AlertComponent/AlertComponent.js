import React, { useState, useEffect } from 'react';
import './AlertComponent.css';

import Box from '@mui/material/Box';
import Alert from '@mui/material/Alert';
import IconButton from '@mui/material/IconButton';
import Collapse from '@mui/material/Collapse';
import CloseIcon from '@mui/icons-material/Close';

function AlertComponent(props) {
  const [open, setOpen] = React.useState(false);
  useEffect(() => {
    if(props.errorMessage !== null) {
      setOpen(true)
    } else {
      setOpen(false)
      props.hideError(null);
    }
  });

  // const [modalDisplay, toggleDisplay] = useState('none');
  // const openModal = () => {
  //   toggleDisplay('block');     
  // }
  // const closeModal = () => {
  //   toggleDisplay('none'); 
  //   props.hideError(null);
  // }
  // useEffect(() => {
  //   if(props.errorMessage !== null) {
  //     openModal()
  //   } else {
  //     closeModal()
  //   }
  // });
    
  // return(
  //   <div 
  //     role="alert" 
  //     id="alertPopUp"
  //     style={{ display: modalDisplay }}
  //   >
  //     <Stack sx={{ width: '50%' }} spacing={2}>
  //       <Alert severity="error" onClose={() => closeModal()}>
  //         <AlertTitle>Error</AlertTitle>
  //         {props.errorMessage}
  //       </Alert>
  //     </Stack>
  //     <div className="d-flex alertMessage">
  //       <span>{props.errorMessage}</span>
  //       <button type="button" className="close" aria-label="Close" onClick={() => closeModal()}>
  //         <span aria-hidden="true">&times;</span>
  //       </button>
  //     </div>
  //   </div>
  // )
  return (
    <Box>
      <Collapse in={open}>
        <Alert
          severity="error"
          action={
            <IconButton
              aria-label="close"
              color="inherit"
              size="small"
              onClick={() => {
                setOpen(false);
              }}
            >
              <CloseIcon fontSize="inherit" />
            </IconButton>
          }
          sx={{ mb: 2 }}
        >
          {props.errorMessage}
        </Alert>
      </Collapse>
    </Box>
  );
} 
export default AlertComponent