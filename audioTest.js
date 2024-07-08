import audioPlayer from "./src/AudioPlayer.js";

async function main() {
  await audioPlayer.play("audio/tenMinutes.mp3");
}

main().then(() => console.log("-- END OF LINE --"));
