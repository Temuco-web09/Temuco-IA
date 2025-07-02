const apiKey = "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";

function responder() {
  const input = document.getElementById("userInput").value.trim();
  if (!input) return;
  agregarMensaje(input, "user");

  // Desactiva input y botón
  document.getElementById("userInput").disabled = true;
  document.getElementById("enviarBtn").disabled = true;
  mostrarCargando();

fetch("https://https://replit.com/@yamilesquivescu/Nodejs.temuco.repl.co/temuco", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ mensaje: input })
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
  if (e.key === "Enter") responder();
});
