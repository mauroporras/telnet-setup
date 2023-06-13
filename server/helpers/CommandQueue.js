class CommandQueue {
    queue = []
    isInProgress = false
  
    addCommand(command) {
      this.queue.unshift(command)
  
      if (this.isInProgress) {
        return
      }
  
      this.#consumeCommand()
    }
  
    #consumeCommand() {
      this.isInProgress = true
  
      const command = this.queue.pop()
  
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