/* ===================================================================
   Carta para Dayana — lógica de la experiencia
   -------------------------------------------------------------------
   Todo el TEXTO vive en el objeto CONTENT de aquí abajo.
   Para cambiar cualquier mensaje, edita solo estos valores;
   el diseño y las animaciones no se ven afectados.
   =================================================================== */

const CONTENT = {

  // Mensajes que aparecen uno por uno, en orden, antes de la carta final.
  // "decor" es el pequeño emoji decorativo que acompaña ese mensaje.
  messages: [
    { text: "Dayana, tengo algo que decirte.", decor: "🎀" },
    { text: "Sé que esto no es lo que esperabas.", decor: "✨" },
    { text: "Pero es mi forma más personal de entregarte mi corazón.", decor: "💌" },
    { text: "Cada vez que hablamos, me gustas un poquito más.", decor: "🎀" },
    { text: "Tu forma de ser y tu gran seguridad en ti misma me enamoran.", decor: "⭐", burst: true },
    { text: "Ansío el día en el que ya pueda conocerte.", decor: "🎀" },
    { text: "Eres la chica más hermosa y especial que tengo.", decor: "💗" },
    { text: "Y por eso te entrego este último mensaje...", decor: "🎀" },
  ],

  // Texto del botón "Siguiente" en el último mensaje, antes de pasar al sobre.
  lastMessageButtonLabel: "Ver mi carta",

  // Párrafos del mensaje final. Se revelan uno a uno al tocar "seguir leyendo".
  // Envuelve la frase que quieras resaltar con <span class="loveline">...</span>.
  finalParagraphs: [
    "Cada vez que hablamos y me cuenta su día, me siento tan cómodo y orgulloso por la gran mujer en la que se está convirtiendo.",
    "Es una chica luchadora que puede lograr todo lo que se propone.",
    "Y aunque choquemos a veces en varias cosas, pues en el fondo no me importa, porque estoy seguro de que <span class=\"loveline\">estoy enamorado de usted</span>.",
    "Y si cambia, pues ya no sería la Dayana que tanto me gusta.",
    "Lamento no haber podido comprarle su casaca ni haberle podido entregar flores, pero tengo un enorme corazón y quiero que sea todo para usted.",
    "Esta es mi forma de decirle cuánto la quiero, y la verdad, ¿qué mejor forma que haciendo lo que mejor sé hacer?",
    "Espero que no se aleje ni se distancie, porque de verdad espero un futuro a su lado. Pero si eso pasa, quiero que sepa que aquí siempre habrá un chico dispuesto a entregarlo todo por usted, y que una de sus metas y motivaciones para salir adelante es poder darle todo lo que se merece.",
    "Dicho todo esto, finalizo diciéndole que la adoro un montón, señorita.",
  ],

  // Cierre especial, aparece automáticamente tras el último párrafo.
  finalFlourish: "MUCHOOOO. ❤️🎀",

  // Firma pequeña que aparece al final de todo.
  signature: "con todo mi cariño",
};

/* =================================================================
   Estado y referencias
   ================================================================= */

const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

let messageIndex = 0;
let finalParagraphIndex = 0;

const screens = {
  cover: document.querySelector('[data-screen="cover"]'),
  message: document.querySelector('[data-screen="message"]'),
  finalCover: document.querySelector('[data-screen="final-cover"]'),
  finalMessage: document.querySelector('[data-screen="final-message"]'),
};

const progressEl = document.getElementById("progress");
const messageText = document.getElementById("messageText");
const miniDecor = document.getElementById("miniDecor");
const nextBtn = document.getElementById("nextBtn");
const nextBtnLabel = document.getElementById("nextBtnLabel");
const startBtn = document.getElementById("startBtn");
const openBtn = document.getElementById("openBtn");
const envelope = document.getElementById("envelope");
const continueBtn = document.getElementById("continueBtn");
const finalMessageInner = document.getElementById("finalMessageInner");
const signatureEl = document.getElementById("signature");
const floatingLayer = document.getElementById("floatingLayer");

/* =================================================================
   Transición entre pantallas
   ================================================================= */

function goToScreen(target){
  const current = document.querySelector(".screen.active");
  if (current === target) return;

  if (current){
    current.classList.add("leaving");
    current.classList.remove("active");
    setTimeout(() => current.classList.remove("leaving"), 300);
  }

  requestAnimationFrame(() => {
    target.classList.add("active");
  });
}

/* =================================================================
   Progreso (puntitos discretos arriba)
   ================================================================= */

function buildProgressDots(){
  progressEl.innerHTML = "";
  CONTENT.messages.forEach(() => {
    const dot = document.createElement("span");
    dot.className = "dot";
    progressEl.appendChild(dot);
  });
}

function updateProgressDots(){
  const dots = progressEl.querySelectorAll(".dot");
  dots.forEach((dot, i) => {
    dot.classList.toggle("done", i < messageIndex);
    dot.classList.toggle("current", i === messageIndex);
  });
}

/* =================================================================
   Efectos decorativos: corazones flotantes + destellos
   ================================================================= */

function spawnFloaty(){
  if (reduceMotion) return;
  const el = document.createElement("span");
  const symbols = ["♡", "❀", "✦"];
  el.className = "floaty";
  el.textContent = symbols[Math.floor(Math.random() * symbols.length)];
  const size = 14 + Math.random() * 16;
  el.style.left = `${5 + Math.random() * 90}%`;
  el.style.fontSize = `${size}px`;
  el.style.setProperty("--drift", `${(Math.random() * 60 - 30).toFixed(0)}px`);
  el.style.setProperty("--spin", `${(Math.random() * 40 - 20).toFixed(0)}deg`);
  el.style.animationDuration = `${9 + Math.random() * 6}s`;
  floatingLayer.appendChild(el);
  el.addEventListener("animationend", () => el.remove());
}

function ambientFloaties(){
  if (reduceMotion) return;
  spawnFloaty();
  setTimeout(ambientFloaties, 2600 + Math.random() * 1800);
}

function burstAt(x, y, count = 10){
  if (reduceMotion) return;
  const symbols = ["✦", "♡", "✧", "❀"];
  for (let i = 0; i < count; i++){
    const el = document.createElement("span");
    el.className = "spark";
    el.textContent = symbols[Math.floor(Math.random() * symbols.length)];
    const angle = (Math.PI * 2 * i) / count + Math.random() * 0.5;
    const dist = 40 + Math.random() * 70;
    el.style.left = `${x}px`;
    el.style.top = `${y}px`;
    el.style.fontSize = `${12 + Math.random() * 10}px`;
    el.style.color = i % 2 === 0 ? "var(--pink-400)" : "var(--red-500)";
    el.style.setProperty("--tx", `${Math.cos(angle) * dist}px`);
    el.style.setProperty("--ty", `${Math.sin(angle) * dist}px`);
    el.style.setProperty("--rot", `${(Math.random() * 200 - 100).toFixed(0)}deg`);
    document.body.appendChild(el);
    el.addEventListener("animationend", () => el.remove());
  }
}

function burstFromElement(el, count = 10){
  const rect = el.getBoundingClientRect();
  burstAt(rect.left + rect.width / 2, rect.top + rect.height / 2, count);
}

/* =================================================================
   Pantalla de mensajes
   ================================================================= */

function renderMessage(index, { animate = true } = {}){
  const data = CONTENT.messages[index];

  const applySwap = () => {
    messageText.textContent = data.text;
    miniDecor.textContent = data.decor || "🎀";
    nextBtnLabel.textContent =
      index === CONTENT.messages.length - 1
        ? CONTENT.lastMessageButtonLabel
        : "Siguiente";

    messageText.classList.remove("swap-out", "swap-in", "shine");
    if (animate){
      messageText.classList.add("swap-in");
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          messageText.classList.remove("swap-in");
          messageText.classList.add("shine");
        });
      });
    }
  };

  if (animate){
    messageText.classList.add("swap-out");
    setTimeout(applySwap, reduceMotion ? 0 : 220);
  } else {
    applySwap();
  }

  updateProgressDots();

  if (data.burst){
    setTimeout(() => burstFromElement(messageText, 12), animate ? 260 : 0);
  }
}

function advanceMessage(){
  burstFromElement(nextBtn, 8);

  if (messageIndex < CONTENT.messages.length - 1){
    messageIndex += 1;
    renderMessage(messageIndex);
  } else {
    progressEl.classList.remove("visible");
    goToScreen(screens.finalCover);
  }
}

/* =================================================================
   Sobre final
   ================================================================= */

function openEnvelope(){
  envelope.classList.add("open");
  burstFromElement(envelope, 16);
  setTimeout(() => {
    goToScreen(screens.finalMessage);
    startFinalMessage();
  }, 680);
}

/* =================================================================
   Mensaje final
   ================================================================= */

function buildFinalParagraphs(){
  // Los párrafos se insertan uno a uno (ver revealNextParagraph), no de golpe,
  // para que la carta no muestre espacio vacío mientras se va leyendo.
  finalMessageInner.innerHTML = "";
  signatureEl.textContent = CONTENT.signature;
}

function startFinalMessage(){
  finalParagraphIndex = 0;
  buildFinalParagraphs();
  continueBtn.classList.remove("hidden");
  signatureEl.classList.remove("shown");
  revealNextParagraph();
}

function revealNextParagraph(){
  if (finalParagraphIndex >= CONTENT.finalParagraphs.length) return;

  const p = document.createElement("p");
  p.className = "final-p";
  p.innerHTML = CONTENT.finalParagraphs[finalParagraphIndex];
  finalMessageInner.appendChild(p);

  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      p.classList.add("shown");
    });
  });

  const loveSpan = p.querySelector(".loveline");
  if (loveSpan){
    setTimeout(() => {
      loveSpan.classList.add("pulse");
      burstFromElement(p, 10);
      setTimeout(() => loveSpan.classList.remove("pulse"), 1200);
    }, 400);
  }

  setTimeout(() => {
    p.scrollIntoView({ block: "end", behavior: reduceMotion ? "auto" : "smooth" });
  }, 80);

  finalParagraphIndex += 1;

  if (finalParagraphIndex === CONTENT.finalParagraphs.length){
    continueBtn.classList.add("hidden");
    setTimeout(revealFlourish, 900);
  }
}

function revealFlourish(){
  const flourish = document.createElement("div");
  flourish.className = "final-flourish";
  flourish.innerHTML = `<span class="lead"></span><span class="muchooo">${CONTENT.finalFlourish}</span>`;
  finalMessageInner.appendChild(flourish);

  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      flourish.classList.add("shown");
      burstFromElement(flourish, 18);
    });
  });

  setTimeout(() => {
    flourish.scrollIntoView({ block: "end", behavior: reduceMotion ? "auto" : "smooth" });
  }, 80);

  setTimeout(() => signatureEl.classList.add("shown"), 900);
}

/* =================================================================
   Eventos
   ================================================================= */

startBtn.addEventListener("click", () => {
  burstFromElement(startBtn, 10);
  buildProgressDots();
  renderMessage(0, { animate: false });
  progressEl.classList.add("visible");
  goToScreen(screens.message);
});

nextBtn.addEventListener("click", advanceMessage);
openBtn.addEventListener("click", openEnvelope);
continueBtn.addEventListener("click", revealNextParagraph);

/* Permitir avanzar también tocando la tarjeta del mensaje (no los botones) */
screens.message.addEventListener("click", (e) => {
  if (e.target.closest(".btn-next")) return;
  advanceMessage();
});

/* =================================================================
   Arranque
   ================================================================= */

ambientFloaties();
