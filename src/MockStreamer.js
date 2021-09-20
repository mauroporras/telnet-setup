import { promises as fs } from 'fs'
import path from 'path'
import { interval } from 'rxjs'

import { BaseStreamer } from './BaseStreamer.js'

import processName from './helpers/nameSwap.js'

const outPutText = process.env.file_output

// const processName = (pointData) => {
//   const nameToSwap = process.env.nameToSwap
//   //split string into array by deliminator

//   const pointDataList = pointData.split(',')
//   pointDataList[0]= nameToSwap
  
//   const value  = pointDataList.join(',')

//   return value
// }

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
      console.log(tick)
      const index = tick % arrayMockPoints.length

      const data = arrayMockPoints[index]
      console.log(data)

      const nameAdj = processName(data)
      console.log(nameAdj)

      try {
        if (fs.access(outPutText)) {
          fs.appendFile(outPutText, nameAdj, (err) => {
            if (err) throw err;
          })
        }
        else{
          fs.writeFile(outPutText, nameAdj, (err) => {
            appendFile
            if (err) throw err;
          })
        }
      } catch(err) {
        console.error(err)
      }
      

      data && this.emit('data', nameAdj) 
    })
  }

  async send(data) {
    return 'SENT FROM MOCK'
  }
}

export { MockStreamer }
