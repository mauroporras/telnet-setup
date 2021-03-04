import { promises as fs } from 'fs'
import path from 'path'

import { BaseStreamer } from './BaseStreamer.js'

class MockStreamer extends BaseStreamer {
  constructor(mockPointsPath) {
    super()

    this.mockPointsPath = mockPointsPath
  }

  async connect() {
    const mockPoints = await fs.readFile(
      path.resolve(this.mockPointsPath),
      'utf8'
    )

    const arrayMockPoints = mockPoints.split('\n')

    let tick = 0

    const intervalId = global.setInterval(() => {
      tick += 1

      if (tick < arrayMockPoints.length) {
        const data = arrayMockPoints[tick]

        if (data) {
          this.emit('data', data)
        }

        console.info(tick)

        return
      }

      clearInterval(intervalId)

      console.info('---------- Done ----------')
    }, 300)
  }

  async send(data) {
    return 'SENT FROM MOCK'
  }
}

export { MockStreamer }
