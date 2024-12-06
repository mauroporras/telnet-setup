// server/helpers/CommandQueue.js
class CommandQueue {
  constructor(streamer) {
    this.queue = [];
    this.isInProgress = false;
    this.streamer = streamer;
  }

  clearCommandQueue() {
    this.queue = [];
    this.isInProgress = false;
    console.log('Command queue cleared.');
  }

  addCommand(command) {
    this.queue.unshift(command);
    if (!this.isInProgress) {
      this.#consumeCommand();
    }
  }

  async #consumeCommand() {
    if (this.queue.length === 0) {
      this.isInProgress = false;
      return;
    }

    this.isInProgress = true;
    const command = this.queue.pop();

    try {
      // Execute the command once
      await command.invoke();
    } catch (error) {
      console.error(`Command failed: ${error.message}`);
      // No retries here. Just move on.
    }

    this.isInProgress = false;
    this.#consumeCommand();
  }
}

export { CommandQueue };
