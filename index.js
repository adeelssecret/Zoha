document.addEventListener("DOMContentLoaded", function () {
  // --- CONFIGURATION ---
  const devMode = false; // SET TO 'false' for the real countdown

  // --- DOM ELEMENTS ---
  const entryScreen = document.getElementById("entry-screen");
  const enterBtn = document.getElementById("enter-btn");
  const countdownSection = document.getElementById("countdown");
  const mainContent = document.getElementById("main-content");
  const bgMusic = document.getElementById("bgMusic");

  // --- AUDIO & VIDEO PRELOADING ---
  const birthdayMusic = new Audio("birthday.mp3");
  birthdayMusic.preload = "auto";

  // =================================================================
  // MAIN INITIALIZATION FUNCTION - This is the master controller
  // =================================================================
  function init() {
    // 1. Setup the entry screen listener
    enterBtn.addEventListener("click", () => {
        // Fade out the entry screen
        entryScreen.style.opacity = "0";
        setTimeout(() => entryScreen.remove(), 500);

        // User has interacted, we can now safely play audio
        bgMusic.volume = 0.1;
        bgMusic.play();

        // Start preloading other assets in the background
        preloadAssets();

        // 2. Decide whether to show countdown or main content
        if (devMode) {
          showMainContent();
        } else {
          startCountdown(showMainContent);
        }
      }, { once: true } // Ensure this only runs once
    );
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

    }, 1000);
  }

  function startCountdown(onComplete) {
    const birthday = new Date("September 28, 2025 04:50:00").getTime();
    let birthdayAudioPlayed = false;

    const timerInterval = setInterval(() => {
      const now = new Date().getTime();
      const distance = birthday - now;

      // Play birthday.mp3 in the last 10 seconds
      if (distance <= 11000 && !birthdayAudioPlayed) {
        birthdayAudioPlayed = true;
        if (bgMusic) bgMusic.pause();
        birthdayMusic.volume = 0.7;
        birthdayMusic.play();

        birthdayMusic.addEventListener("ended", () => {
            if (bgMusic && !devMode) bgMusic.play();
        }, { once: true });
      }

      if (distance < 0) {
        clearInterval(timerInterval);
        onComplete();
        return;
      }
      // Update timer display
      document.getElementById("days").innerHTML = Math.floor(distance/(1e3*60*60*24)).toString().padStart(2,"0");
      document.getElementById("hours").innerHTML = Math.floor(distance%(1e3*60*60*24)/(1e3*60*60)).toString().padStart(2,"0");
      document.getElementById("minutes").innerHTML = Math.floor(distance%(1e3*60*60)/(1e3*60)).toString().padStart(2,"0");
      document.getElementById("seconds").innerHTML = Math.floor(distance%(1e3*60)/1e3).toString().padStart(2,"0");
    }, 1000);
  }
  
  function preloadAssets() {
    const friendsVideo = document.getElementById("friendsVideo");
    if (friendsVideo) {
      friendsVideo.preload = "auto";
    }
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
        confettiInstance({ particleCount: 5, angle: 60, spread: 55, origin: { x: 0 }, colors: ["#d16bff", "#ff6ebd", "#e5b6ff"] });
        confettiInstance({ particleCount: 5, angle: 120, spread: 55, origin: { x: 1 }, colors: ["#d16bff", "#ff6ebd", "#e5b6ff"] });
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
      }, { threshold: 0.6 }
    );
    document.querySelectorAll(".timeline-item").forEach((item) => observer.observe(item));
  }

  function setupVideoPlayer() {
    const video = document.getElementById("friendsVideo");
    if (!video) return;
    video.addEventListener("play", () => window.bgMusicControls?.pause());
    video.addEventListener("pause", () => window.bgMusicControls?.play());
    video.addEventListener("ended", () => window.bgMusicControls?.play());
  }

  function setupSongPlayer() {
    const playBtn = document.getElementById("playBtn");
    const waveformContainer = document.getElementById("waveform");
    if (!playBtn || !waveformContainer) return;

    const wavesurfer = WaveSurfer.create({
      container: waveformContainer,
      waveColor: "rgba(229, 182, 255, 0.5)",
      progressColor: "#ff6ebd",
      height: 60, barWidth: 3, barRadius: 3, responsive: true,
    });
    // IMPORTANT: Replace with your song's URL
    wavesurfer.load("[FREE] HEAVY METAL TRAP BEAT - ＂SYSTEM＂ ｜ ROCK GUITAR RAP INSTRUMENTAL 2024.wav");
    
    playBtn.addEventListener("click", () => wavesurfer.playPause());
    wavesurfer.on("play", () => { playBtn.innerHTML = "❚❚"; window.bgMusicControls?.pause(); });
    wavesurfer.on("pause", () => { playBtn.innerHTML = "▶"; window.bgMusicControls?.play(); });
    wavesurfer.on("finish", () => { playBtn.innerHTML = "▶"; window.bgMusicControls?.play(); });
  }

  function setupEnvelopeAndLetter() {
    const envelope = document.querySelector(".valentines");
    const popup = document.getElementById("letter-popup");
    const closeBtn = document.getElementById("closeLetterBtn");
    const letterTextContainer = popup.querySelector(".letter-text");

    const paragraphs = letterTextContainer.querySelectorAll("p");
    paragraphs.forEach((p) => {
      p.innerHTML = p.innerText.split("").map((char) => `<span>${char}</span>`).join("");
    });
    const letterSpans = letterTextContainer.querySelectorAll("span");

    function openPopup() {
      envelope.classList.add('open');
      setTimeout(() => {
        popup.classList.remove("hidden");
        handleLetterScroll();
      }, 800);
    }
    function closePopup() {
      popup.classList.add("hidden");
      envelope.classList.remove('open');
    }
    function handleLetterScroll() {
      const { scrollTop, scrollHeight, clientHeight } = letterTextContainer.parentElement;
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
    popup.querySelector(".popup-content").addEventListener("scroll", handleLetterScroll);
  }

  // --- START THE APP ---
  init();
});