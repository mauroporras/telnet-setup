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

    global.setInterval(() => {
      this.emit('data', arrayMockPoints[tick % arrayMockPoints.length])

      tick += 1
    }, 1000)
  }

  async send(data) {
    return 'SENT FROM MOCK'
  }
}

export { MockStreamer }
