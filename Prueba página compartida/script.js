function toggleMensaje() {
  const mensajeDiv = document.getElementById("mensaje");
  const mensajeTexto = document.getElementById("mensajeTexto");
  const btn = document.getElementById("btnMensaje");

  if (mensajeDiv.style.display === "block") {
    // Si el mensaje está visible, lo ocultamos y cambiamos el botón a "Mensaje"
    mensajeDiv.style.display = "none";
    btn.textContent = "Mensaje";
  } else {
    // Si el mensaje está oculto, lo mostramos y cambiamos el botón a "Cerrar"
    mensajeTexto.textContent = "¡Nos alegra tenerte aquí! 🌟 Esperamos que disfrutes el recorrido.";
    mensajeDiv.style.display = "block";
    btn.textContent = "Cerrar";
  }
}
    