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
            <MenuItem value={'PMU'}>PMU</MenuItem>
            <MenuItem value={'PMU2'}>PMU2</MenuItem>
            </Select>
        </FormControl>
        </Box>
    </div>
  );
}
