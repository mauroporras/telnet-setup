class CommandQueue {

    queue = []
    inProgress  = false

    addCommand(command) {
        this.queue.unshift(command)
        if (!this.inProgress) this.consumeCommand()
    }

    consumeCommand() {
        const command = this.queue.pop()

        this.inProgress = true

        command.invoke().then(()=>{
            this.inProgress = false
            if (this.queue.length > 0)
                this.consumeCommand()
        })
    }

}


export {  CommandQueue   }