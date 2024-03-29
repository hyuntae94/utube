import getBlobDuration from "get-blob-duration";

const videoContainer = document.getElementById("jsVideoPlayer");
const videoPlayer = document.querySelector("#jsVideoPlayer video");
const playBtn = document.getElementById("jsPlayButton");
const progress = document.querySelector(".progress");
const volumeBtn = document.getElementById("jsVolumeBtn");
const fullScrnBtn = document.getElementById("jsFullScreen");
const currentTime = document.getElementById("currentTime");
const totalTime = document.getElementById("totalTime");
const volumeRange = document.getElementById("jsVolume");

let currentTimeNum = 0.0;
let duration = 0.1;

const registerView = () => {
	const videoId = window.location.href.split("/videos/")[1];
	fetch(`/api/${videoId}/view`, {
		method: "POST"
	});
};

function handlePlayClick() {
	if (videoPlayer.paused) {
		videoPlayer.play();
		playBtn.innerHTML = '<i class="fas fa-pause"></i>';
	} else {
		videoPlayer.pause();
		playBtn.innerHTML = '<i class="fas fa-play"></i>';
	}
}

function handleVolumeClick() {
	if (videoPlayer.muted) {
		videoPlayer.muted = false;
		volumeBtn.innerHTML = '<i class="fas fa-volume-up"></i>';
		volumeRange.value = videoPlayer.volume;
	} else {
		volumeRange.value = 0;
		videoPlayer.muted = true;
		volumeBtn.innerHTML = '<i class="fas fa-volume-mute"></i>';
	}
}

function exitFullScreen() {
	fullScrnBtn.innerHTML = '<i class="fas fa-expand"></i>';
	fullScrnBtn.addEventListener("click", goFullScreen);
	if (document.exitFullscreen) {
		document.exitFullscreen();
	} else if (document.mozCancelFullScreen) {
		document.mozRequestFullScreen();
	} else if (document.webkitExitFullScreen) {
		document.webkitExitFullScreen();
	} else if (document.msExitFullScreen) {
		document.msExitFullScreen();
	}
}

function goFullScreen() {
	if (videoContainer.requestFullscreen) {
		videoContainer.requestFullscreen();
	} else if (videoContainer.mozRequestFullScreen) {
		videoContainer.mozRequestFullScreen();
	} else if (videoContainer.webkitRequestFullScreen) {
		videoContainer.mozRequestFullScreen();
	} else if (videoContainer.msRequestFullScreen) {
		videoContainer.msRequestFullScreen();
	}
	fullScrnBtn.innerHTML = '<i class="fas fa-compress"></i>';
	fullScrnBtn.removeEventListener("click", goFullScreen);
	fullScrnBtn.addEventListener("click", exitFullScreen);
}

const formatDate = seconds => {
	const secondsNumber = parseInt(seconds, 10);
	let hours = Math.floor(secondsNumber / 3600);
	let minutes = Math.floor((secondsNumber - hours * 3600) / 60);
	let totalSeconds = secondsNumber - hours * 3600 - minutes * 60;
	if (hours < 10) {
		hours = `0${hours}`;
	}
	if (minutes < 10) {
		minutes = `0${minutes}`;
	}
	if (totalSeconds < 10) {
		totalSeconds = `0${totalSeconds}`;
	}
	return `${hours}:${minutes}:${totalSeconds}`;
};

function getCurrentTime() {
	const before = videoPlayer.currentTime;
	currentTimeNum = before;
	const after = formatDate(Math.floor(before));
	currentTime.innerHTML = after;
	progress.value = (currentTimeNum / duration) * 100;
}

async function setTotalTime() {
	const blob = await fetch(videoPlayer.src, {
		mode: "cors",
	}).then((response) => response.blob());
	duration = await getBlobDuration(blob);
	const totalTimeString = formatDate(duration);
	totalTime.innerHTML = totalTimeString;
	// currentTime = "00:00"
	setInterval(getCurrentTime, 1000);
}

function handleEnded() {
	registerView();
	videoPlayer.currentTime = 0;
	playBtn.innerHTML = '<i class="fas fa-play"></i>';
}
function handleDrag(event) {
	const {
		target: { value }
	} = event;
	videoPlayer.volume = value;
	if (value >= 0.75) {
		volumeBtn.innerHTML = '<i class="fas fa-volume-up"></i>';
	} else if (value >= 0.3) {
		volumeBtn.innerHTML = '<i class="fas fa-volume-down"></i>';
	} else if (value > 0) {
		volumeBtn.innerHTML = '<i class="fas fa-volume-off"></i>';
	} else {
		volumeBtn.innerHTML = '<i class="fas fa-volume-mute"></i>';
	}
}
function init() {
	videoPlayer.volume = 0.5;
	playBtn.addEventListener("click", handlePlayClick);
	volumeBtn.addEventListener("click", handleVolumeClick);
	fullScrnBtn.addEventListener("click", goFullScreen);
	videoPlayer.addEventListener("loadedmetadata", setTotalTime);
	videoPlayer.addEventListener("ended", handleEnded);
	volumeRange.addEventListener("input", handleDrag);
}

if (videoContainer) {
	init();
}

