import * as React from 'react';
import Box from '../../node_modules/@mui/material/Box/index.js';
import InputLabel from '@mui/material/InputLabel/index.js';
import MenuItem from '@mui/material/MenuItem/index.js';
import FormControl from '@mui/material/FormControl/index.js';
import Select from '@mui/material/Select/index.js';

export default function BasicSelect({setIpValue}) {
  const [ip, setIp] = React.useState('');

  const handleChange = (event) => {
    setIp(event.target.value);
    setIpValue(event.target.value)
  };

  return (
    <div style={{marginTop: "10%"}}>
        <Box sx={{ minWidth: 120 }}>
        <FormControl fullWidth>
            <InputLabel id="demo-simple-select-label">IP Address</InputLabel>
            <Select
            labelId="demo-simple-select-label"
            id="demo-simple-select"
            value={ip}
            label="IP Address"
            onChange={handleChange}
            >
            <MenuItem value={'192.168.1.0'}>192.168.1.0</MenuItem>
            <MenuItem value={'192.168.1.1'}>192.168.1.1</MenuItem>
            <MenuItem value={'192.168.1.2'}>192.168.1.2</MenuItem>
            <MenuItem value={'192.168.1.3'}>192.168.1.3</MenuItem>
            <MenuItem value={'192.168.1.4'}>192.168.1.4</MenuItem>
            <MenuItem value={'192.168.1.5'}>192.168.1.5</MenuItem>

            </Select>
        </FormControl>
        </Box>
    </div>
  );
}
