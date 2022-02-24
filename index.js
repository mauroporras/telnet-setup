// server/index.js

// const express = require("express/index.js");
import express from 'express/index.js'
// const bodyParser = require('body-parser');
import bodyParser from 'body-parser'
// const cors = require("cors");
import cors from 'cors'
// import path from 'path'
import StreamerEntry from './server/StreamerEntry.js'

// import {StreamerBridge} from './server/StreamBrowser.js'

const PORT = process.env.PORT || 3001

// attempt to get
// let dataReturn

// export const streamBrowser = async (data) => {
//   console.log('streamBrowser')

//   dataReturn = await data
//   // return dataReturn
// }

// console.log('returned streamBrowser', dataReturn)

const app = express()
app.use(cors())

// Configuring body parser middleware
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

// Have Node serve the files for our built React app
// app.use(express.static(path.resolve(__dirname, '../client/build')));

app.get('/api', (req, res) => {
  res.json({ message: 'Hello from server!' })
  console.log(req)
})
let i = 1

app.use('/api/button', function (req, res) {
  console.log('api button')
  var countValue = req.body.title
  var ip = req.body.IPAddress
  var ID = req.body.sessionID
  console.clear()

  console.log('\n', '\n', '\t Telnet Session Starting')
  console.log('CountValue is', countValue)
  console.log('CountValue is', ip)
  console.log('CountValue is', ID)
  StreamerEntry(ip, ID)
  // res.json({ message: 'result'});

  // streamerNudger.sendReq(req)
  // countValue.on('data', (data) => {
  //   res.json({ message: data});
  // })
})

app.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`)
})

// app.get("/api/button", function (req, res) {
//   console.log('api button')
//   var countValue = req.body.title;
//   console.log("CountValue is", countValue);
// });

// app.post('/api', function (req, res) {
//   var countValue = req.body.title;
//   console.log("CountValue is", countValue);
// });

// app.use(cors());
// // parse application/json
// // app.use(bodyParser.json());

// //add new user
// app.post('/store-data',(req, res) => {
//   let data = {name: req.body.name};
//   let sql = "INSERT INTO users SET ?";
//   let query = conn.query(sql, data,(err, results) => {
//     if(err) throw err;
//     res.send(JSON.stringify({"status": 200, "error": null, "response": results}));
//   });
// })

// export {app}

// import { MockStreamer } from './src/MockStreamer.js'
// import { TelnetStreamer } from './src/TelnetStreamer.js'
// import { StreamerDbBridge } from './src/StreamerDbBridge.js'

// import { Session } from './src/models/Session.js'

// const ZEA_STREAMER_TYPE = process.env.ZEA_STREAMER_TYPE || ''
// const ZEA_SESSION_ID = process.env.ZEA_SESSION_ID || ''

// // console.log(
// //   'session ',
// //   ZEA_STREAMER_TYPE.length,
// //   'mock'.length,
// //   ZEA_STREAMER_TYPE === 'mock'
// // )
// // console.log('session ', ZEA_SESSION_ID)

// // const shouldUseMock = process.env.ZEA_STREAMER_TYPE === 'mock' ? true : false
// const shouldUseMock = ZEA_STREAMER_TYPE === 'mock' ? true : false
// // console.log('status ', shouldUseMock)

// const ZEA_TEST_POINTS_FILE =
//   'C:/Box/R&D Services/Restricted/04_Research Trajectories/BROWER SRVY REVIEW/SURVEYLINK_MVP/Mockup/Setup Survey Points.txt'

// const streamer = shouldUseMock
//   ? // ? new MockStreamer(process.env.ZEA_TEST_POINTS_FILE)
//     new MockStreamer(ZEA_TEST_POINTS_FILE)
//   : new TelnetStreamer({
//       host: process.env.ZEA_TELNET_HOST,
//       // host: '192.168.1.3',
//       // port: process.env.ZEA_TELNET_PORT,
//       port: 1212,
//     })

// const sessionId = ZEA_SESSION_ID
// // const sessionName = process.env.ZEA_SESSION_NAME
// const sessionName = ZEA_SESSION_ID

// const session = new Session(sessionId, sessionName)

// const streamerDbBridge = new StreamerDbBridge(streamer, session)
// console.log('session started ')
// await streamerDbBridge.start()
