import React, {useState, useEffect} from 'react';

//import DropDownList from './DropDownList.js';
import DropDownListSession from './DropDownListSession.js'
import ButtonStart from './Button.js'
// import OutPut from './Output.js'
// import axios from 'axios';
// import { useScrollTrigger } from '@mui/material';
// import Streamer from '../Streamer.js'
// import cors from "cors"



 
const App = () => {


  // const [state, setState] = useState()
  const [buttonStatus, setButtonStatus] = useState(false)
  //const [ipValue, setIpValue] = useState('')
  const [sessioniDValue, setSessionIDValue] = useState('')
  const [stationiDValue, setStationIDValue] = useState('')
  const [stationName, setStationName] = useState('')


  const [data, setData] = useState(null);

  
    useEffect(() => {
      //console.log('useeffect', ipValue, iDValue)


      if(buttonStatus){
      const requestOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json',
        'Accept': 'application/json' },
        body: JSON.stringify({ 
          title: 'start telnet streamer',
          //IPAddress: ipValue,
          sessionID: sessioniDValue,
          stationMac: stationiDValue,
          stationNames: stationName,
          
         })
      };
  
      fetch("/api/button", requestOptions)
        .then((res) => res.json())
        .then((data) => setData(data.message));

        setButtonStatus(false)
      }

    }, [buttonStatus,  sessioniDValue, stationiDValue]);//ipValue,


    console.log(data)


  if (buttonStatus){

    console.log('button2')
  }



  return (
    <div className='ui container grid' style={{maxWidth: "320px"}}>
      <div className='ui row'>
        {/*<div className='column eight wide'>
          <DropDownList setIpValue={setIpValue}/>
        </div>*/}
        <div className='column eight wide' >
            {/* <div style={{marginTop: "5%"}}>
                - IP Address
            </div> */}
          
        </div>
      </div>
      <div className='ui row'>
        <div className='column eight wide'>
          <DropDownListSession setSessionIDValue={setSessionIDValue} setStationIDValue={setStationIDValue} setStationName={setStationName}/>
        </div>
        <div className='column eight wide' >
            {/* <div style={{marginTop: "5%"}}>
                - Session ID
            </div> */}
         
        </div>
      </div>
      <br/>
      <div className='ui row'/>
      <div className='ui row'>
        <div className='column eight wide'  >
          <ButtonStart  setButtonStatus={setButtonStatus}/>
        </div>
        
      </div>
      {/* <div className='ui row'>
        <div className='column eight wide'>
          <OutPut data={!data ? "" : data}/>
        </div>
      </div> */}


    </div>
  )
};

export default App;
