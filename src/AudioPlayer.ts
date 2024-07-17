import { exec } from "child_process";
import path from "path";

class AudioPlayer {
  isPlaying: boolean;
  constructor() {
    this.isPlaying = false;
  }

  async play(filePath: string) {
    if (this.isPlaying) {
      console.log("Already playing an audio file.");
      return;
    }

    this.isPlaying = true;

    const fullPath = path.resolve(filePath);

    // Play command varies based on OS
    const playCommand = process.platform === "win32" ? `start /min` : "afplay";

    return new Promise<void>((resolve, reject) => {
      exec(`${playCommand} "${fullPath}"`, (error, stdout, stderr) => {
        this.isPlaying = false;
        resolve();
      });
    });
  }
}

export default new AudioPlayer();
