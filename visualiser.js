document.addEventListener("DOMContentLoaded", function () {
  // --- GET ELEMENTS ---
  const canvas = document.getElementById("visualizer");
  const micToggleBtn = document.getElementById("micToggleBtn");
  const micIcon = micToggleBtn.querySelector(".mic-icon");
  const pauseIcon = micToggleBtn.querySelector(".pause-icon");
  const seekBar = document.getElementById("vnSeekBar");
  const currentTimeEl = document.getElementById("vnCurrentTime");
  const durationEl = document.getElementById("vnDuration");
  const loading = document.getElementById("vnLoading");
  const error = document.getElementById("vnError");
  
  if (!canvas || !micToggleBtn || !seekBar) {
    console.log("Visualizer elements not found on this page.");
    return;
  }
  
  const ctx = canvas.getContext("2d");
  
  // --- AUDIO & VISUALIZER STATE ---
  let audioContext;
  let audioElement;
  let source;
  let analyser;
  let dataArray;
  let bufferLength;
  let animationId;
  let isAudioInitialized = false;

  // --- RESIZE CANVAS ---
  function resizeCanvas() {
    const container = canvas.parentElement;
    if (container.clientWidth > 0) {
      canvas.width = container.clientWidth;
      canvas.height = 300;
    }
  }
  resizeCanvas(); // Initial call
  window.addEventListener("resize", resizeCanvas);

  // --- FORMAT TIME HELPER ---
  function formatTime(seconds) {
    const minutes = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${minutes}:${secs < 10 ? '0' : ''}${secs}`;
  }

  // --- SETUP AUDIO (Called on first click) ---
  function setupAudio() {
    if (isAudioInitialized) return;
    
    loading.style.display = "block";
    error.style.display = "none";
    
    try {
      audioContext = new (window.AudioContext || window.webkitAudioContext)();
      
      analyser = audioContext.createAnalyser();
      analyser.fftSize = 256;
      analyser.smoothingTimeConstant = 0.8;
      bufferLength = analyser.frequencyBinCount;
      dataArray = new Uint8Array(bufferLength);
      
      audioElement = new Audio("vn.m4a");
      audioElement.normalize();
      audioElement.crossOrigin = "anonymous";
      
      source = audioContext.createMediaElementSource(audioElement);
      source.connect(analyser);
      analyser.connect(audioContext.destination);

      audioElement.addEventListener("loadedmetadata", () => {
        durationEl.textContent = formatTime(audioElement.duration);
        seekBar.max = audioElement.duration;
      });

      audioElement.addEventListener("canplaythrough", () => {
        loading.style.display = "none";
      });

      audioElement.addEventListener("timeupdate", () => {
        seekBar.value = audioElement.currentTime;
        currentTimeEl.textContent = formatTime(audioElement.currentTime);
      });

      audioElement.addEventListener("ended", () => {
        micIcon.classList.remove("hidden");
        pauseIcon.classList.add("hidden");
        cancelAnimationFrame(animationId);
      });

      audioElement.addEventListener("error", (e) => {
        console.error("Audio error:", audioElement.error);
        loading.style.display = "none";
        error.style.display = "block";
        error.textContent = "Error: " + (audioElement.error?.message || "Could not load audio.");
      });

      isAudioInitialized = true;

    } catch (err) {
      console.error("Error initializing audio:", err);
      loading.style.display = "none";
      error.style.display = "block";
      error.textContent = "Error: " + err.message;
    }
  }

  // --- TOGGLE PLAY/PAUSE ---
  micToggleBtn.addEventListener("click", () => {
    if (!isAudioInitialized) {
      setupAudio();
    }
    
    if (!audioElement) return;

    if (audioContext.state === "suspended") {
      audioContext.resume();
    }
    
    if (audioElement.paused) {
      // **BUG FIX:** Resize the canvas right before playing, now that it's visible.
      resizeCanvas(); 

      audioElement.play().catch(e => console.error("Play failed:", e));
      micIcon.classList.add("hidden");
      pauseIcon.classList.remove("hidden");
      drawVisualizer();
    } else {
      audioElement.pause();
      micIcon.classList.remove("hidden");
      pauseIcon.classList.add("hidden");
      cancelAnimationFrame(animationId);
    }
  });

  // --- SEEK BAR FUNCTIONALITY ---
  seekBar.addEventListener("input", () => {
    if (audioElement) {
      audioElement.currentTime = seekBar.value;
    }
  });

  // --- DRAW VISUALIZER ---
  let rotationAngle = 0;
  function drawVisualizer() {
    animationId = requestAnimationFrame(drawVisualizer);
    analyser.getByteFrequencyData(dataArray);

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Add rotation
    rotationAngle += 0.01; // Adjust speed as desired
    ctx.save();
    ctx.translate(canvas.width / 2, canvas.height / 2);
    ctx.rotate(rotationAngle);
    ctx.translate(-canvas.width / 2, -canvas.height / 2);

    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const radius = Math.min(canvas.width, canvas.height) * 0.19;
    const barCount = 128;
    const frequencyRange = 90; 

    for (let i = 0; i < barCount; i++) {
        const dataIndex = Math.floor(i * (frequencyRange / barCount));
        const normalized = dataArray[dataIndex] / 255;
        const boosted = Math.pow(normalized, 0.6); 
        let feather = 1;
        if (i < 10) {
          feather = i / 10;
        }
        const barHeight = boosted * (radius * 1.75) * feather;
        
        const angle = (i / barCount) * Math.PI * 2 - Math.PI / 2;

        const x1 = centerX + Math.cos(angle) * radius;
        const y1 = centerY + Math.sin(angle) * radius;
        const x2 = centerX + Math.cos(angle) * (radius + barHeight);
        const y2 = centerY + Math.sin(angle) * (radius + barHeight);

        const gradient = ctx.createLinearGradient(x1, y1, x2, y2);
        gradient.addColorStop(0, "#eae2b7");
        gradient.addColorStop(0.5, "#f08080");
        gradient.addColorStop(1, "#f09180ff");

        ctx.strokeStyle = gradient;
        ctx.lineWidth = (canvas.width / barCount) * 0.8 * feather;
        
        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.stroke();
    }
    ctx.restore();
  }
});