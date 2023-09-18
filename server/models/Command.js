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
  28: 'Issue with reflector', //GRC_REFLECTOR_ERR cannot find reflector, happens only after at least one successful search

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
    this.globalTimeout = 15
    this.counterSetTimeout = 0
  }

  async invoke() {
    const { x, y, z } = this.data.position //switched x and y to match the total station

    // Issues:
    // findings, without this points and anchors are added multiple times
    //remove all listeners to avoid duplicate listeners on the same event
    this.streamer.removeAllListeners('streaming-response')
    this.streamer.removeAllListeners('point')
    this.streamer.emit('timeout')
    // this.streamer.removeAllListeners('globalTimeout')
    // this.streamer.removeAllListeners('timeout')

    // send a command to initialize the stream, then send the command to start the stream
    console.log('------------------ \n')
    console.log('command invoked for anchor: ', this.data.anchor)
    // console.log("Stream started")
    this.streamer.send(TotalStationCommands.STOP_STREAM)
    this.streamer.send(TotalStationCommands.START_STREAM)
    // console.log("Stream start finished")

    const localQueue = [
      // TotalStationCommands.STOP_STREAM,
      // TotalStationCommands.START_STREAM,
      TotalStationCommands.turnTelescope(y, x, z),
      TotalStationCommands.SEARCH,
      TotalStationCommands.SAMPLE_DIST,
    ]

    this.streamer.on('streaming-response', async (response) => {
      const responseCode = response.substring(response.lastIndexOf(':') + 1)

      // console.log(
      //   'Start--TotalStation Response initial--',
      //   TotalStationResponses[responseCode],
      //   responseCode
      // )

      //exceptions
      // connection is dropped sometimes on the total station and it looses socket connection
      // if the time is greater than 30 seconds, then we should stop the stream and mark the command as invoked
      // and try to reconnect
      //what if reflector is not found? should this code invoke a true for the command?
      //currently runs and extra time before stopping
      if (responseCode !== '0') {
        // server seems to hang on this error sometimes
        console.log('response error', TotalStationResponses[responseCode])
        if (responseCode == '28') {
          console.log('response error', TotalStationResponses[responseCode])
          // this.#markAsInvoked()
          console.log('for error 28, markAsInvoked ', this.data.anchor)
          // this.streamer.emit('reset')
          this.streamer.emit('end')
          return
          
        }
        if (responseCode == '31') {
          console.log('response error', TotalStationResponses[responseCode])
          // this.#markAsInvoked()
          this.streamer.emit('end')
          // this.streamer.emit('reset')
          return
        } else if (responseCode == '41') {
          console.log('response error', TotalStationResponses[responseCode])
          // this.#markAsInvoked()
          this.streamer.emit('end')
          return
        } else if (responseCode == '26') {
          console.log('response error', TotalStationResponses[responseCode])
          // this.#markAsInvoked()
          this.streamer.emit('end')
          return
        } else if (responseCode == '50') {
          console.log('response error', TotalStationResponses[responseCode])
          // this.#markAsInvoked()
          this.streamer.emit('end')
          return
        }
      }

      //Execute next command
      let next = localQueue.at(0)

      if (!next) {
        return
      }

      // if the last return code was 3107 (another request still pending) then we should loop until that command resolves and passes a '0' response code
      // this will fail if the command does not resolve
      if (responseCode == '3107') {
        setTimeout(() => {
          console.log('previous still running (Code 3107), wait 1/2 second')
        }, 500)
      } else {
        console.log('command to  send', responseCode, next)

        next = localQueue.shift()
        this.streamer.send(next)
      }
    })

    //move removal of clear listeners to here to clean up 


    this.streamer.socket.removeAllListeners('timeout')
    this.streamer.socket.removeAllListeners('reset')

    return new Promise(async (resolve) => {
      
      this.streamer.on('end', async () => { 
        console.log('end event')
        // this.streamer.removeAllListeners('streaming-response')
        await this.#markAsInvoked()
        resolve()
      })

      this.streamer.on('point', async (point) => {
        //changed to .once from .
        // this.streamer.socket.removeAllListeners('timeout')
        // this.streamer.socket.removeAllListeners('reset')

        if(point == "connection closed: too many clients"){
          console.log('reset: connection closed: too many clients')
          setTimeout(() => {
            this.emit('reset')
            resolve()
          }, 5000)
        }

        // console.log('----Time Out removed----')
        await this.#markAsInvoked()
        console.log(` ANCHOR : ${this.data.anchor}\n POINT : ${point} `)
        await this.session.addPoint(point, this.data.anchor)
        console.log('----Command Complete----')

        resolve()
      })
    })
  }

  async #markAsInvoked() {
    const docRef = db.collection('commands').doc(this.data.id)
    await docRef.update({ isInvoked: true })
    // console.log('----Mark as Invoked----')
  }
}

export { Command }
