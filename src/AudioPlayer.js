import { exec } from "child_process";
import path from "path";

class AudioPlayer {
  constructor() {
    this.isPlaying = false;
  }

  play(filePath, callback) {
    if (this.isPlaying) {
      console.log("Already playing an audio file.");
      return;
    }

    this.isPlaying = true;

    const fullPath = path.resolve(filePath);

    // Play command varies based on OS
    const playCommand = process.platform === "win32" ? "start" : "afplay";

    // Execute the play command with the audio file path
    exec(`${playCommand} "${fullPath}"`, (error, stdout, stderr) => {
      this.isPlaying = false;

      if (error) {
        console.error(`Error playing audio: ${stderr}`);
        if (callback) callback(error);
      } else {
        console.log("Audio playback finished.");
        if (callback) callback(null);
      }
    });
  }
}

export default new AudioPlayer();
