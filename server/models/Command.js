import { db } from '../helpers/firebase.js'

const TotalStationCommands = {
  START_STREAM: '%R8Q,4:\r\n',
  turnTelescope: (x, y, z) => `%R8Q,7:1,${x},${y},${z}\r\n`,
  SAMPLE_DIST: '%R8Q,1:\r\n',
  SEARCH: '%R8Q,6:1\r\n',
  STOP_STREAM: '%R8Q,5:\r\n',
}

const TotalStationResponses = {
  0: 'GRC_OK',
  // 40: 'GRC_NOT_OK',
  41: 'GRC_POSITIONING_FAILED',

  26: 'GRC_DIST_ERR',

  // 30: 'GRC_NOT_OK',
  31: 'GRC_REFLECTOR_NOT_FOUND',

  50: 'GRC_START_FAILED',
  51: 'GRC_STREAM_ACTIVE',
  53: 'GRC_STREAM_NOT_ACTIVE',

  3107: 'Another request still pending.',
}

class Command {
  constructor(streamer, session, data) {
    // console.log("Command constructor", data)
    this.streamer = streamer
    this.session = session
    this.data = data
  }

  async invoke() {
    const { x, y, z } = this.data.position //switched x and y to match the total station

    // Isues: 
    // findings, without this points and anchors are added multiple times
    //remove all listeners to avoid duplicate listeners on the same event
    this.streamer.removeAllListeners('streaming-response')
    this.streamer.removeAllListeners('point')

    // send a command to initialize the stream, then send the command to start the stream
    console.log("------------------ \n")
    // console.log("Stream started")
    this.streamer.send(TotalStationCommands.STOP_STREAM)
    this.streamer.send(TotalStationCommands.START_STREAM)
    // console.log("Stream start finished")

    const localQueue = [
      // TotalStationCommands.STOP_STREAM,
      // TotalStationCommands.START_STREAM,
      TotalStationCommands.turnTelescope(y, x,  z),
      TotalStationCommands.SEARCH,
      //what if nothing is found? should this code invoke a true for the command? handled in the response code
      TotalStationCommands.SAMPLE_DIST,
      
    ]
    
    // this.streamer.on('streaming-response', async (response) => { //NB
    this.streamer.on('streaming-response',  (response) => {
      // console.log("response code", response)
      const responseCode = response.substring(response.lastIndexOf(':') + 1)
      // console.log("response code", responseCode)

      let next = localQueue.at(0)

      if (!next) {
        return
      }
      
      
      // if the last return code was 3107 (another request still pending) then we should loop until that command resolves and passes a '0' response code
      // this will fail if the command does not resolve
      if (responseCode == '3107') { 
        setTimeout(() => {  console.log("previous still running (Code 3107), wait 1/2 second"); }, 500);
      }
      else{
        console.log("command to  send", responseCode, next) 
        if (responseCode == '31') {
          console.log("response error", TotalStationResponses[responseCode])
          // this.streamer.send(TotalStationCommands.STOP_STREAM)
          // mark command as invoked
          this.#markAsInvoked()
          return
        }
        next = localQueue.shift()
        this.streamer.send(next)
      }

      //exceptions
      //what if reflector is not found? should this code invoke a true for the command? 
      //currently runs and extra time before stopping
      if (responseCode !== '0') {
        if (responseCode == '31') {
          console.log("response error", TotalStationResponses[responseCode])
          // this.streamer.send(TotalStationCommands.STOP_STREAM)
          // mark command as invoked

          return
        }
        if (responseCode == '41') {
          console.log("response error", TotalStationResponses[responseCode])
          // this.streamer.send(TotalStationCommands.STOP_STREAM)
          return
        }
      }
      //notes on exceptions
      //streaming app needs to be open
      //no notifications can be active on the total station
      // this.streamer.send(TotalStationCommands.STOP_STREAM)
      
      
    })

    return new Promise(async (resolve) => {
      this.streamer.on('point', async (point) => {

        await this.#markAsInvoked()
        console.log(`POINT: ${point} \n ANCHOR : ${this.data.anchor} `)
        await this.session.addPoint(point, this.data.anchor)
        resolve()
      })
    })
  }

  async #markAsInvoked() {
    const docRef = db.collection('commands').doc(this.data.id)
    await docRef.update({ isInvoked: true })
    
  }
}

export { Command }