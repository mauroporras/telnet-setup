// server/helpers/hello.js
import { logger } from "./logger.js"; // Import the initialized logger

export default function printStart(){
    const version = "1.0.1";
  
    // Log running version
    console.log("Running Version:", version, '\n'); // Optional: Keep for immediate console visibility
    logger.info(`Running Version: ${version}\n`);

    // ASCII Art Lines
    const asciiArtLines = [
      "                                _ _       _  ",
      "                               | (_)     | |   ",
      " ___ _   _ _ ____   _____ _   _| |_ _ __ | | __",
      "/ __| | | | '__\\ \\ / / _ \\ | | | | | '_ \\| |/ /",
      "\\__ \\ |_| | |   \\ V /  __/ |_| | | | | | |   < ",
      "|___/\\__,_|_|    \\_/ \\___|\\__, |_|_|_| |_|_|\\_\\",
      "                           __/ |               ",
      "                          |___/                "
    ];

    // Print ASCII art to console
    asciiArtLines.forEach(line => {
        console.log(line); // Optional: Keep for immediate console visibility
    });

    // Log ASCII art via logger
    asciiArtLines.forEach(line => {
        logger.info(line);
    });
}
