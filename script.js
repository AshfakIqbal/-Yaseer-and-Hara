(() => {
  "use strict";

  /* ========================================================
     CONFIG & EVENT DATA
     ======================================================== */
  const WEDDING_DATE = new Date("2026-12-19T12:30:00+05:30").getTime();
  const COUPLE_NAME = "Muhammed Yaseer & Fathima Hara";
  const EVENT_TITLE = "Muhammed Yaseer & Fathima Hara — Wedding Ceremony";
  const EVENT_LOCATION = "Meera Maccam Masjid Hall, 2 Wariyapola Sri Sumangala Mawatha, Kandy, Sri Lanka";
  const EVENT_DESC = "Wedding Ceremony of Muhammed Yaseer (Son of Hassan Nisthar) and Fathima Hara (Daughter of Muhammad Faizer) at Meera Maccam Masjid Hall, Kandy.";

  /* ========================================================
     DOM ELEMENTS
     ======================================================== */
  const daysEl = document.getElementById("daysVal");
  const hoursEl = document.getElementById("hoursVal");
  const minutesEl = document.getElementById("minutesVal");
  const secondsEl = document.getElementById("secondsVal");
  const statusMsgEl = document.getElementById("statusMessage");

  const royalOpener = document.getElementById("royalOpener");
  const unveilButton = document.getElementById("unveilButton");
  const bgMusic = document.getElementById("bgMusic");
  const musicToggleBtn = document.getElementById("musicToggleBtn");
  const musicBtnText = document.getElementById("musicBtnText");

  const openLightboxBtn = document.getElementById("openLightboxBtn");
  const closeLightboxBtn = document.getElementById("closeLightboxBtn");
  const lightboxModal = document.getElementById("lightboxModal");
  const lightboxBackdrop = document.getElementById("lightboxBackdrop");
  const card3dTarget = document.getElementById("card3dTarget");
  const card3dContainer = document.getElementById("card3dContainer");

  const addToCalBtn = document.getElementById("addToCalBtn");
  const shareInviteBtn = document.getElementById("shareInviteBtn");

  /* ========================================================
     LIVE COUNTDOWN TIMER
     ======================================================== */
  function padZero(num, len = 2) {
    return String(num).padStart(len, "0");
  }

  function updateCountdown() {
    const now = Date.now();
    const diff = WEDDING_DATE - now;

    if (diff <= 0) {
      if (daysEl) daysEl.textContent = "000";
      if (hoursEl) hoursEl.textContent = "00";
      if (minutesEl) minutesEl.textContent = "00";
      if (secondsEl) secondsEl.textContent = "00";
      if (statusMsgEl) statusMsgEl.textContent = "Today is our blessed wedding day! Welcome to our celebration.";
      return;
    }

    const totalSecs = Math.floor(diff / 1000);
    const days = Math.floor(totalSecs / 86400);
    const hours = Math.floor((totalSecs % 86400) / 3600);
    const minutes = Math.floor((totalSecs % 3600) / 60);
    const seconds = totalSecs % 60;

    if (daysEl) daysEl.textContent = padZero(days, 3);
    if (hoursEl) hoursEl.textContent = padZero(hours);
    if (minutesEl) minutesEl.textContent = padZero(minutes);
    if (secondsEl) secondsEl.textContent = padZero(seconds);
  }

  updateCountdown();
  setInterval(updateCountdown, 1000);

  /* ========================================================
     AUDIO PLAYBACK CONTROLLER
     ======================================================== */
  bgMusic.volume = 0.35;
  let isAudioPlaying = false;

  function updateAudioUi(playing) {
    isAudioPlaying = playing;
    if (musicToggleBtn) {
      musicToggleBtn.classList.toggle("is-playing", playing);
      musicToggleBtn.classList.toggle("is-muted", !playing);
      musicToggleBtn.setAttribute("aria-pressed", String(playing));
    }
    if (musicBtnText) {
      musicBtnText.textContent = playing ? "Music On" : "Music Off";
    }
  }

  async function playMusic() {
    try {
      await bgMusic.play();
      updateAudioUi(true);
    } catch (err) {
      console.warn("Audio autoplay blocked or waiting for interaction:", err);
      updateAudioUi(false);
    }
  }

  function toggleMusic() {
    if (bgMusic.paused) {
      bgMusic.play().then(() => updateAudioUi(true)).catch(() => updateAudioUi(false));
    } else {
      bgMusic.pause();
      updateAudioUi(false);
    }
  }

  if (musicToggleBtn) {
    musicToggleBtn.addEventListener("click", toggleMusic);
  }

  /* ========================================================
     ROYAL FOLIO OPENER INTERACTION
     ======================================================== */
  function unveilInvitation() {
    if (!royalOpener) return;

    // Trigger visual opening sequence
    royalOpener.classList.add("is-opening");

    // Spawn petal burst
    createOpenerBurst();

    // Start background music
    playMusic();

    // After animation, release lock
    setTimeout(() => {
      royalOpener.classList.add("is-dismissed");
      document.body.classList.remove("invitation-locked");

      // Trigger scroll reveals
      initScrollReveals();
    }, 1100);
  }

  if (unveilButton) {
    unveilButton.addEventListener("click", unveilInvitation);
  }

  /* ========================================================
     PARTICLE CANVAS (BURGUNDY & BLUSH PETALS + GOLD DUST)
     ======================================================== */
  const canvas = document.getElementById("particlesCanvas");
  let ctx = null;
  let particles = [];
  let animId = null;

  if (canvas && canvas.getContext) {
    ctx = canvas.getContext("2d");

    function resizeCanvas() {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    }
    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    class Particle {
      constructor(isBurst = false, burstX = 0, burstY = 0) {
        this.reset(isBurst, burstX, burstY);
      }

      reset(isBurst = false, burstX = 0, burstY = 0) {
        const isPetal = Math.random() > 0.35;
        this.type = isPetal ? "petal" : "gold";

        if (isBurst) {
          this.x = burstX;
          this.y = burstY;
          const angle = Math.random() * Math.PI * 2;
          const speed = 2 + Math.random() * 8;
          this.vx = Math.cos(angle) * speed;
          this.vy = Math.sin(angle) * speed;
        } else {
          this.x = Math.random() * canvas.width;
          this.y = -20 - Math.random() * 50;
          this.vx = (Math.random() - 0.5) * 1.2;
          this.vy = this.type === "petal" ? 0.8 + Math.random() * 1.5 : 0.4 + Math.random() * 0.8;
        }

        this.size = this.type === "petal" ? 8 + Math.random() * 12 : 2 + Math.random() * 3.5;
        this.opacity = this.type === "petal" ? 0.4 + Math.random() * 0.5 : 0.3 + Math.random() * 0.6;
        this.angle = Math.random() * 360;
        this.angularSpeed = (Math.random() - 0.5) * 2;
        this.flip = Math.random() * Math.PI;
        this.flipSpeed = 0.02 + Math.random() * 0.04;

        // Color palettes
        if (this.type === "petal") {
          const colors = [
            "#7a1528", // Royal burgundy
            "#590f1d", // Deep wine
            "#c44d62", // Rose blush
            "#e58a98", // Soft petal
            "#fcedf0"  // Ivory pink
          ];
          this.color = colors[Math.floor(Math.random() * colors.length)];
        } else {
          this.color = "#d4af37"; // Champagne Gold
        }
      }

      update() {
        this.x += this.vx;
        this.y += this.vy;
        this.angle += this.angularSpeed;
        this.flip += this.flipSpeed;

        // Gentle wind sway
        this.x += Math.sin(this.y * 0.005) * 0.5;

        // Respawn when off screen
        if (this.y > canvas.height + 30 || this.x < -30 || this.x > canvas.width + 30) {
          this.reset(false);
        }
      }

      draw() {
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate((this.angle * Math.PI) / 180);
        ctx.globalAlpha = this.opacity;

        if (this.type === "petal") {
          const scaleY = Math.cos(this.flip);
          ctx.scale(1, scaleY);
          ctx.fillStyle = this.color;
          ctx.beginPath();
          // Organic curved petal shape
          ctx.moveTo(0, -this.size);
          ctx.bezierCurveTo(this.size * 0.8, -this.size * 0.6, this.size * 0.9, this.size * 0.6, 0, this.size);
          ctx.bezierCurveTo(-this.size * 0.9, this.size * 0.6, -this.size * 0.8, -this.size * 0.6, 0, -this.size);
          ctx.fill();
        } else {
          // Glistening gold particle
          ctx.fillStyle = this.color;
          ctx.shadowBlur = 6;
          ctx.shadowColor = "#d4af37";
          ctx.beginPath();
          ctx.arc(0, 0, this.size / 2, 0, Math.PI * 2);
          ctx.fill();
        }

        ctx.restore();
      }
    }

    // Initialize regular falling particles
    const particleCount = window.innerWidth < 600 ? 25 : 45;
    for (let i = 0; i < particleCount; i++) {
      const p = new Particle();
      p.y = Math.random() * canvas.height; // Distribute across screen initially
      particles.push(p);
    }

    function renderParticles() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      for (let i = 0; i < particles.length; i++) {
        particles[i].update();
        particles[i].draw();
      }
      animId = requestAnimationFrame(renderParticles);
    }
    renderParticles();

    // Burst of particles on opening
    window.createOpenerBurst = function() {
      const burstX = canvas.width / 2;
      const burstY = canvas.height / 2;
      for (let i = 0; i < 40; i++) {
        particles.push(new Particle(true, burstX, burstY));
      }
    };
  }

  /* ========================================================
     3D TILT EFFECT ON CARD (DESKTOP)
     ======================================================== */
  if (card3dContainer && card3dTarget && window.matchMedia("(hover: hover)").matches) {
    card3dContainer.addEventListener("mousemove", (e) => {
      const rect = card3dContainer.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;

      const rotX = -(y / rect.height) * 14;
      const rotY = (x / rect.width) * 14;

      card3dTarget.style.transform = `perspective(1000px) rotateX(${rotX}deg) rotateY(${rotY}deg) scale3d(1.02, 1.02, 1.02)`;
    });

    card3dContainer.addEventListener("mouseleave", () => {
      card3dTarget.style.transform = "perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)";
    });
  }

  /* ========================================================
     LIGHTBOX FULLSCREEN MODAL
     ======================================================== */
  function openLightbox() {
    if (lightboxModal) {
      lightboxModal.classList.add("is-active");
      document.body.style.overflow = "hidden";
    }
  }

  function closeLightbox() {
    if (lightboxModal) {
      lightboxModal.classList.remove("is-active");
      document.body.style.overflow = "";
    }
  }

  if (openLightboxBtn) openLightboxBtn.addEventListener("click", openLightbox);
  if (card3dTarget) card3dTarget.addEventListener("click", openLightbox);
  if (closeLightboxBtn) closeLightboxBtn.addEventListener("click", closeLightbox);
  if (lightboxBackdrop) lightboxBackdrop.addEventListener("click", closeLightbox);

  window.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && lightboxModal && lightboxModal.classList.contains("is-active")) {
      closeLightbox();
    }
  });

  /* ========================================================
     ADD TO CALENDAR (.ICS FILE DOWNLOAD)
     ======================================================== */
  if (addToCalBtn) {
    addToCalBtn.addEventListener("click", () => {
      const icsLines = [
        "BEGIN:VCALENDAR",
        "VERSION:2.0",
        "PRODID:-//Inkspire Prints//Wedding Invitation//EN",
        "CALSCALE:GREGORIAN",
        "METHOD:PUBLISH",
        "BEGIN:VEVENT",
        "UID:muhammed-yaseer-fathima-hara-wedding-20261219@inkspireprints.lk",
        "DTSTAMP:20261115T000000Z",
        "DTSTART;TZID=Asia/Colombo:20261219T123000",
        "DTEND;TZID=Asia/Colombo:20261219T163000",
        `SUMMARY:${EVENT_TITLE}`,
        `LOCATION:${EVENT_LOCATION}`,
        `DESCRIPTION:${EVENT_DESC}`,
        "STATUS:CONFIRMED",
        "END:VEVENT",
        "END:VCALENDAR"
      ].join("\r\n");

      const blob = new Blob([icsLines], { type: "text/calendar;charset=utf-8" });
      const url = URL.createObjectURL(blob);
      const downloadLink = document.createElement("a");
      downloadLink.href = url;
      downloadLink.download = "Muhammed-Yaseer-and-Fathima-Hara-Wedding.ics";
      document.body.appendChild(downloadLink);
      downloadLink.click();
      downloadLink.remove();
      URL.revokeObjectURL(url);
    });
  }

  /* ========================================================
     SHARE INVITATION
     ======================================================== */
  if (shareInviteBtn) {
    shareInviteBtn.addEventListener("click", async () => {
      const shareData = {
        title: `${COUPLE_NAME} — Wedding Invitation`,
        text: `You are warmly invited to the wedding celebration of ${COUPLE_NAME} on Saturday, 19th December 2026 at Meera Maccam Masjid Hall, Kandy.`,
        url: window.location.href
      };

      if (navigator.share) {
        try {
          await navigator.share(shareData);
        } catch (err) {
          console.log("Share dismissed:", err);
        }
      } else {
        // Fallback: Copy link or WhatsApp share
        if (navigator.clipboard) {
          navigator.clipboard.writeText(window.location.href);
          alert("Invitation link copied to clipboard!");
        } else {
          window.open(`https://wa.me/?text=${encodeURIComponent(shareData.text + " " + shareData.url)}`, "_blank");
        }
      }
    });
  }

  /* ========================================================
     INTERSECTION OBSERVER FOR SCROLL REVEALS
     ======================================================== */
  function initScrollReveals() {
    const reveals = document.querySelectorAll(".reveal");
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
          }
        });
      },
      {
        threshold: 0.12,
        rootMargin: "0px 0px -40px 0px"
      }
    );

    reveals.forEach((el) => observer.observe(el));
  }

  // If page loads already unlocked (e.g. refresh or direct)
  if (!document.body.classList.contains("invitation-locked")) {
    initScrollReveals();
  }
})();
