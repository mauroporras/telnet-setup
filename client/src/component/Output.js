import React, { useEffect } from 'react'
import Box from '@mui/material/Box/index.js';
import TextField from '@mui/material/TextField/index.js';

export default function MultilineTextFields({data}) {
  const [value, setValue] = React.useState('');

  useEffect(() => {
    if(data != null){
      setValue(data + '\n' + value )
    }
    }, [data]);
  // console.log(data)
  // listMessages.push(data)
  
  // const messagesEndRef = useRef(null)

  // const scrollToBottom = () => {
  //   messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  // }

  // useEffect(() => {
  //   scrollToBottom()
  // }, [data]);

  // const handleChange = (event) => {
    // setValue(event.target.value);
    // setValue( props.data + '/n')
  // };

  return (
    <Box
      component="form"
      sx={{
        '& .MuiTextField-root': { m: 1, width: '100%' },
      }}
      noValidate
      autoComplete="off"
    >
      
      <div >
        
        {/* {listMessages.map(message => <span key={message.id} {...message} />)}
        <div ref={messagesEndRef} /> */}

        <TextField
          id="filled-multiline-static"
          label="Output Telnet stream"
          multiline
          rows={4}
          // defaultValue="Default Value"
          variant="filled"
          value={value}
          // value={props.data}
          // onChange={handleChange}
        />
      </div>
      
    </Box>
  );
}

