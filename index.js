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


