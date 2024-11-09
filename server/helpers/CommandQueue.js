// server/helpers/CommandQueue.js
class CommandQueue {
  constructor(streamer, maxRetries = 5) {
    this.queue = [];
    this.isInProgress = false;
    this.streamer = streamer;
    this.maxRetries = maxRetries;
    this.retryCount = 0;
  }

  /**
   * Clears the entire command queue and resets the progress flag.
   */
  clearCommandQueue() {
    this.queue = [];
    this.isInProgress = false;
    this.retryCount = 0;
    console.log('Command queue cleared.');
  }

  /**
   * Adds a command to the queue and starts processing if not already in progress.
   * @param {Command} command - The command to add to the queue.
   */
  addCommand(command) {
    this.queue.unshift(command);

    if (this.isInProgress) {
      return;
    }

    this.#consumeCommand();
  }

  /**
   * Processes the next command in the queue.
   */
  async #consumeCommand() {
    if (this.queue.length === 0) {
      this.isInProgress = false;
      return;
    }

    this.isInProgress = true;
    const command = this.queue.pop();

    try {
      await command.invoke();
      this.retryCount = 0; // Reset retry count on success
    } catch (error) {
      console.error(`Command failed: ${error.message}`);

      // Handle specific error types if necessary
      if (this.retryCount < this.maxRetries) {
        this.retryCount += 1;
        const delay = this.#getExponentialBackoff(this.retryCount);
        console.log(`Retrying command in ${delay}ms... (Attempt ${this.retryCount})`);
        setTimeout(() => {
          this.queue.unshift(command); // Re-add the failed command to the front
          this.#consumeCommand();
        }, delay);
        return;
      } else {
        console.error('Max retries reached. Clearing the queue and attempting reconnection.');
        this.clearCommandQueue();
        this.#attemptReconnection();
        return;
      }
    }

    this.isInProgress = false;
    this.#consumeCommand();
  }

  /**
   * Calculates the delay based on exponential backoff strategy.
   * @param {number} attempt - The current retry attempt number.
   * @returns {number} - The delay in milliseconds.
   */
  #getExponentialBackoff(attempt) {
    const baseDelay = 1000; // 1 second
    return baseDelay * 2 ** (attempt - 1);
  }

  /**
   * Attempts to reconnect the streamer.
   */
  #attemptReconnection() {
    console.log('Attempting to reconnect the streamer...');
    this.streamer.reconnect()
      .then(() => {
        console.log('Reconnection successful. Resuming command processing.');
        // Optionally, re-add pending commands or notify the user
      })
      .catch((err) => {
        console.error('Reconnection failed:', err.message);
        // Decide whether to retry reconnection or notify the user
      });
  }
}

export { CommandQueue };
