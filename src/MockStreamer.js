import { promises as fs } from 'fs'
import path from 'path'
import { interval } from 'rxjs'
import { zeaDebug } from './helpers/zeaDebug.js'
import { BaseStreamer } from './BaseStreamer.js'

class MockStreamer extends BaseStreamer {
  constructor(mockPointsPath) {
    super()

    this.mockPointsPath = mockPointsPath
  }

  async connect() {
    zeaDebug('MockStreamer file path:', this.mockPointsPath)

    const mockPoints = await fs.readFile(
      path.resolve(this.mockPointsPath),
      'utf8'
    )

    const arrayMockPoints = mockPoints.split('\n')

    const ticks = interval(1000)

    ticks.subscribe((tick) => {
      const index = tick % arrayMockPoints.length

      const data = arrayMockPoints[index]

      if (data) {
        this.emit('data', data)
      }
    })
  }

  async send(data) {
    zeaDebug('MockStreamer received data:', data)

    setTimeout(() => {
      this.emit('streaming-response', '%R8P,0,0:0')
    }, 1000)
  }
}

export { MockStreamer }
