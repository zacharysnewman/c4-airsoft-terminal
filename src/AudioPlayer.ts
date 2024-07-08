import { exec } from "child_process";
import path from "path";

class AudioPlayer {
  constructor() {
    this.isPlaying = false;
  }

  async play(filePath) {
    if (this.isPlaying) {
      console.log("Already playing an audio file.");
      return;
    }

    this.isPlaying = true;

    const fullPath = path.resolve(filePath);

    // Play command varies based on OS
    const playCommand = process.platform === "win32" ? `start /min` : "afplay";

    return new Promise((resolve, reject) => {
      exec(`${playCommand} "${fullPath}"`, (error, stdout, stderr) => {
        this.isPlaying = false;

        if (error) {
          console.error(`Error playing audio: ${stderr}`);
          reject(error);
        } else {
          console.log("Audio playback finished.");
          resolve();
        }
      });
    });
  }
}

export default new AudioPlayer();
