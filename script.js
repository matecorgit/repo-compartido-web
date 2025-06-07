function mostrarMensaje() {
  const mensaje = document.getElementById("mensaje");
  mensaje.textContent = "¡Hola desde un proyecto colaborativo en GitHub! 🎉";
}

function enviarFormulario(event) {
  event.preventDefault();
  alert("¡Mensaje enviado correctamente!");
}