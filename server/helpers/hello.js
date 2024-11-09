import logger from "./logger.js";


export default function printStart(){
    const consoleOptions = 'background: #ffffff; color: #6b17e8';
  // Standard Figlet Font
  console.log("Running Version: ", "1.0.1", '\n')
  logger.info("Running Version: ", "1.0.1", '\n')


//                                 _ _       _    
//                                | (_)     | |   
//  ___ _   _ _ ____   _____ _   _| |_ _ __ | | __
// / __| | | | '__\ \ / / _ \ | | | | | '_ \| |/ /
// \__ \ |_| | |   \ V /  __/ |_| | | | | | |   < 
// |___/\__,_|_|    \_/ \___|\__, |_|_|_| |_|_|\_\
//                            __/ |               
//                           |___/                
  // https://patorjk.com/software/taag/#p=display&f=Big&t=surveylink

  console.log('%c                                _ _       _  ', consoleOptions);
  console.log('%c                               | (_)     | |   ', consoleOptions);
  console.log('%c ___ _   _ _ ____   _____ _   _| |_ _ __ | | __', consoleOptions);
  console.log("%c/ __| | | | '__\\ \\ / / _ \\ | | | | | \\'_\\| |/ /", consoleOptions);
  console.log('%c\\__ \\ |_| | |   \\ V /  __/ |_| | | | | | |   < ', consoleOptions);
  console.log('%c|___/\\__,_|_|    \\_/ \\___|\\__, |_|_|_| |_|_|\\_\\', consoleOptions);
  console.log('%c                           __/ |               ', consoleOptions);
  console.log('%c                          |___/ ', consoleOptions);
  
  logger.info('%c                                _ _       _  ', consoleOptions);
  logger.info('%c                               | (_)     | |   ', consoleOptions);
  logger.info('%c ___ _   _ _ ____   _____ _   _| |_ _ __ | | __', consoleOptions);
  logger.info("%c/ __| | | | '__\\ \\ / / _ \\ | | | | | \\'_\\| |/ /", consoleOptions);
  logger.info('%c\\__ \\ |_| | |   \\ V /  __/ |_| | | | | | |   < ', consoleOptions);
  logger.info('%c|___/\\__,_|_|    \\_/ \\___|\\__, |_|_|_| |_|_|\\_\\', consoleOptions);
  logger.info('%c                           __/ |               ', consoleOptions);
  logger.info('%c                          |___/ ', consoleOptions);
  
   
  }


 