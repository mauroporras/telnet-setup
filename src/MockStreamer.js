import { promises as fs } from 'fs'
import path from 'path'
import { interval } from 'rxjs'

import { BaseStreamer } from './BaseStreamer.js'
import { TotalStationErrors } from './models/Command.js'

const outPutText = "C:/Box/Active Projects/190153_Cadet_Chapel_Repairs/Engineering/ZSK/ZSK_210712_SurveyLink/211004_MUBC/LogFiles/SurveyLog.txt"

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

    const ticks = interval(1000)

    ticks.subscribe((tick) => {
      const index = tick % arrayMockPoints.length

      const data = arrayMockPoints[index]

      try {
        if (fs.access(outPutText)) {
          fs.appendFile(outPutText, data, (err) => {
            if (err) throw err
          })
        } else {
          fs.writeFile(outPutText, data, (err) => {
            if (err) throw err
          })
        }
      } catch (err) {
        console.error(err)
      }

      data && this.emit('data', data)
    })
  }

  async send(data) {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(TotalStationErrors.GRC_OK)
      }, 1000)
    })
  }
}

export { MockStreamer }
