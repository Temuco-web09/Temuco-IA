function responder() {
  const input = document.getElementById("userInput").value.trim();
  if (!input) return;
  agregarMensaje(input, "user");

  // Desactiva input y botón
  document.getElementById("userInput").disabled = true;
  document.getElementById("enviarBtn").disabled = true;
  mostrarCargando();

  // Petición al backend Temuco
  fetch("https://temuco-backend.yomix.repl.co/api/chat", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      message: input
    })
  })
    .then(res => {
      if (!res.ok) throw new Error(`Error ${res.status}`);
      return res.json();
    })
    .then(data => {
      ocultarCargando();
      const respuesta = data.choices[0]?.message?.content || "Lo siento, no entendí eso.";
      agregarMensaje(respuesta, "bot");
    })
    .catch(err => {
      console.error(err);
      ocultarCargando();
      agregarMensaje("Error conectando con Temuco 😢", "bot");
    })
    .finally(() => {
      document.getElementById("userInput").value = "";
      document.getElementById("userInput").disabled = false;
      document.getElementById("enviarBtn").disabled = false;
      document.getElementById("userInput").focus();
    });
}

function agregarMensaje(texto, tipo) {
  const chat = document.getElementById("chat");
  const mensaje = document.createElement("div");
  mensaje.className = "message " + tipo;
  mensaje.innerText = texto;
  chat.appendChild(mensaje);
  chat.scrollTop = chat.scrollHeight;
}

function mostrarCargando() {
  const chat = document.getElementById("chat");
  const cargando = document.createElement("div");
  cargando.id = "cargando";
  cargando.className = "message bot";
  cargando.innerHTML = `<span class="dot"></span><span class="dot"></span><span class="dot"></span>`;
  chat.appendChild(cargando);
  chat.scrollTop = chat.scrollHeight;
}

function ocultarCargando() {
  const cargando = document.getElementById("cargando");
  if (cargando) cargando.remove();
}

document.getElementById("userInput").addEventListener("keydown", e => {
  if (e.key === "Enter") responder());
