

class Command {

    constructor(streamer, session, data) {
        this.streamer = streamer
        this.session = session
        this.data = data
    }

    async invoke() {
        return new Promise((resolve) => {
                
            // 

            // Send the command to the total station.
            this.streamer.send('---')

            // Wait for the return code....
            this.streamer.on('data', (point)=>{
                // TS0012,410.9147,512.9075,103.3155,10/07/2020,18:53:02.68,16934825
                this.session.addPoint(point, this.data.anchor)

                resolve()
            })
        })

    }
}