// server/index.js

// const express = require("express/index.js");
import express from 'express/index.js'
// const bodyParser = require('body-parser');
import bodyParser from 'body-parser'
// const cors = require("cors");
import cors from 'cors'
// import path from 'path'
import StreamerEntry from './server/StreamerEntry.js'

// const ZEA_STREAMER_TYPE = process.env.ZEA_STREAMER_TYPE || ''
// const ZEA_SESSION_ID = process.env.ZEA_SESSION_ID || ''

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
  var stationMac = req.body.stationMac
  var sessionId = req.body.sessionID
  var stationName = req.body.stationNames
  console.clear()

  console.log('\n', '\n', '\t Telnet Session Starting')
  // console.log('req.body', req.body)
  console.log('Mac Value is', stationMac)
  console.log('ID Value is', sessionId)
  console.log('stationName Value is', stationName)
  StreamerEntry(stationMac, sessionId, stationName)

})

app.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`)
})


