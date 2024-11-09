// server/BaseStreamer.js
import EventEmitter from 'events';

class BaseStreamer extends EventEmitter {
  constructor() {
    super();
    if (new.target === BaseStreamer) {
      throw new TypeError("Cannot construct BaseStreamer instances directly");
    }
  }

  async connect() {
    throw new Error("Method 'connect()' must be implemented.");
  }

  send(data) {
    throw new Error("Method 'send()' must be implemented.");
  }

  reconnect() {
    throw new Error("Method 'reconnect()' must be implemented.");
  }
}

export { BaseStreamer };
