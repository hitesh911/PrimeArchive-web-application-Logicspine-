import { Login } from "./login.mjs";
import { ShowAlert } from "./common.js";

const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);

const playPauseBtn = document.querySelector(".play-pause-btn")
const theaterBtn = document.querySelector(".theater-btn")
const fullScreenBtn = document.querySelector(".full-screen-btn")
const miniPlayerBtn = document.querySelector(".mini-player-btn")
const muteBtn = document.querySelector(".mute-btn")
const captionsBtn = document.querySelector(".captions-btn")
const speedBtn = document.querySelector(".speed-btn")
const currentTimeElem = document.querySelector(".current-time")
const totalTimeElem = document.querySelector(".total-time")
const previewImg = document.querySelector(".preview-img")
const thumbnailImg = document.querySelector(".thumbnail-img")
const volumeSlider = document.querySelector(".volume-slider")
const videoContainer = document.querySelector(".video-container")
const timelineContainer = document.querySelector(".timeline-container")
const video = document.querySelector("video")
const videoControlsContainer = document.querySelector(".video-controls-container")
const loadingContainer= document.querySelector(".loading-container")
const chatToggleContainer = document.querySelector(".chat-toggle-container")
const chatToggler = document.querySelector(".chat-toggler")
const mainContainer = document.querySelector("#main-container");



// making chat-toggler 
if(isMobile){
  chatToggleContainer.style.display = "none";
}
// hover open effect for container 
chatToggleContainer.addEventListener("mouseenter",()=>{
  chatToggleContainer.classList.add("active");
});
document.addEventListener('click', function(event) {
  if (!chatToggleContainer.contains(event.target)) {
    chatToggleContainer.classList.remove('active');
  }
});
// chat shiffter onclick on btn 
chatToggler.addEventListener("click",toggleChat)
function toggleChat(){
    if(mainContainer.classList.contains("toggle-on")){
      mainContainer.classList.remove("toggle-on");
    }else{
      mainContainer.classList.add("toggle-on");
    }

  
}



// others 
document.addEventListener("keydown", e => {
  const tagName = document.activeElement.tagName.toLowerCase()

  if (tagName === "input") return

  switch (e.key.toLowerCase()) {
    case " ":
      if (tagName === "button") return
    case "k":
      togglePlay()
      break
    case "f":
      toggleFullScreenMode()
      break
    case "t":
      toggleTheaterMode()
      break
    case "i":
      toggleMiniPlayerMode()
      break
    case "m":
      toggleMute()
      break
    case "arrowleft":
    case "j":
      skip(-5)
      break
    case "arrowright":
    case "l":
      skip(5)
      break
    case "c":
      toggleCaptions()
      break
  }
})

// make full screen 
fullScreenBtn.addEventListener('click', () => {
  if (document.fullscreenElement) {
    exitFullscreen();
  } else {
    enterFullscreen();
  }
});

function enterFullscreen() {
  if (videoContainer.requestFullscreen) {
    videoContainer.requestFullscreen();
  } else if (videoContainer.mozRequestFullScreen) {
    videoContainer.mozRequestFullScreen();
  } else if (videoContainer.webkitRequestFullscreen) {
    videoContainer.webkitRequestFullscreen();
  } else if (videoContainer.msRequestFullscreen) {
    videoContainer.msRequestFullscreen();
  }
  
  // Lock the screen orientation to landscape
  screen.orientation.lock('landscape');
}

function exitFullscreen() {
  if (document.exitFullscreen) {
    document.exitFullscreen();
  } else if (document.mozCancelFullScreen) {
    document.mozCancelFullScreen();
  } else if (document.webkitExitFullscreen) {
    document.webkitExitFullscreen();
  } else if (document.msExitFullscreen) {
    document.msExitFullscreen();
  }

  // Unlock the screen orientation
  screen.orientation.unlock();
}

// timeline 
timelineContainer.addEventListener("mousedown", handleMouseDown);
timelineContainer.addEventListener("touchstart", handleTouchStart);
document.addEventListener("mouseup", handleMouseUp);
document.addEventListener("touchend", handleTouchEnd);
document.addEventListener("mousemove", handleMouseMove);
document.addEventListener("touchmove", handleTouchMove);

let isScrubbing = false;
let wasPaused;

function handleMouseDown(e) {
  startScrubbing(e.clientX);
}

function handleTouchStart(e) {
  startScrubbing(e.touches[0].clientX);
}

function handleMouseUp(e) {
  if (isScrubbing) stopScrubbing(e.clientX);
}

function handleTouchEnd(e) {
  if (isScrubbing) stopScrubbing(e.changedTouches[0].clientX);
}

function handleMouseMove(e) {
  if (isScrubbing) updateScrubbing(e.clientX);
}

function handleTouchMove(e) {
  if (isScrubbing) updateScrubbing(e.touches[0].clientX);
}

function startScrubbing(clientX) {
  const rect = timelineContainer.getBoundingClientRect();
  const percent = Math.min(Math.max(0, clientX - rect.x), rect.width) / rect.width;

  isScrubbing = true;
  videoContainer.classList.add("scrubbing");
  wasPaused = video.paused;
  video.pause();
  updateTimeline(percent);
}

function stopScrubbing(clientX) {
  if (isScrubbing) {
    const rect = timelineContainer.getBoundingClientRect();
    const percent = Math.min(Math.max(0, clientX - rect.x), rect.width) / rect.width;
    video.currentTime = percent * video.duration;

    if (!wasPaused) {
      video.play();
    }

    isScrubbing = false;
    videoContainer.classList.remove("scrubbing");
    updateTimeline(percent);
  }
}

function updateScrubbing(clientX) {
  const rect = timelineContainer.getBoundingClientRect();
  const percent = Math.min(Math.max(0, clientX - rect.x), rect.width) / rect.width;

  if (isScrubbing) {
    videoContainer.classList.add("scrubbing");
    video.pause();
    video.currentTime = percent * video.duration;
    updateTimeline(percent);
  }
}

function updateTimeline(percent) {
  timelineContainer.style.setProperty("--preview-position", percent);
  timelineContainer.style.setProperty("--progress-position", percent);
}

// Playback Speed
speedBtn.addEventListener("click", changePlaybackSpeed)

function changePlaybackSpeed() {
  let newPlaybackRate = video.playbackRate + 0.25
  if (newPlaybackRate > 2) newPlaybackRate = 0.25
  video.playbackRate = newPlaybackRate
  speedBtn.textContent = `${newPlaybackRate}x`
}

// Captions
const captions = video.textTracks[0]
captions.mode = "hidden"

captionsBtn.addEventListener("click", toggleCaptions)

function toggleCaptions() {
  const isHidden = captions.mode === "hidden"
  captions.mode = isHidden ? "showing" : "hidden"
  videoContainer.classList.toggle("captions", isHidden)
}

// Duration
video.addEventListener("loadeddata", () => {
  totalTimeElem.textContent = formatDuration(video.duration)
})

video.addEventListener("timeupdate", () => {
  currentTimeElem.textContent = formatDuration(video.currentTime)
  const percent = video.currentTime / video.duration
  timelineContainer.style.setProperty("--progress-position", percent)
})

const leadingZeroFormatter = new Intl.NumberFormat(undefined, {
  minimumIntegerDigits: 2,
})
function formatDuration(time) {
  const seconds = Math.floor(time % 60)
  const minutes = Math.floor(time / 60) % 60
  const hours = Math.floor(time / 3600)
  if (hours === 0) {
    return `${minutes}:${leadingZeroFormatter.format(seconds)}`
  } else {
    return `${hours}:${leadingZeroFormatter.format(
      minutes
    )}:${leadingZeroFormatter.format(seconds)}`
  }
}

function skip(duration) {
  video.currentTime += duration
}

// Volume
muteBtn.addEventListener("click", toggleMute)
volumeSlider.addEventListener("input", e => {
  video.volume = e.target.value
  video.muted = e.target.value === 0
})

function toggleMute() {
  video.muted = !video.muted
}

video.addEventListener("volumechange", () => {
  volumeSlider.value = video.volume
  let volumeLevel
  if (video.muted || video.volume === 0) {
    volumeSlider.value = 0
    volumeLevel = "muted"
  } else if (video.volume >= 0.5) {
    volumeLevel = "high"
  } else {
    volumeLevel = "low"
  }

  videoContainer.dataset.volumeLevel = volumeLevel
})

// View Modes
if(isMobile){
  theaterBtn.style.display = "none";
}
theaterBtn.addEventListener("click", toggleTheaterMode)
miniPlayerBtn.addEventListener("click", toggleMiniPlayerMode)

function toggleTheaterMode() {
  videoContainer.classList.toggle("theater")
}



function toggleMiniPlayerMode() {
  if (videoContainer.classList.contains("mini-player")) {
    document.exitPictureInPicture()
  } else {
    video.requestPictureInPicture()
  }
}

document.addEventListener("fullscreenchange", () => {
  videoContainer.classList.toggle("full-screen", document.fullscreenElement)
})

video.addEventListener("enterpictureinpicture", () => {
  videoContainer.classList.add("mini-player")
})

video.addEventListener("leavepictureinpicture", () => {
  videoContainer.classList.remove("mini-player")
})

// Play/Pause
playPauseBtn.addEventListener("click", togglePlay)
if(!isMobile){
  video.addEventListener("click", togglePlay);
}else{
  video.addEventListener("click", opacityToggle);
}
function opacityToggle(){
  const elem = videoControlsContainer;
     // Get the current opacity value and convert it to a number
  const currentOpacity = parseFloat(window.getComputedStyle(elem).opacity);
  elem.style.opacity = currentOpacity === 1 ? 0 : 1;
}
function togglePlay() {
  video.paused ? video.play() : video.pause()
}

video.addEventListener("play", () => {
  videoContainer.classList.remove("paused")
})

video.addEventListener("pause", () => {
  videoContainer.classList.add("paused")
})


// this to showing video buffering 
video.addEventListener("waiting", () => {
  loadingContainer.style.display = "block";
});

video.addEventListener("canplay", () => {
  loadingContainer.style.display = "none";
});

video.addEventListener("error", (e) => {
  ShowAlert("Video can't be played, try refreshing","danger")
});

const newUser = new Login("test7","test@gmail.com","test","captcharandom")
console.log(newUser.Register("test","sharma","this is my bio"))
