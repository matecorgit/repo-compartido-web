// Datos simulados con destinos, transporte y alojamientos
const destinos = {
  // Europa
  'París, Francia': {
    transporte: ['avion', 'tren', 'micro'],
    alojamientos: {
      economico: 80,
      medio: 150,
      lujo: 300
    }
  },
  'Barcelona, España': {
    transporte: ['avion', 'tren', 'micro'],
    alojamientos: {
      economico: 70,
      medio: 130,
      lujo: 280
    }
  },
  'Roma, Italia': {
    transporte: ['avion', 'tren', 'micro'],
    alojamientos: {
      economico: 75,
      medio: 140,
      lujo: 290
    }
  },
  'Londres, Reino Unido': {
    transporte: ['avion', 'tren', 'micro'],
    alojamientos: {
      economico: 90,
      medio: 160,
      lujo: 320
    }
  },
  'Atenas, Grecia': {
    transporte: ['avion', 'tren', 'micro'],
    alojamientos: {
      economico: 65,
      medio: 120,
      lujo: 260
    }
  },

  // América
  'Nueva York, EE.UU.': {
    transporte: ['avion', 'micro'],
    alojamientos: {
      economico: 90,
      medio: 160,
      lujo: 320
    }
  },
  'Ciudad de México, México': {
    transporte: ['avion', 'micro'],
    alojamientos: {
      economico: 50,
      medio: 100,
      lujo: 200
    }
  },
  'Toronto, Canadá': {
    transporte: ['avion', 'micro'],
    alojamientos: {
      economico: 70,
      medio: 130,
      lujo: 270
    }
  },
  'La Plata, Argentina': {
    transporte: ['avion', 'tren', 'micro'],
    alojamientos: {
      economico: 55,
      medio: 110,
      lujo: 220
    }
  },
  'Buenos Aires, Argentina': {
    transporte: ['avion', 'tren', 'micro'],
    alojamientos: {
      economico: 55,
      medio: 110,
      lujo: 220
    }
  },

  // Caribe & islas paradisíacas
  'Punta Cana, República Dominicana': {
    transporte: ['avion'],
    alojamientos: {
      economico: 60,
      medio: 110,
      lujo: 250
    }
  },
  'Hawái, EE.UU.': {
    transporte: ['avion'],
    alojamientos: {
      economico: 100,
      medio: 180,
      lujo: 350
    }
  },
  'Bora Bora, Polinesia Francesa': {
    transporte: ['avion'],
    alojamientos: {
      economico: 150,
      medio: 250,
      lujo: 500
    }
  },
  'Bangkok, Tailandia': {
    transporte: ['avion'],
    alojamientos: {
      economico: 40,
      medio: 80,
      lujo: 160
    }
  }
};

// Distancia aproximada (en km) entre ciudades
const distanciasAproximadas = {
  'París, Francia': 11000,
  'Barcelona, España': 10500,
  'Roma, Italia': 11300,
  'Londres, Reino Unido': 11100,
  'Atenas, Grecia': 12100,
  'Nueva York, EE.UU.': 8500,
  'Ciudad de México, México': 7000,
  'Toronto, Canadá': 9000,
  'La Plata, Argentina': 60,  // Distancia a Buenos Aires
  'Buenos Aires, Argentina': 0,
  'Punta Cana, República Dominicana': 6000,
  'Hawái, EE.UU.': 12000,
  'Bora Bora, Polinesia Francesa': 13500,
  'Bangkok, Tailandia': 17500
};

// Precios base por tipo de transporte (por km)
const preciosBaseTransporte = {
  avion: 0.15,  // $0.15 por km
  tren: 0.05,   // $0.05 por km
  micro: 0.02   // $0.02 por km
};

const alojamientoNombres = {
  economico: 'Económico',
  medio: 'Medio',
  lujo: 'Lujo'
};

// Referencias DOM
const origenInput = document.getElementById('origen');
const destinoSelect = document.getElementById('destino');
const transporteSelect = document.getElementById('transporte');
const alojamientoSelect = document.getElementById('alojamiento');
const diasInput = document.getElementById('dias');
const btnCalcular = document.getElementById('btnCalcular');
const resultadoDiv = document.getElementById('resultado');
const caracteristicasSection = document.getElementById('caracteristicas');
const destinosSection = document.getElementById('destinos');
const presupuestosSection = document.getElementById('presupuestos');
const formSection = document.getElementById('form-section');
const inicioSection = document.getElementById('inicio');

// Carga destinos en el select al inicio
function cargarDestinos() {
  for (const dest in destinos) {
    const option = document.createElement('option');
    option.value = dest;
    option.textContent = dest;
    destinoSelect.appendChild(option);
  }
}
cargarDestinos();

// Determina los transportes disponibles según origen y destino
function determinarTransportesDisponibles(origen, destino) {
  const transportesBase = destinos[destino].transporte;
  const distancia = distanciasAproximadas[destino] || 0;

  // Extraer país del origen y destino
  const [_, paisOrigen] = origen.split(', ') || ['', ''];
  const [__, paisDestino] = destino.split(', ') || ['', ''];

  // Si son del mismo país y la distancia es menor a 200 km, excluir avión
  let transportesDisponibles = [...transportesBase];
  if (paisOrigen === paisDestino && distancia < 200) {
    transportesDisponibles = transportesDisponibles.filter(t => t !== 'avion');
  } else if (distancia > 2000) {
    transportesDisponibles = transportesDisponibles.filter(t => t === 'avion');
  }

  return transportesDisponibles;
}

// Calcula el precio del transporte basado en la distancia
function calcularPrecioTransporte(tipo, distancia) {
  return Math.round(preciosBaseTransporte[tipo] * distancia);
}

// Cuando se cambia el origen o destino, actualizar transporte
origenInput.addEventListener('input', actualizarTransporte);
destinoSelect.addEventListener('change', actualizarTransporte);

function actualizarTransporte() {
  const origen = origenInput.value.trim();
  const destino = destinoSelect.value;
  transporteSelect.innerHTML = '<option value="" disabled selected>-- Seleccioná transporte --</option>';
  alojamientoSelect.innerHTML = '<option value="" disabled selected>-- Seleccioná alojamiento --</option>';
  alojamientoSelect.disabled = true;
  resultadoDiv.style.display = 'none';

  if (origen && destino) {
    const transportesDisponibles = determinarTransportesDisponibles(origen, destino);
    const distancia = distanciasAproximadas[destino] || 0;

    transportesDisponibles.forEach(t => {
      const option = document.createElement('option');
      option.value = t;
      option.textContent = t.charAt(0).toUpperCase() + t.slice(1);
      transporteSelect.appendChild(option);
    });
    transporteSelect.disabled = false;
  } else {
    transporteSelect.disabled = true;
  }
  btnCalcular.disabled = true;
}

// Cuando se selecciona transporte, actualizar alojamientos
transporteSelect.addEventListener('change', () => {
  alojamientoSelect.innerHTML = '<option value="" disabled selected>-- Seleccioná alojamiento --</option>';
  resultadoDiv.style.display = 'none';

  const destino = destinoSelect.value;
  const alojamientos = destinos[destino].alojamientos;
  for (const tipo in alojamientos) {
    const option = document.createElement('option');
    option.value = tipo;
    option.textContent = `${alojamientoNombres[tipo]} - $${alojamientos[tipo]} por noche`;
    alojamientoSelect.appendChild(option);
  }
  alojamientoSelect.disabled = false;
  btnCalcular.disabled = true;
});

// Validar que todos los campos estén completos para habilitar botón
[origenInput, alojamientoSelect, diasInput].forEach(element => {
  element.addEventListener('input', validarFormulario);
});
destinoSelect.addEventListener('change', validarFormulario);
transporteSelect.addEventListener('change', validarFormulario);

function validarFormulario() {
  btnCalcular.disabled =
    !origenInput.value.trim() ||
    !destinoSelect.value ||
    !transporteSelect.value ||
    !alojamientoSelect.value ||
    !(diasInput.value > 0);
}

// Calcular y mostrar costos
btnCalcular.addEventListener('click', () => {
  const origen = origenInput.value.trim();
  const destino = destinoSelect.value;
  const transporte = transporteSelect.value;
  const alojamiento = alojamientoSelect.value;
  const dias = parseInt(diasInput.value);

  const distancia = distanciasAproximadas[destino] || 0;
  const costoTransporte = calcularPrecioTransporte(transporte, distancia);
  const costoHotelPorNoche = destinos[destino].alojamientos[alojamiento];
  const costoHotel = costoHotelPorNoche * dias;

  const costoExtrasDiarios = 60 * dias;

  const total = costoTransporte + costoHotel + costoExtrasDiarios;

  resultadoDiv.style.display = 'block';
  resultadoDiv.classList.add('show');
  resultadoDiv.innerHTML = `
    <h3>Resumen de costos:</h3>
    <ul>
      <li><strong>Origen:</strong> ${origen}</li>
      <li><strong>Destino:</strong> ${destino}</li>
      <li><strong>Transporte (${transporte.charAt(0).toUpperCase() + transporte.slice(1)}):</strong> $${costoTransporte} (aprox. ${distancia} km)</li>
      <li><strong>Alojamiento (${alojamientoNombres[alojamiento]}):</strong> $${costoHotel} (${costoHotelPorNoche} x ${dias} noches)</li>
      <li><strong>Extras diarios:</strong> $${costoExtrasDiarios} ($60 x ${dias} días)</li>
      <li><strong>Total estimado:</strong> <strong>$${total}</strong></li>
    </ul>
  `;
});

// Transición suave al hacer clic en las secciones
document.querySelector('nav a[href="#inicio"]').addEventListener('click', (e) => {
  e.preventDefault();
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

document.querySelector('nav a[href="#caracteristicas"]').addEventListener('click', (e) => {
  e.preventDefault();
  caracteristicasSection.classList.add('visible');
  caracteristicasSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
});

document.querySelector('nav a[href="#destinos"]').addEventListener('click', (e) => {
  e.preventDefault();
  destinosSection.classList.add('visible');
  destinosSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
});

document.querySelector('nav a[href="#presupuestos"]').addEventListener('click', (e) => {
  e.preventDefault();
  presupuestosSection.classList.add('visible');
  presupuestosSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
});

document.querySelector('a[href="#form-section"]').addEventListener('click', (e) => {
  e.preventDefault();
  formSection.scrollIntoView({ behavior: 'smooth' });
});

// Mostrar sección correspondiente al cargar si el hash está presente
window.addEventListener('load', () => {
  const hash = window.location.hash;
  if (hash === '#inicio') {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  } else if (hash === '#caracteristicas') {
    caracteristicasSection.classList.add('visible');
    caracteristicasSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
  } else if (hash === '#destinos') {
    destinosSection.classList.add('visible');
    destinosSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
  } else if (hash === '#presupuestos') {
    presupuestosSection.classList.add('visible');
    presupuestosSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
  } else if (hash === '#form-section') {
    formSection.scrollIntoView({ behavior: 'smooth' });
  }
});