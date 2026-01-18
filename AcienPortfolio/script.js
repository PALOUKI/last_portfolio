const canvas = document.getElementById("matrix-bg");
const ctx = canvas.getContext("2d");

let width, height, columns, drops;

const katakana = "ｱｲｳｴｵｶｷｸｹｺｻｼｽｾｿﾀﾁﾂﾃﾄﾅﾆﾇﾈﾉﾊﾋﾌﾍﾎﾏﾐﾑﾒﾓﾔﾕﾖﾗﾘﾙﾚﾛﾜﾝ";
const latin = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
const nums = "0123456789";
const characters = (katakana + latin + nums).split("");

function initMatrix() {
  width = canvas.width = window.innerWidth;
  height = canvas.height = window.innerHeight;
  columns = Math.floor(width / 14);
  drops = Array(columns).fill(1);
}

function drawMatrix() {
  ctx.fillStyle = "rgba(0, 0, 0, 0.07)";
  ctx.fillRect(0, 0, width, height);

  ctx.fillStyle = "rgba(72, 213, 255, 0.9)";
  ctx.font = "14px monospace";

  for (let i = 0; i < drops.length; i++) {
    const text = characters[Math.floor(Math.random() * characters.length)];
    ctx.fillText(text, i * 14, drops[i] * 14);

    if (drops[i] * 14 > height && Math.random() > 0.975) {
      drops[i] = 0;
    }
    drops[i]++;
  }
  requestAnimationFrame(drawMatrix);
}

initMatrix();
drawMatrix();
window.addEventListener("resize", initMatrix);

// Theme toggle
const toggle = document.getElementById("themeToggle");
const root = document.documentElement;
const icon = toggle.querySelector(".toggle-icon");

function updateTheme(isLight) {
  if (isLight) {
    root.classList.add("light");
    icon.textContent = "☀";
  } else {
    root.classList.remove("light");
    icon.textContent = "☾";
  }
}

const savedTheme = localStorage.getItem("preferred-theme");
updateTheme(savedTheme === "light");

toggle.addEventListener("click", () => {
  const isLight = !root.classList.contains("light");
  updateTheme(isLight);
  localStorage.setItem("preferred-theme", isLight ? "light" : "dark");
});

// Footer year
document.getElementById("year").textContent = new Date().getFullYear();

// Text scramble interactions
const glyphs = "!<>-_\\/[]{}—=+*^?#________";
const scrambleTargets = document.querySelectorAll("[data-scramble]");

function scramble(element) {
  let frame = 0;
  const original = element.dataset.original || element.textContent;
  element.dataset.original = original;

  const queue = original.split("").map((char, index) => {
    return {
      from: char,
      to: char,
      start: Math.floor(Math.random() * 20),
      end: Math.floor(Math.random() * 20) + 10 + index,
    };
  });

  cancelAnimationFrame(element.scrambleId);

  const update = () => {
    let output = "";
    let complete = 0;
    queue.forEach((item) => {
      if (frame >= item.end) {
        complete++;
        output += item.to;
      } else if (frame >= item.start) {
        output += `<span class="glitch">${glyphs[Math.floor(Math.random() * glyphs.length)]}</span>`;
      } else {
        output += item.from;
      }
    });
    element.innerHTML = output;

    if (complete === queue.length) {
      element.textContent = original;
      return;
    }
    frame++;
    element.scrambleId = requestAnimationFrame(update);
  };

  update();
}

scrambleTargets.forEach((target) => {
  target.addEventListener("mouseenter", () => scramble(target));
  target.addEventListener("focus", () => scramble(target));
});

// Tabs logic
const tabButtons = document.querySelectorAll(".tab-nav .tab");
const tabPanels = document.querySelectorAll(".tab-panel");

function activateTab(tabId) {
  tabButtons.forEach((btn) => {
    const isActive = btn.dataset.tab === tabId;
    btn.classList.toggle("active", isActive);
    btn.setAttribute("aria-selected", String(isActive));
  });

  tabPanels.forEach((panel) => {
    const isActive = panel.dataset.tabPanel === tabId;
    panel.classList.toggle("active", isActive);
    panel.hidden = !isActive;
  });

  handleTabActivation(tabId);
}

tabButtons.forEach((btn) => {
  btn.addEventListener("click", () => activateTab(btn.dataset.tab));
});

document.querySelectorAll("[data-open-tab]").forEach((trigger) => {
  trigger.addEventListener("click", () => {
    const target = trigger.getAttribute("data-open-tab");
    activateTab(target);
    document.querySelector(".command-center").scrollIntoView({ behavior: "smooth" });
  });
});

// set default tab state on load
activateTab("about");

// Projects slider
const projectsSlider = document.querySelector(".projects-slider");
let refreshProjectsSlider;

if (projectsSlider) {
  const viewport = projectsSlider.querySelector(".projects-viewport");
  const track = projectsSlider.querySelector(".projects-track");
  const cards = Array.from(track.children);
  const prevBtn = projectsSlider.querySelector('[data-slide="prev"]');
  const nextBtn = projectsSlider.querySelector('[data-slide="next"]');
  let perView = 2;
  let slideIndex = 0;
  let viewportWidth = 0;
  let maxIndex = 0;

  function getGap() {
    const gapValue = getComputedStyle(track).columnGap || getComputedStyle(track).gap || "0";
    return parseFloat(gapValue) || 0;
  }

  function updateDimensions() {
    const parentPanel = projectsSlider.closest(".tab-panel");
    if (parentPanel && parentPanel.hidden) {
      return;
    }
    perView = window.matchMedia("(max-width: 720px)").matches ? 1 : 2;
    viewportWidth = viewport.offsetWidth;
    const gap = getGap();
    const cardWidth = perView > 0 ? (viewportWidth - gap * (perView - 1)) / perView : viewportWidth;
    cards.forEach((card) => {
      card.style.minWidth = `${cardWidth}px`;
      card.style.flex = `0 0 ${cardWidth}px`;
    });
    maxIndex = Math.max(0, Math.ceil(cards.length / perView) - 1);
    goTo(slideIndex);
  }

  function goTo(targetIndex) {
    slideIndex = Math.max(0, Math.min(targetIndex, maxIndex));
    const offset = slideIndex * viewportWidth;
    track.style.transform = `translateX(-${offset}px)`;
    prevBtn.disabled = slideIndex === 0;
    nextBtn.disabled = slideIndex === maxIndex;
  }

  prevBtn.addEventListener("click", () => goTo(slideIndex - 1));
  nextBtn.addEventListener("click", () => goTo(slideIndex + 1));

  window.addEventListener("resize", () => {
    window.requestAnimationFrame(updateDimensions);
  });

  projectsSlider.classList.remove("no-js");
  refreshProjectsSlider = () => window.requestAnimationFrame(updateDimensions);
}

function handleTabActivation(tabId) {
  if (tabId === "projects" && typeof refreshProjectsSlider === "function") {
    refreshProjectsSlider();
  }
}

