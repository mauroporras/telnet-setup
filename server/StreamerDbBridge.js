// server/StreamerDbBridge.js
import { CommandQueue } from './helpers/CommandQueue.js';
import { Command } from './models/Command.js';
// import { Session } from './models/Sessions.js'; // Ensure correct import

class StreamerDbBridge {
  constructor(streamer, session) {
    this.streamer = streamer;
    this.session = session;
    this.commandQueue = new CommandQueue(this.streamer);
  }

  /**
   * Starts the bridge by connecting the streamer and initializing the session.
   */
  async start() {
    await this.streamer.connect();
    await this.session.init();

    // Listen for new commands from the session
    this.session.onCommandCreated((data) => {
      console.log('Command created for anchor:', data.anchor);
      const command = new Command(this.streamer, this.session, data);
      this.commandQueue.addCommand(command);
      console.log('Command added to queue.');
    });

    // Listen for data points from the streamer
    this.streamer.on('point', (point) => {
      if (this.commandQueue.isInProgress) return;
      console.log('Received point:', point);
      this.session.addPoint(point);
    });

    // Handle streamer reset events
    this.streamer.on('reset', () => {
      console.log('-------------------------------- Resetting Streamer --------------------------------');
      setTimeout(() => {
        this.commandQueue.clearCommandQueue();
        if (this.streamer.socket) {
          this.streamer.socket.end();
          this.streamer.socket.destroy();
        }
        this.start();
        console.log('Streamer restarted.');
      }, 2000);
    });

    // Handle socket timeouts
    this.streamer.socket.once('timeout', () => {
      console.log('Socket timeout. Attempting to reconnect...');
      this.commandQueue.clearCommandQueue();
      if (this.streamer.socket) {
        this.streamer.socket.end();
        this.streamer.socket.destroy();
      }
      this.start();
    });
  }
}

export { StreamerDbBridge };
