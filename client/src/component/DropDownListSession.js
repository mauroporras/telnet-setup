import * as React from 'react';
import Box from '../../node_modules/@mui/material/Box/index.js';
import InputLabel from '@mui/material/InputLabel/index.js';
import MenuItem from '@mui/material/MenuItem/index.js';
import FormControl from '@mui/material/FormControl/index.js';
import Select from '@mui/material/Select/index.js';

export default function BasicSelect({setIDValue}) {
  const [age, setAge] = React.useState('');

  const handleChange = (event) => {
    setAge(event.target.value);
    setIDValue(event.target.value)
  };

  return (
    <div style={{marginTop: "10%"}}>
        <Box sx={{ minWidth: 120 }}>
        <FormControl fullWidth>
            <InputLabel id="demo-simple-select-label">Session ID </InputLabel>
            <Select
            labelId="demo-simple-select-label"
            id="demo-simple-select"
            value={age}
            label="Age"
            onChange={handleChange}
            >
            <MenuItem value={'0E5UDwaUXY5ukfyypq0Y&'}>office Test</MenuItem>
            <MenuItem value={'hZP48eRxk59Aq23rNZxM'}>360_Anchor_01</MenuItem>
            <MenuItem value={'7uigFwbdNB4yv8NBV3fd'}>360_Anchor_02</MenuItem>
            <MenuItem value={'v8JxQSif9fWgVVdEcjOx'}>360_Mullion_00</MenuItem>
            <MenuItem value={'ssv2CvAkVgRwkvSy9su2'}>360_Mullion_02</MenuItem>
            </Select>
        </FormControl>
        </Box>
    </div>
  );
}
