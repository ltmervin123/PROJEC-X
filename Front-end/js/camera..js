let isRecording = false;
let mediaRecorder;
let recordedChunks = [];
let timerInterval;
let seconds = 0;


// Close popup
document.getElementById("closePopupBtn").addEventListener("click", function() {
    document.getElementById("popupContainer").style.display = "none"; // Corrected to "none"
    stopCamera();
    resetTimer();
});

// Function to start camera
function startCamera() {
    const video = document.getElementById("video");
    navigator.mediaDevices.getUserMedia({ video: true })
        .then(stream => {
            video.srcObject = stream;
            mediaRecorder = new MediaRecorder(stream);
            mediaRecorder.ondataavailable = handleDataAvailable;
            mediaRecorder.onstop = handleStop;
        })
        .catch(error => {
            console.error("Error accessing camera: ", error);
        });
}

// Handle data available
function handleDataAvailable(event) {
    if (event.data.size > 0) {
        recordedChunks.push(event.data);
    }
}

// Handle stop recording
function handleStop() {
    const blob = new Blob(recordedChunks, {
        type: "video/webm"
    });
    recordedChunks = [];
    // Notify user to save the recording
    const saveRecording = confirm("Do you want to save the recording?");
    if (saveRecording) {
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'recording.webm';
        a.click();
        URL.revokeObjectURL(url);
    }
}

// Function to stop camera
function stopCamera() {
    const video = document.getElementById("video");
    const stream = video.srcObject;
    if (stream) {
        const tracks = stream.getTracks();
        tracks.forEach(track => track.stop());
    }
    video.srcObject = null;
}

// Start or stop recording
document.getElementById("recordBtn").addEventListener("click", function() {
    if (isRecording) {
        mediaRecorder.stop();
        stopTimer();
    } else {
        mediaRecorder.start();
        startTimer();
    }
    isRecording = !isRecording;
});

// Timer functions
function startTimer() {
    seconds = 0;
    timerInterval = setInterval(() => {
        seconds++;
        document.getElementById("timer").textContent = formatTime(seconds);
    }, 1000);
}

function stopTimer() {
    clearInterval(timerInterval);
}

function resetTimer() {
    stopTimer();
    seconds = 0;
    document.getElementById("timer").textContent = "00:00";
}

function formatTime(totalSeconds) {
    const minutes = String(Math.floor(totalSeconds / 60)).padStart(2, '0');
    const seconds = String(totalSeconds % 60).padStart(2, '0');
    return `${minutes}:${seconds}`;
}

// Event handler for uploading resume (optional functionality)
document.getElementById("uploadResume").addEventListener("click", function() {
    alert("Upload Resume functionality not implemented yet.");
});
