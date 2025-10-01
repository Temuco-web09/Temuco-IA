// ---------- CHAT ----------
const enviarBtn = document.getElementById("enviarBtn");
const userInput = document.getElementById("userInput");
const chat = document.getElementById("chat");

// --- Formato de mensajes (negrita con **texto**) ---
  function formatMessage(text) {
    if (!text && text !== "") return "";

    // Escapa HTML para evitar XSS
    const escapeHtml = s => s
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#39;");

    let raw = escapeHtml(String(text)).replace(/\r/g, "");
    const content = raw.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>");
    return content;
  }

  // Función para agregar mensajes al chat
  function addMessage(sender, text) {
    const msg = document.createElement("div");
    msg.classList.add("message", sender);
    msg.innerHTML = formatMessage(text); // 👈 usamos la versión simple
    chat.appendChild(msg);

    setTimeout(() => {
      chat.scrollTop = chat.scrollHeight;
    }, 300);
  }

async function sendMessage() {
  const message = userInput.value.trim(); 
  if (!message) return;

  addMessage("user", message);
  userInput.value = "";

  try {
    const res = await fetch("https://temuco-backend-6o9v.onrender.com", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message })
    });

    const data = await res.json();
    addMessage("bot", data.reply || "Lo siento, no entendí eso.");
  } catch (error) {
    addMessage("bot", "⚠️ Error conectando con Temuco IA.");
  }
}

function formatText(text) {
  // Negrita con **texto**
  let formatted = text.replace(/\*\*(.*?)\*\*/g, "<b>$1</b>");

  // Listas enumeradas tipo "1. texto"
  formatted = formatted.replace(/(\d+)\.\s*(.*?)(?=(\d+\.)|$)/gs, "<li>$2</li>");

  // Si encontró items, los envuelve en <ol>
  if (formatted.includes("<li>")) {
    formatted = "<ol>" + formatted + "</ol>";
  }

  return formatted;
}

function addMessage(sender, text) {
  const msg = document.createElement("div");
  msg.classList.add("message", sender);
  msg.innerHTML = formatMessage(text); // 👈 aquí aplicamos el formato
  chat.appendChild(msg);

  setTimeout(() => {
    chat.scrollTop = chat.scrollHeight;
  }, 300);
}


enviarBtn.addEventListener("click", sendMessage);
userInput.addEventListener("keypress", e => {
  if (e.key === "Enter") sendMessage();
});

// ---------- MODAL MINIJUEGOS ----------
const minijuegosBtn = document.getElementById("minijuegosBtn");
const modal = document.getElementById("minijuegosModal");
const cerrarX = document.getElementById("cerrarX");
const gameContainer = document.getElementById("gameContainer");

minijuegosBtn.onclick = () => modal.style.display = "flex";
cerrarX.onclick = () => {
  modal.style.display = "none";
  gameContainer.innerHTML = "";
};

// ---------- JUEGO 1: QUIZ ----------
document.getElementById("juego1").addEventListener("click", () => {
  gameContainer.innerHTML = `
    <h3>Quiz Rápido</h3>
    <p>¿Cuál es la capital de Perú?</p>
    <button onclick="alert('¡Correcto!')">Lima</button>
    <button onclick="alert('Incorrecto')">Cusco</button>
    <button onclick="alert('Incorrecto')">Arequipa</button>
  `;
});

// ---------- JUEGO 2: CLASIFICAR ALIMENTOS ----------
document.getElementById("juego2").addEventListener("click", () => {
  gameContainer.innerHTML = `
    <h3>Clasificar Alimentos</h3>
    <div>
      <div class="foodItem" draggable="true">🍎 Manzana</div>
      <div class="foodItem" draggable="true">🍔 Hamburguesa</div>
      <div class="foodItem" draggable="true">🥦 Brócoli</div>
    </div>
    <div style="display:flex; justify-content:space-around; margin-top:15px;">
      <div class="dropZone" id="saludable">Saludable</div>
      <div class="dropZone" id="nocivo">No Saludable</div>
    </div>
  `;

  document.querySelectorAll(".foodItem").forEach(item => {
    item.addEventListener("dragstart", e => {
      e.dataTransfer.setData("text", e.target.textContent);
    });
  });

  document.querySelectorAll(".dropZone").forEach(zone => {
    zone.addEventListener("dragover", e => e.preventDefault());
    zone.addEventListener("drop", e => {
      e.preventDefault();
      const data = e.dataTransfer.getData("text");
      e.target.innerHTML += `<div>${data}</div>`;
    });
  });
});

// ---------- JUEGO 3: MEMORIA ----------
document.getElementById("juego3").addEventListener("click", () => {
  const emojis = ["🍎","🍌","🍇","🍒","🍎","🍌","🍇","🍒"];
  let grid = `<div class="memoryGrid">`;
  emojis.sort(() => 0.5 - Math.random()).forEach(e => {
    grid += `<div class="memoryCard" data-value="${e}">${e}</div>`;
  });
  grid += `</div>`;
  gameContainer.innerHTML = `<h3>Juego de Memoria</h3>${grid}`;

  let first = null, second = null;
  document.querySelectorAll(".memoryCard").forEach(card => {
    card.addEventListener("click", () => {
      if (card.classList.contains("flipped")) return;
      card.classList.add("flipped");
      if (!first) {
        first = card;
      } else {
        second = card;
        if (first.dataset.value === second.dataset.value) {
          first = second = null;
        } else {
          setTimeout(() => {
            first.classList.remove("flipped");
            second.classList.remove("flipped");
            first = second = null;
          }, 800);
        }
      }
    });
  });
});
