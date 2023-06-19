class CommandQueue {
    queue = []
    isInProgress = false

    clearCommandQueue() {
      this.queue = []
      this.isInProgress = false
    }
  
    addCommand(command) {
      this.queue.unshift(command)
  
      if (this.isInProgress) {
        return
      }
  
      this.#consumeCommand()
    }
  
    #consumeCommand() {
      // console.log('command consuming')
      this.isInProgress = true
      const command = this.queue.pop()
  
      command.invoke().then(() => {
        this.isInProgress = false
        // console.log('command invoked')
  
        if (this.queue.length === 0) {
          // console.log('command queue empty')
          return
        }
        console.log('\n command queue ', this.queue.length)
        this.#consumeCommand()
      })
      // console.log('--------command consumed--------')
    }
  }
  
  export { CommandQueue }