// import * as React from 'react';
import { useEffect, useState } from 'react'
import Box from '../../node_modules/@mui/material/Box/index.js'
import InputLabel from '@mui/material/InputLabel/index.js'
import MenuItem from '@mui/material/MenuItem/index.js'
import FormControl from '@mui/material/FormControl/index.js'
import Select from '@mui/material/Select/index.js'

// import { db, getSessions } from '../helpers/clientFirebase.js' //client\helpers\clientFirebase.js
import {ClientSession} from '../models/ClientSession.js'
// import { async } from '@firebase/util'

// import { collection, getDocs } from "firebase/firestore"; 

async function helpAwait() {
  const getSession = new ClientSession();
  try {
    const sessionAwaited = await getSession.init();
    console.log("getSession", sessionAwaited);
    return sessionAwaited;
  } catch (error) {
    console.error("Error in helpAwait:", error);
  }
}


export default  function BasicSelect({ setSessionIDValue, setStationIDValue, setStationName }) {
  const [sessionID, setsessionID] = useState('')
  const [station, setStation] = useState('')
  const [connectionType, setConnectionType] = useState(0)
  const [documents, setDocuments] = useState([])

 
  // DON"T FORGET TO CHANGE THE MAC ADDRESS FROM - TO :
  // let LuigiMac = '00:17:17:06:8a:a5'//, 'Luigi']
  // let MarioMac = '08:00:28:12:03:58'//, 'Mario'] // post 230913 maint return
  // let PrincessPeachMac = '02:24:00:00:00:00'
  // let PrincessPeachMacWifi = '00:17:17:07:84:ed'

  const LuigiMac = connectionType === 0 ? '00:17:17:06:8a:a5' : 'UsbMacForLuigi'; // 0 is wifi, 1 is usb
  const MarioMac = connectionType === 0 ? '08:00:28:12:03:58' : 'UsbMacForMario';
  const PrincessPeachMac = connectionType === 0 ? '00:17:17:07:84:ed' : '02:24:00:00:00:00';


  const lookupValue = {'00:17:17:06:8a:a5': 'Luigi', '08:00:28:12:03:58': 'Mario', '00:17:17:07:84:ed': 'Princess Peach', '02:24:00:00:00:00': 'Princess Peach'}
  // const lookupValue = {'00:17:17:06:8a:a5': 'Luigi', '08:00:28:12:03:58': 'Mario', '00:17:17:07:84:ed': 'Princess Peach'}

  const handleChangeSession = (event) => {
    console.log(
      'handleChangeSession', event.target.value
    )
    setsessionID(event.target.value)
    setSessionIDValue(event.target.value)
  }
  
  const handleChangeStation = (event) => {
    // const { myValue } = event.currentTarget;
    console.log("handleChangeStation", lookupValue[event.target.value], event.target)

    setStation(event.target.value)
    setStationIDValue(event.target.value)
    setStationName(lookupValue[event.target.value])
  }

  const handleChangeConnectionType = (event) => {
    // const { myValue } = event.currentTarget;

    setConnectionType(event.target.value);
    setStation(''); // reset the station when connection type changes
  }

  useEffect(() => {
    helpAwait().then(result => {
      if (result) {
        console.log("result", result);
        setDocuments(result);
      }
    });
  }, []);




   const sessionItem = documents.map((doc) => (
      // <div style={{height: '250px !important'}} key={doc.id}>
        <MenuItem  key={doc.id} value={doc.id}>
          {doc.name}
        </MenuItem>
      // </div>
    ))



  return (
    <div style={{ margin: '10%' }}>
      <Box sx={{ minWidth: 300, padding: '30px' }} style={{ border: '1px solid grey' }}>

      <FormControl fullWidth style={{ margin: '10px' }}>
          <InputLabel id="select-Connection">Connection Type </InputLabel>
          <Select
            labelId="select-Connection"
            id="selectConnection"
            value={connectionType}
            label="connectionType"
            onChange={handleChangeConnectionType}
          >

            <MenuItem name="WifiMac" value={0} id="long-menu">Wifi</MenuItem>
            <MenuItem name="usbMac" value={1} id="long-menu">USB</MenuItem>
            
          </Select>
        </FormControl>

        <br />
        <br />

        <FormControl fullWidth style={{ margin: '10px' }}>
          <InputLabel id="demo-simple-select-label">Multistation </InputLabel>
          <Select
            labelId="demo-simple-select-label"
            id="demo-simple-select"
            value={station}
            label="Multistation"
            onChange={handleChangeStation}
          >
            <MenuItem name="Luigi" value={LuigiMac} id="long-menu">Luigi</MenuItem>
            <MenuItem name="Mario" value={MarioMac} id="long-menu">Mario</MenuItem>
            <MenuItem name="PrincessPeach" value={PrincessPeachMac} id="long-menu">Princess Peach</MenuItem>

          </Select>
        </FormControl>

        <br />
        <br />

        <FormControl fullWidth style={{ margin: '10px' }}>
          <InputLabel id="select-session-label">Session ID </InputLabel>
          <Select
            labelId="select-session-label"
            id="select-session"
            value={sessionID}
            label="session ID"//{sessionID}//"session ID"
            onChange={handleChangeSession}
          >
            {sessionItem}

          </Select>
        </FormControl>
      </Box>
    </div>
  )

}
