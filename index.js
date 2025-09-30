document.addEventListener("DOMContentLoaded", function () {
  // --- CONFIGURATION ---
  const devMode = false; // SET TO 'false' for the real countdown

  // --- DOM ELEMENTS ---
  const entryScreen = document.getElementById("entry-screen");
  const enterBtn = document.getElementById("enter-btn");
  const countdownSection = document.getElementById("countdown");
  const mainContent = document.getElementById("main-content");
  const bgMusic = document.getElementById("bgMusic");
  const progressBar = document.getElementById("progressBar");

  // --- SCROLL PROGRESS ---
  window.addEventListener("scroll", () => {
    const winScroll =
      document.body.scrollTop || document.documentElement.scrollTop;
    const height =
      document.documentElement.scrollHeight -
      document.documentElement.clientHeight;
    const scrolled = (winScroll / height) * 100;
    progressBar.style.width = scrolled + "%";
  });

  // --- AUDIO & VIDEO PRELOADING ---
  const birthdayMusic = new Audio("birthday.mp3");
  birthdayMusic.preload = "auto";

  // =================================================================
  // MAIN INITIALIZATION FUNCTION - This is the master controller
  // =================================================================
  function init() {
    // 1. Setup the entry screen listener
    enterBtn.addEventListener(
      "click",
      () => {
        // Fade out the entry screen
        entryScreen.style.opacity = "0";
        setTimeout(() => entryScreen.remove(), 500);

        // User has interacted, we can now safely play audio
        bgMusic.volume = 0.1;
        bgMusic.play();

        // Start preloading other assets in the background
        preloadAssets();

        // 2. Decide whether to show countdown or main content
  const birthday = new Date("October 2, 2025 00:00:00").getTime();

        const now = new Date().getTime();
        if (devMode) {
          showMainContent();
        } else if (now > birthday) {
          // If birthday is passed, start a short 12s countdown
          startCountdown(showMainContent, 12000);
        } else {
          startCountdown(showMainContent);
        }
      },
      { once: true }
    ); // Ensure this only runs once
  }

  // --- CORE LOGIC FUNCTIONS ---
  function showMainContent() {
    countdownSection.style.transition = "opacity 1s ease-out";
    countdownSection.style.opacity = "0";

    setTimeout(() => {
      countdownSection.remove();
      mainContent.classList.remove("hidden");

      // 3. Initialize all features for the main site AFTER it's visible
      setupFloatingElements();
      setupConfetti();
      setupMusicControls();
      setupTimelineScroll();
      setupVideoPlayer();
      setupSongPlayer();
      setupEnvelopeAndLetter();
      setupScrollAnimations();
    }, 1000);
  }

  function startCountdown(onComplete, customDurationMs) {
    const birthday = new Date("October 2, 2025 00:00:00").getTime();
    let birthdayAudioPlayed = false;
    let countdownEnd;
    if (typeof customDurationMs === "number") {
      // If custom duration is provided (e.g., 11s after birthday passed)
      countdownEnd = new Date().getTime() + customDurationMs;
    } else {
      countdownEnd = birthday;
    }

    const timerInterval = setInterval(() => {
      const now = new Date().getTime();
      const distance = countdownEnd - now;

      // Play birthday.mp3 in the last 10 seconds
      if (distance <= 11000 && !birthdayAudioPlayed) {
        birthdayAudioPlayed = true;
        if (bgMusic) bgMusic.pause();
        birthdayMusic.volume = 0.7;
        birthdayMusic.play();

        birthdayMusic.addEventListener(
          "ended",
          () => {
            if (bgMusic && !devMode) bgMusic.play();
          },
          { once: true }
        );
      }

      if (distance < 0) {
        clearInterval(timerInterval);
        onComplete();
        return;
      }
      // Update timer display
      let days = Math.floor(distance / (1e3 * 60 * 60 * 24));
      let hours = Math.floor(
        (distance % (1e3 * 60 * 60 * 24)) / (1e3 * 60 * 60)
      );
      let minutes = Math.floor((distance % (1e3 * 60 * 60)) / (1e3 * 60));
      let seconds = Math.floor((distance % (1e3 * 60)) / 1e3);
      // If using custom 11s countdown, show only seconds
      if (typeof customDurationMs === "number") {
        days = hours = minutes = 0;
      }
      document.getElementById("days").innerHTML = days
        .toString()
        .padStart(2, "0");
      document.getElementById("hours").innerHTML = hours
        .toString()
        .padStart(2, "0");
      document.getElementById("minutes").innerHTML = minutes
        .toString()
        .padStart(2, "0");
      document.getElementById("seconds").innerHTML = seconds
        .toString()
        .padStart(2, "0");
    }, 1000);
  }

  function preloadAssets() {
    const friendsVideo = document.getElementById("friendsVideo");
    if (friendsVideo) {
      friendsVideo.preload = "auto";
    }
  }

  // --- SCROLL ANIMATIONS ---
  function setupScrollAnimations() {
    const observerOptions = {
      threshold: 0.1,
      rootMargin: "0px 0px -50px 0px",
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
        }
      });
    }, observerOptions);

    document.querySelectorAll(".content-section").forEach((section) => {
      observer.observe(section);
    });
  }

  // --- FEATURE SETUP FUNCTIONS ---

  function setupFloatingElements() {
    const container = document.querySelector(".floating-elements");
    const symbols = ["❤️", "🎂", "🎁", "🎉", "💐", "🌸"];
    for (let i = 0; i < 20; i++) {
      const el = document.createElement("div");
      el.className = "floating-element";
      el.innerHTML = symbols[Math.floor(Math.random() * symbols.length)];
      el.style.left = `${Math.random() * 100}%`;
      el.style.fontSize = `${Math.random() * 20 + 15}px`;
      el.style.animationDuration = `${Math.random() * 10 + 15}s`;
      el.style.animationDelay = `${Math.random() * 5}s`;
      container.appendChild(el);
    }
  }

  function setupConfetti() {
    const canvas = document.getElementById("confetti-canvas");
    if (!canvas) return;
    const confettiInstance = confetti.create(canvas, {
      resize: true,
      useWorker: true,
    });
    setInterval(() => {
      confettiInstance({
        particleCount: 200,
        angle: 60,
        spread: 55,
        origin: { x: 0 },
        colors: ["#d16bff", "#ff6ebd", "#e5b6ff"],
      });
      confettiInstance({
        particleCount: 200,
        angle: 120,
        spread: 55,
        origin: { x: 1 },
        colors: ["#d16bff", "#ff6ebd", "#e5b6ff"],
      });
    }, 2000);
  }

  function setupMusicControls() {
    const musicToggle = document.getElementById("musicToggle");
    if (!bgMusic || !musicToggle) return;

    const playMusic = () => bgMusic.play();
    const pauseMusic = () => bgMusic.pause();

    musicToggle.addEventListener("click", () => {
      bgMusic.paused ? playMusic() : pauseMusic();
    });
    // Store controls globally to be accessed by other players
    window.bgMusicControls = { play: playMusic, pause: pauseMusic };
  }

  function setupTimelineScroll() {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          entry.target.classList.toggle("active", entry.isIntersecting);
        });
      },
      { threshold: 0.6 }
    );
    document
      .querySelectorAll(".timeline-item")
      .forEach((item) => observer.observe(item));
  }

  function setupVideoPlayer() {
    const video = document.getElementById("friendsVideo");
    if (!video) return;
    video.addEventListener("play", () => window.bgMusicControls?.pause());
    video.addEventListener("pause", () => window.bgMusicControls?.play());
    video.addEventListener("ended", () => window.bgMusicControls?.play());
  }

  // --- LYRICS SYSTEM ---
  // Lyrics data parsed from lyrics.txt
  const lyricsData = [
    { time: 1, text: "This song is dedicated to the most .." },
    { time: 3, text: "Beautiful person ..." },
    { time: 6, text: "I've ever met in my life." },
    { time: 9, text: "Yeh aap ke liya hai meri begum ji." },
    { time: 11, text: "..." },
    { time: 22.5, text: "Salamalaikum begum ji <br> Ayaaa ! Ayaaa !" },
    { time: 25, text: "Sunain meray geet ap <br> thora muskrayaa" },
    { time: 28, text: "Apsa to sirf mjha kahna ha yay !" },
    { time: 31, text: "Guriya Rani !! <br> Happy Birthday !" },
    { time: 33.5, text: "Birthday girl, princess meri <br> meri ha tu shine" },
    { time: 36.5, text: "Asmaan sa utri <br> tu lagti divine" },
    { time: 39, text: "Khudaaa janay ya ! <br> kya ha nasha ?" },
    { time: 42, text: "Ya ankhain hain teri <br> ya fir red wine" },
    { time: 45, text: "Nanni munni jan, mera chota sa bacha" },
    { time: 48, text: "itta pyara q ha ka ma kha jaun kacha" },
    { time: 50.5, text: "Tell me aj aik thing <br> why are you hot !" },
    { time: 53.5, text: "I Cant wait to just tie our knot !" },
    { time: 56.25, text: "Har cheez ma mjha sirf dikhti ha tu" },
    { time: 58.75, text: "Meri Guriyaa Rani I love you !" },
    { time: 62, text: "Husn ki to Malkaaa ha tu" },
    { time: 64.5, text: "Meri Begum Ji I love you !" },
    { time: 67.5, text: "Meri rooh ka kareeb <br> Meri jaan ha tu" },
    { time: 70, text: "Meri shehzadi I love you !" },
    { time: 73, text: "Mera dil tjh pa marta ha q" },
    { time: 76, text: "Meri Guriyaa Rani ..." },
    { time: 78.5, text: "Kahin nahi chorh ka <br> ma jaun ga apko" },
    { time: 81.5, text: "Waada ha mera ka <br> paun ga ma apko" },
    { time: 84.5, text: "Fir mjha jo kch bhi karna parhay" },
    { time: 87, text: "Pawain is Jahan sa q na <br> larhna parhay" },
    { time: 90, text: "Ap hain sirf meri, aur <br> Ma hun sirf aap ka" },
    { time: 93, text: "I'll give you love ! <br> har nasal zaat ka" },
    { time: 95.5, text: "Dua karun main, <br> sirf yhi rab sa" },
    { time: 98.5, text: "Azal tak kaim hamara ya raabta !" },
    { time: 101.5, text: "Pyar karna chahun apko <br> din rat, subh sham" },
    { time: 104, text: "Dekhun bas aaapko, <br> na aur ho koi mjha kaaam" },
    { time: 107, text: "Sab kuch chahun ma <br> aap par hi waar dun" },
    { time: 110, text: "Apni sari hayat ! <br> apka charnon ma guzar dun." },
    { time: 112.75, text: "Har cheez ma mjha sirf dikhti ha tu" },
    { time: 115.25, text: "Meri Guriyaa Rani I love you !" },
    { time: 118.5, text: "Husn ki to Malkaaa ha tu" },
    { time: 121, text: "Meri Begum Ji I love you !" },
    { time: 124, text: "Meri rooh ka kareeb <br> Meri jaan ha tu" },
    { time: 126.5, text: "Meri shehzadi I love you !" },
    { time: 129.5, text: "Mera dil tjh par marta ha q" },
    { time: 132.5, text: "Meri Guriyaa Rani ..." },
    { time: 135, text: "" },
  ];

  function setupSongPlayer() {
    const playBtn = document.getElementById("playBtn");
    const waveformContainer = document.getElementById("waveform");
    const lyricsElem = document.getElementById("lyrics");
    const songPlayer = document.getElementById("song-player");
    if (!playBtn || !waveformContainer || !lyricsElem) return;

    const wavesurfer = WaveSurfer.create({
      container: waveformContainer,
      waveColor: "rgba(229, 182, 255, 0.5)",
      progressColor: "#ff6ebd",
      height: 60,
      barWidth: 3,
      barRadius: 3,
      responsive: true,
    });
    wavesurfer.load("song.mp3");

    playBtn.addEventListener("click", () => wavesurfer.playPause());
    wavesurfer.on("play", () => {
      playBtn.innerHTML = "❚❚";
      window.bgMusicControls?.pause();
    });
    wavesurfer.on("pause", () => {
      playBtn.innerHTML = "▶";
      window.bgMusicControls?.play();
    });
    wavesurfer.on("finish", () => {
      playBtn.innerHTML = "▶";
      window.bgMusicControls?.play();
    });

    // Make song player visible when it comes into view
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            songPlayer.classList.add("visible");
          }
        });
      },
      { threshold: 0.1 }
    );
    observer.observe(songPlayer);

    // --- LYRICS SYNC ---
    let lyricsInterval = null;
    let lastLyricIndex = -1;

    function animateLyrics(newText) {
      lyricsElem.style.opacity = 0;
      setTimeout(() => {
        lyricsElem.innerHTML = newText;
        lyricsElem.style.transition = "opacity 0.5s";
        lyricsElem.style.opacity = 1;
      }, 200);
    }

    function updateLyrics() {
      const currentTime = wavesurfer.getCurrentTime();
      let idx = lyricsData.length - 1;
      for (let i = 0; i < lyricsData.length; i++) {
        if (currentTime < lyricsData[i].time) {
          idx = i - 1;
          break;
        }
      }
      if (idx !== lastLyricIndex && idx >= 0) {
        animateLyrics(lyricsData[idx].text);
        lastLyricIndex = idx;
      }
      if (currentTime < lyricsData[0].time) {
        lyricsElem.textContent = "";
        lastLyricIndex = -1;
      }
    }

    wavesurfer.on("play", () => {
      if (lyricsInterval) clearInterval(lyricsInterval);
      lyricsInterval = setInterval(updateLyrics, 100);
    });
    wavesurfer.on("pause", () => {
      if (lyricsInterval) clearInterval(lyricsInterval);
    });
    wavesurfer.on("finish", () => {
      if (lyricsInterval) clearInterval(lyricsInterval);
      lyricsElem.textContent = "";
      lastLyricIndex = -1;
    });
  }

  function setupEnvelopeAndLetter() {
    const envelope = document.querySelector(".valentines");
    const popup = document.getElementById("letter-popup");
    const closeBtn = document.getElementById("closeLetterBtn");
    const letterTextContainer = popup.querySelector(".letter-text");

    const paragraphs = letterTextContainer.querySelectorAll("p");
    paragraphs.forEach((p) => {
      p.innerHTML = p.innerText
        .split("")
        .map((char) => `<span>${char}</span>`)
        .join("");
    });
    const letterSpans = letterTextContainer.querySelectorAll("span");

    function openPopup() {
      envelope.classList.add("open");
      setTimeout(() => {
        popup.classList.remove("hidden");
        handleLetterScroll();
      }, 800);
    }
    function closePopup() {
      popup.classList.add("hidden");
      envelope.classList.remove("open");
    }
    function handleLetterScroll() {
      const { scrollTop, scrollHeight, clientHeight } =
        letterTextContainer.parentElement;
      const scrollPercent = scrollTop / (scrollHeight - clientHeight) + 0.21;
      const highlightedIndex = Math.floor(letterSpans.length * scrollPercent);
      letterSpans.forEach((span, i) => {
        span.classList.toggle("highlight", i <= highlightedIndex);
      });
    }

    envelope.addEventListener("click", openPopup);
    closeBtn.addEventListener("click", closePopup);
    popup.addEventListener("click", (e) => {
      if (e.target === popup) closePopup();
    });
    popup
      .querySelector(".popup-content")
      .addEventListener("scroll", handleLetterScroll);
  }

  // --- START THE APP ---
  init();
});

// Visualizer.js code
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
    return `${minutes}:${secs < 10 ? "0" : ""}${secs}`;
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
        error.textContent =
          "Error: " + (audioElement.error?.message || "Could not load audio.");
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

      audioElement.play().catch((e) => console.error("Play failed:", e));
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
