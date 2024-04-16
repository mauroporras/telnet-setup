class CommandQueue {
  queue = []
  isInProgress = false

  addCommand(command) {
    this.queue.push(command)
    this.#processQueue()
  }

  #processQueue() {
    if (this.isInProgress || !this.queue.length) {
      return
    }

    this.isInProgress = true

    const command = this.queue.shift()

    command.invoke().then(() => {
      this.isInProgress = false
      this.#processQueue()
    })
  }
}

export { CommandQueue }
