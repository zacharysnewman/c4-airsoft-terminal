import audioPlayer from "./AudioPlayer.js";

// Play an audio file with a callback
audioPlayer.play("tenMinutes.m4a", (err) => {
  if (err) {
    console.error("Error:", err);
  } else {
    console.log("Playback finished successfully.");
  }
});
