class CommandQueue {
  queue = []
  isInProgress = false

  addCommand(command) {
    this.queue.push(command)

    if (this.isInProgress) {
      return
    }

    this.#consumeCommand()
  }

  #consumeCommand() {
    this.isInProgress = true

    const command = this.queue.shift()

    command.invoke().then(() => {
      this.isInProgress = false

      if (this.queue.length === 0) {
        return
      }

      this.#consumeCommand()
    })
  }
}

export { CommandQueue }
