

const processName = (pointData) => {
    const nameToSwap = process.env.nameToSwap
    //split string into array by deliminator
  
    const pointDataList = pointData.split(',')
    pointDataList[0]= nameToSwap
    
    const value  = pointDataList.join(',')
  
    return value
  }


  export default processName