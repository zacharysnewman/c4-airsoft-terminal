import { spawn } from "child_process";
import * as os from "os";
import * as path from "path";

function getVlcExecutablePath(): string {
  const platform = os.platform();

  switch (platform) {
    case "win32":
      // Default VLC install path on Windows
      return `"C:\\Program Files\\VideoLAN\\VLC\\vlc.exe"`;

    case "darwin":
      // Default VLC path on macOS
      return "/Applications/VLC.app/Contents/MacOS/VLC";

    default:
      throw new Error(`Unsupported platform: ${platform}`);
  }
}

export function playAudioFile(filePath: string): void {
  const resolvedPath = path.resolve(filePath);
  const vlcPath = getVlcExecutablePath();

  const args: string[] = [
    resolvedPath,
    "--intf",
    "dummy",
    "--play-and-exit",
    "--no-video",
  ];

  const vlcProcess = spawn(vlcPath, args, {
    detached: true,
    stdio: "ignore",
    shell: os.platform() === "win32", // Required to interpret the quoted path on Windows
  });

  vlcProcess.unref();
}

const audioFile = "./audio/tenMinutes.mp3"; // relative or absolute path
playAudioFile(audioFile);
