import React, {useState} from 'react';
import Stack from '@mui/material/Stack/index.js';
import Button from '@mui/material/Button/index.js';
// import axios from 'axios';



export default function BasicButtons(props) {
//   const [state, setState] = useState()


  const handleOnClick = () => {
    props.setButtonStatus(true)
  // console.log('button')
  }

  return (
    <Stack spacing={2} direction="row"  style={{margin: "5% 0 5% 50%" }}>
      {/* <Button variant="text">Start Server</Button> */}
      <Button variant="contained" onClick={handleOnClick}>Start Server</Button>
      {/* <Button variant="outlined">Outlined</Button> */}
    </Stack>
  );
}