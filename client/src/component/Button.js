// client/src/components/Button.js
import React from 'react';
import { Button } from '@mui/material';

const ButtonStart = ({ setButtonStatus }) => {
  const handleClick = () => {
    setButtonStatus(true);
  };

  return (
    <Button 
      variant="contained" 
      color="primary" 
      onClick={handleClick}
      sx={{ height: '56px', width: '150px' }}
    >
      Start
    </Button>
  );
};

export default ButtonStart;
