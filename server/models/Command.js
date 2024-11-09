// server/models/Command.js
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
  41: 'GRC_POSITIONING_FAILED',
  26: 'GRC_DIST_ERR',
  28: 'Issue with reflector',
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
    this.globalTimeout = 15000; // 15 seconds
    this.timeoutHandle = null;
  }

  async invoke() {
    const { x, y, z } = this.data.position;

    // Remove all listeners to avoid duplicate listeners
    this.streamer.removeAllListeners('streaming-response');
    this.streamer.removeAllListeners('point');

    console.log('------------------ \n');
    console.log('Command invoked for anchor:', this.data.anchor);

    // Send initial commands
    this.streamer.send(TotalStationCommands.STOP_STREAM);
    this.streamer.send(TotalStationCommands.START_STREAM);

    const localQueue = [
      TotalStationCommands.turnTelescope(y, x, z),
      TotalStationCommands.SEARCH,
      TotalStationCommands.SAMPLE_DIST,
    ];

    return new Promise((resolve, reject) => {
      const onStreamingResponse = async (response) => {
        clearTimeout(this.timeoutHandle);
        const responseCode = parseInt(response.substring(response.lastIndexOf(':') + 1));

        if (responseCode !== 0) {
          console.log('Response error:', TotalStationResponses[responseCode] || 'Unknown Error');

          if ([28, 31, 41, 26, 50].includes(responseCode)) {
            this.streamer.emit('end');
            reject(new Error(TotalStationResponses[responseCode] || 'Unknown Error'));
            return;
          }
        }

        // Execute next command
        let next = localQueue.shift();
        if (!next) return;

        if (responseCode === 3107) {
          setTimeout(() => {
            console.log('Previous command still running (Code 3107), waiting 0.5 seconds');
            this.streamer.send(next);
          }, 500);
        } else {
          console.log('Sending next command:', next.trim());
          this.streamer.send(next);
        }

        // Reset timeout for the next response
        this.timeoutHandle = setTimeout(() => {
          console.error('Command timed out.');
          reject(new Error('Command timed out.'));
        }, this.globalTimeout);
      };

      const onEnd = async () => {
        clearTimeout(this.timeoutHandle);
        this.streamer.removeListener('streaming-response', onStreamingResponse);
        this.streamer.removeListener('point', onPoint);
        await this.#markAsInvoked();
        resolve();
      };

      const onPoint = async (point) => {
        clearTimeout(this.timeoutHandle);
        this.streamer.removeListener('streaming-response', onStreamingResponse);
        this.streamer.removeListener('point', onPoint);

        if (point === 'connection closed: too many clients') {
          console.log('Reset: connection closed due to too many clients.');
          setTimeout(() => {
            this.streamer.emit('reset');
            reject(new Error('Connection closed: too many clients'));
          }, 5000);
          return;
        }

        await this.#markAsInvoked();
        console.log(`ANCHOR: ${this.data.anchor}\nPOINT: ${point}`);
        await this.session.addPoint(point, this.data.anchor);
        console.log('----Command Complete----');
        resolve();
      };

      // Set initial timeout
      this.timeoutHandle = setTimeout(() => {
        console.error('Initial command timed out.');
        reject(new Error('Initial command timed out.'));
      }, this.globalTimeout);

      this.streamer.on('streaming-response', onStreamingResponse);
      this.streamer.on('end', onEnd);
      this.streamer.on('point', onPoint);

      // Start the command sequence
      if (localQueue.length > 0) {
        const firstCommand = localQueue.shift();
        console.log('Sending first command:', firstCommand.trim());
        this.streamer.send(firstCommand);
      } else {
        reject(new Error('No commands to execute.'));
      }
    });
  }

  /**
   * Marks the command as invoked in Firestore.
   */
  async #markAsInvoked() {
    try {
      const docRef = doc(collection(db, 'commands'), this.data.id);
      await setDoc(docRef, { isInvoked: true }, { merge: true });
      console.log(`Command marked as invoked for anchor: ${this.data.anchor}`);
    } catch (error) {
      console.error('Error marking command as invoked:', error);
    }
  }
}

export { Command };
