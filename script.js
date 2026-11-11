const menuButton = document.querySelector(".menu-toggle");
const navigation = document.querySelector(".primary-navigation");

menuButton.addEventListener("click", () => {
  const isOpen = menuButton.getAttribute("aria-expanded") === "true";
  menuButton.setAttribute("aria-expanded", String(!isOpen));
  menuButton.setAttribute("aria-label", isOpen ? "Open navigation" : "Close navigation");
  navigation.classList.toggle("is-open", !isOpen);
});

navigation.addEventListener("click", (event) => {
  if (event.target.closest("a")) {
    menuButton.setAttribute("aria-expanded", "false");
    menuButton.setAttribute("aria-label", "Open navigation");
    navigation.classList.remove("is-open");
  }
});

const servicesViewport = document.querySelector(".services-viewport");
const servicesTrack = document.querySelector(".services-grid");
const previousServiceButton = document.querySelector(".services-control--previous");
const nextServiceButton = document.querySelector(".services-control--next");

if (servicesViewport && servicesTrack && previousServiceButton && nextServiceButton) {
  function updateServiceControls() {
    const maxScroll = servicesViewport.scrollWidth - servicesViewport.clientWidth;
    previousServiceButton.disabled = servicesViewport.scrollLeft <= 1;
    nextServiceButton.disabled = servicesViewport.scrollLeft >= maxScroll - 1;
  }

  function moveServices(direction) {
    const card = servicesTrack.querySelector(".service-card");
    if (!card) return;

    const gap = Number.parseFloat(getComputedStyle(servicesTrack).columnGap) || 0;
    servicesViewport.scrollBy({ left: direction * (card.getBoundingClientRect().width + gap), behavior: "smooth" });
  }

  previousServiceButton.addEventListener("click", () => moveServices(-1));
  nextServiceButton.addEventListener("click", () => moveServices(1));
  servicesViewport.addEventListener("scroll", updateServiceControls, { passive: true });
  window.addEventListener("resize", updateServiceControls);
  window.addEventListener("load", updateServiceControls, { once: true });
  updateServiceControls();
}

const featureVideoCard = document.querySelector(".feature-card--video");
const featureVideo = featureVideoCard?.querySelector(".feature-video");
let featureVideoPinned = false;

function playFeatureVideo() {
  featureVideo.play().catch(() => {});
}

function toggleFeatureVideo() {
  if (featureVideo.paused) {
    featureVideoPinned = true;
    playFeatureVideo();
    featureVideoCard.setAttribute("aria-pressed", "true");
    return;
  }

  if (featureVideoPinned) {
    featureVideo.pause();
    featureVideoPinned = false;
    featureVideoCard.setAttribute("aria-pressed", "false");
  } else {
    featureVideoPinned = true;
    featureVideoCard.setAttribute("aria-pressed", "true");
  }
}

if (featureVideoCard && featureVideo) {
  featureVideo.addEventListener("play", () => featureVideoCard.setAttribute("aria-pressed", "true"));
  featureVideo.addEventListener("pause", () => featureVideoCard.setAttribute("aria-pressed", "false"));
  featureVideoCard.addEventListener("pointerenter", (event) => {
    if (event.pointerType === "mouse" && !featureVideoPinned) playFeatureVideo();
  });
  featureVideoCard.addEventListener("pointerleave", (event) => {
    if (event.pointerType === "mouse" && !featureVideoPinned) {
      featureVideo.pause();
      featureVideo.currentTime = 0;
    }
  });
  featureVideoCard.addEventListener("click", toggleFeatureVideo);
  featureVideoCard.addEventListener("keydown", (event) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      toggleFeatureVideo();
    }
  });
}


(() => {
  const howSteps = document.querySelector(".sj-how-steps");
  const howSection = document.querySelector(".sj-how-section");
  if (!howSteps || !howSection) return;

  if (!("IntersectionObserver" in window)) {
    howSection.classList.remove("sj-how-offscreen");
    return;
  }

  new IntersectionObserver(([entry]) => {
    howSection.classList.toggle("sj-how-offscreen", !entry.isIntersecting);
  }).observe(howSteps);
})();


// Diagonal aircraft parallax on scroll and pointer movement.
(() => {
  const section = document.querySelector('.ra-takeoff');
  const jet = section?.querySelector('.ra-takeoff-jet');
  if (!jet || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  let frame = 0;
  let pointerX = 0;
  let pointerY = 0;
  const update = () => {
    frame = 0;
    const rect = section.getBoundingClientRect();
    const progress = Math.max(0, Math.min(1, -rect.top / Math.max(rect.height, 1)));
    const distance = Math.min(window.innerWidth * .16, 160);
    jet.style.setProperty('--jet-x', `${progress * distance + pointerX * 20}px`);
    jet.style.setProperty('--jet-y', `${-progress * distance * .65 + pointerY * 14}px`);
    jet.style.setProperty('--jet-rotation', `${progress * -4 + pointerX * 2}deg`);
  };
  const schedule = () => { if (!frame) frame = requestAnimationFrame(update); };
  section.addEventListener('pointermove', (event) => {
    if (event.pointerType !== 'mouse') return;
    const rect = section.getBoundingClientRect();
    pointerX = (event.clientX - rect.left) / rect.width - .5;
    pointerY = (event.clientY - rect.top) / rect.height - .5;
    schedule();
  });
  section.addEventListener('pointerleave', () => { pointerX = 0; pointerY = 0; schedule(); });
  window.addEventListener('scroll', schedule, { passive: true });
  window.addEventListener('resize', schedule);
  update();
})();

