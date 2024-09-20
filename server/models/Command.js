import { db } from '../helpers/firebase.js';
import { collection, doc, setDoc } from 'firebase/firestore';
const TotalStationCommands = {
  START_STREAM: '%R8Q,4:\r\n',
  turnTelescope: (x, y, z) => `%R8Q,7:1,${x},${y},${z}\r\n`,
  SAMPLE_DIST: '%R8Q,1:\r\n',
  SEARCH: '%R8Q,6:1\r\n',
  STOP_STREAM: '%R8Q,5:\r\n',
};

const TotalStationResponses = {
  0: 'GRC_OK',
  // 40: 'GRC_NOT_OK',
  41: 'GRC_POSITIONING_FAILED',
  26: 'GRC_DIST_ERR',
  28: 'Issue with reflector', // GRC_REFLECTOR_ERR cannot find reflector, happens only after at least one successful search
  // 30: 'GRC_NOT_OK',
  31: 'GRC_REFLECTOR_NOT_FOUND',
  50: 'GRC_START_FAILED',
  51: 'GRC_STREAM_ACTIVE',
  53: 'GRC_STREAM_NOT_ACTIVE',
  3107: 'Another request still pending.',
};

class Command {
  constructor(streamer, session, data) {
    this.streamer = streamer;
    this.session = session;
    this.data = data;
    this.globalTimeout = 15;
    this.counterSetTimeout = 0;
  }

  async invoke() {
    const { x, y, z } = this.data.position; // switched x and y to match the total station

    // Remove all listeners to avoid duplicate listeners on the same event
    this.streamer.removeAllListeners('streaming-response');
    this.streamer.removeAllListeners('point');

    // Send commands to control the total station
    console.log('------------------ \n');
    console.log('command invoked for anchor: ', this.data.anchor);
    this.streamer.send(TotalStationCommands.STOP_STREAM);
    this.streamer.send(TotalStationCommands.START_STREAM);

    const localQueue = [
      TotalStationCommands.turnTelescope(y, x, z),
      TotalStationCommands.SEARCH,
      TotalStationCommands.SAMPLE_DIST,
    ];

    this.streamer.on('streaming-response', async (response) => {
      const responseCode = response.substring(response.lastIndexOf(':') + 1);

      if (responseCode !== '0') {
        console.log('response error', TotalStationResponses[responseCode]);
        
        if ([28, 31, 41, 26, 50].includes(parseInt(responseCode))) {
          this.streamer.emit('end');
          return;
        }
      }

      // Execute next command
      let next = localQueue.at(0);
      if (!next) return;

      if (responseCode === '3107') {
        setTimeout(() => {
          console.log('previous still running (Code 3107), wait 1/2 second');
        }, 500);
      } else {
        console.log('command to send', responseCode, next);
        next = localQueue.shift();
        this.streamer.send(next);
      }
    });

    return new Promise(async (resolve) => {
      this.streamer.on('end', async () => { 
        console.log('end event');
        await this.#markAsInvoked();
        resolve();
      });

      this.streamer.on('point', async (point) => {
        this.streamer.socket.removeAllListeners('timeout');
        this.streamer.socket.removeAllListeners('reset');

        if (point === "connection closed: too many clients") {
          console.log('reset: connection closed: too many clients');
          setTimeout(() => {
            this.streamer.emit('reset');
            resolve();
          }, 5000);
        }

        await this.#markAsInvoked();
        console.log(` ANCHOR : ${this.data.anchor}\n POINT : ${point} `);
        await this.session.addPoint(point, this.data.anchor);
        console.log('----Command Complete----');
        resolve();
      });
    });
  }

  async #markAsInvoked() {
    const docRef = doc(collection(db, 'commands'), this.data.id);
    await setDoc(docRef, { isInvoked: true }, { merge: true });
    // console.log('----Mark as Invoked----');
  }
}

export { Command };
