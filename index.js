document.addEventListener("DOMContentLoaded", function () {
  // --- CONFIGURATION ---
  const devMode = false; // SET TO 'false' for the real countdown

  // --- INITIALIZATION ---
  function init() {
    const countdownSection = document.getElementById("countdown");
    const mainContent = document.getElementById("main-content");

    function showMainContent() {
      countdownSection.style.transition = "opacity 1s ease-out";
      countdownSection.style.opacity = "0";

      setTimeout(() => {
        countdownSection.remove();
        mainContent.classList.remove("hidden");
        // Initialize all features for the main site
        setupFloatingElements();
        setupConfetti();
        setupMusic();
        setupTimelineScroll();
        setupVideoPlayer();
        setupSongPlayer();
        setupEnvelopeAndLetter();

      }, 1000);
    }

    if (devMode) {
      showMainContent();
    } else {
      startCountdown(showMainContent);
    }
    $(".envelope-container")
    .mouseenter(function () {
      $(".card").stop().animate(
        {
          top: "-90px",
        },
        "slow"
      );
    })
    .mouseleave(function () {
      $(".card").stop().animate(
        {
          top: 0,
        },
        "slow"
      );
    });
  }

  // --- SETUP FUNCTIONS ---

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
    const canvas = document.getElementById('confetti-canvas');
    if (!canvas) return;
    const confettiInstance = confetti.create(canvas, {
        resize: true,
        useWorker: true
    });
    
    function fireConfetti() {
        confettiInstance({
            particleCount: 500,
            angle: 80,
            spread: 200,
            origin: { x: 0 },
            colors: ['#d16bff', '#ff6ebd', '#e5b6ff']
        });
        confettiInstance({
            particleCount: 500,
            angle: 100,
            spread: 200,
            origin: { x: 1 },
            colors: ['#d16bff', '#ff6ebd', '#e5b6ff']
        });
    }
    setInterval(fireConfetti, 2000);
  }

  function startCountdown(onComplete) {
    const birthday = new Date("September 25, 2025 00:22:00").getTime();
    let birthdayAudioPlayed = false;
    let birthdayAudio;
    const timerInterval = setInterval(() => {
        const now = new Date().getTime();
        const distance = birthday - now;

        // Play birthday.mp3 at last 10 seconds
        if (distance <= 11000 && !birthdayAudioPlayed) {
            birthdayAudioPlayed = true;
            birthdayAudio = new Audio("birthday.mp3");
            birthdayAudio.volume = 0.7;
            birthdayAudio.play();
            // Pause background music while birthday.mp3 is playing
            const bgMusic = document.getElementById("bgMusic");
            if (bgMusic) bgMusic.pause();
            birthdayAudio.addEventListener("ended", function() {
                // Resume background music after birthday.mp3 ends
                if (bgMusic) {
                  bgMusic.volume = 0.1;
                  bgMusic.play();
                }
            });
        }

        if (distance < 0) {
            clearInterval(timerInterval);
            onComplete();
            return;
        }
        document.getElementById("days").innerHTML = Math.floor(distance/(1e3*60*60*24)).toString().padStart(2,"0");
        document.getElementById("hours").innerHTML = Math.floor(distance%(1e3*60*60*24)/(1e3*60*60)).toString().padStart(2,"0");
        document.getElementById("minutes").innerHTML = Math.floor(distance%(1e3*60*60)/(1e3*60)).toString().padStart(2,"0");
        document.getElementById("seconds").innerHTML = Math.floor(distance%(1e3*60)/1e3).toString().padStart(2,"0");
    }, 1000);
  }

  function setupMusic() {
    const bgMusic = document.getElementById("bgMusic");
    const musicToggle = document.getElementById("musicToggle");
    if (!bgMusic || !musicToggle) return;
    
    bgMusic.volume = 0.1;
    let hasInteracted = false;
    const playMusic = () => {
        if(hasInteracted) bgMusic.play();
    };
    const pauseMusic = () => bgMusic.pause();

    musicToggle.addEventListener("click", () => {
        hasInteracted = true;
        bgMusic.paused ? playMusic() : pauseMusic();
    });
    // Store music controls globally to be accessed by other players
    window.bgMusicControls = { play: playMusic, pause: pauseMusic };
  }

  function setupTimelineScroll() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            entry.target.classList.toggle('active', entry.isIntersecting);
        });
    }, { threshold: 0.6 });
    document.querySelectorAll(".timeline-item").forEach(item => observer.observe(item));
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
    const letterTextContainer = popup.querySelector('.letter-text');

    // Split letter into spans for animation
    const paragraphs = letterTextContainer.querySelectorAll('p');
    paragraphs.forEach(p => {
        p.innerHTML = p.innerText.split('').map(char => `<span>${char}</span>`).join('');
    });
    const letterSpans = letterTextContainer.querySelectorAll('span');

    function openPopup() {
        envelope.classList.add('open');
        setTimeout(() => {
            popup.classList.remove('hidden');
            // Trigger scroll animation check when opened
            handleLetterScroll();
        }, 10); // Wait for envelope animation
    }

    function closePopup() {
        popup.classList.add('hidden');
        envelope.classList.remove('open'); // Optional: reset envelope
    }

    function handleLetterScroll() {
        const { scrollTop, scrollHeight, clientHeight } = letterTextContainer.parentElement;
        const scrollPercent = scrollTop / (scrollHeight - clientHeight) + 0.21; // Slight offset to trigger earlier
        const highlightedIndex = Math.floor(letterSpans.length * scrollPercent);
        
        letterSpans.forEach((span, i) => {
            span.classList.toggle('highlight', i <= highlightedIndex);
        });
    }
    envelope.addEventListener("click", openPopup);
    closeBtn.addEventListener("click", closePopup);
    popup.addEventListener("click", (e) => {
        if (e.target === popup) closePopup(); // Close if clicking on backdrop
    });
    // Add scroll listener to the popup content itself
    popup.querySelector('.popup-content').addEventListener('scroll', handleLetterScroll);
  }

  // --- START THE APP ---
  init();
});