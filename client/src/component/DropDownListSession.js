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


export default  function BasicSelect({ setSessionIDValue, setStationIDValue }) {
  const [sessionID, setsessionID] = useState('')
  const [station, setStation] = useState('')
  const [documents, setDocuments] = useState([])

 

  // let LuigiMac = ['00:17:17:06:8a:a5', '00:17:17:06:9f:ac', '00:17:17:03:82:76']
  let LuigiMac = '00:17:17:06:8a:a5'
  let MarioMac = '00:17:17:06:9f:ac'

  const handleChangeSession = (event) => {
    console.log(
      'handleChangeSession', event.target.value
    )
    setsessionID(event.target.value)
    setSessionIDValue(event.target.value)
  }
  
  const handleChangeStation = (event) => {
    console.log("handleChangeStation", event.target.value)
    setStation(event.target.value)
    setStationIDValue(event.target.value)
  }

  useEffect(() => {
    helpAwait().then(result => {
      if (result) {
        console.log("result", result);
        setDocuments(result);
      }
    });
  }, []);

  // let sessionItems 


  // useEffect(() => {
  //   console.log("documents length", documents)
  //   // if (documents){
  //     sessionItems = documents.map((doc) => (
  //       <div style={{height: '250px !important'}}>
  //         <MenuItem key={doc.id} value={doc.id}>
  //           {doc.name}
  //         </MenuItem>
  //       </div>
  //     ))
  //   // }
  //   }, [documents])

   const sessionItem = documents.map((doc) => (
      // <div style={{height: '250px !important'}} key={doc.id}>
        <MenuItem  key={doc.id} value={doc.id}>
          {doc.name}
        </MenuItem>
      // </div>
    ))



  return (
    <div style={{ marginTop: '10%' }}>
      <Box sx={{ minWidth: 120 }}>
        <FormControl fullWidth>
          <InputLabel id="demo-simple-select-label">Multistation </InputLabel>
          <Select
            labelId="demo-simple-select-label"
            id="demo-simple-select"
            value={station}
            label="Multistation"
            onChange={handleChangeStation}
          >
            <MenuItem value={LuigiMac}>Luigi</MenuItem>
            <MenuItem value={MarioMac}>Mario</MenuItem>
          </Select>
        </FormControl>

        <br />
        <br />

        <FormControl fullWidth>
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
