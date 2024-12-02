// server/helpers/socketTransport.js
import Transport from 'winston-transport';

class SocketTransport extends Transport {
  constructor(opts) {
    super(opts);
    this.io = opts.io; // Socket.io instance
  }

  log(info, callback) {
    setImmediate(() => {
      this.emit('logged', info);
    });

    // Emit the log event to the frontend
    if (this.io && info.message) {
      this.io.emit('log', {
        level: info.level,
        message: info.message,
        timestamp: info.timestamp || new Date().toISOString(),
      });
    }

    callback();
  }
}

export default SocketTransport;
