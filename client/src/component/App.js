import React, {useState, useEffect} from 'react';

import DropDownList from './DropDownList.js';
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
  const [ipValue, setIpValue] = useState('')
  const [iDValue, setIDValue] = useState('')


  const [data, setData] = useState(null);

  // async function getTodos() {
  //   // With all properties
  //    let body = {
  //     start: true,
  //     title: "This is POST request with body",
  //     completed: true
  //   };

  
    useEffect(() => {
      console.log('useeffect', ipValue, iDValue)


      if(buttonStatus){
      const requestOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json',
        'Accept': 'application/json' },
        body: JSON.stringify({ 
          title: 'start telnet streamer',
          IPAddress: ipValue,
          sessionID: iDValue,
         })
      };
  
      fetch("/api/button", requestOptions)
        .then((res) => res.json())
        .then((data) => setData(data.message));

        setButtonStatus(false)
      }

    }, [buttonStatus, ipValue, iDValue]);


    console.log(data)

    // axios
    //   .post('http://localhost:3001/api', body)
    //   .then(function(response) {
    //     console.log(response.data);
    //   })
    //   .catch(function(error) {
    //     console.log(error);
    //   });
  // }



  if (buttonStatus){

    console.log('button2')
    // setButtonStatus(false)
  }

  // useEffect(() => {
  //   fetch("/api")
  //     .then((res) => res.json())
  //     .then((data) => setData(data.message));
  // }, []);

  // return (
  //   <div className="App">
  //     <header className="App-header">
  //       <img src={logo} className="App-logo" alt="logo" />
  //       <p>{!data ? "Loading..." : data}</p>
  //     </header>
  //   </div>
  // );


  return (
    <div className='ui container grid' style={{maxWidth: "450px"}}>
      <div className='ui row'>
        <div className='column eight wide'>
          <DropDownList setIpValue={setIpValue}/>
        </div>
        <div className='column eight wide' >
            {/* <div style={{marginTop: "5%"}}>
                - IP Address
            </div> */}
          
        </div>
      </div>
      <div className='ui row'>
        <div className='column eight wide'>
          <DropDownListSession setIDValue={setIDValue}/>
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