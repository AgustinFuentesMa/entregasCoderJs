class Reserva {
  constructor(nombre, correo, fecha, hora, cantidad, motivo, estado = "Pendiente", pacientes = []) {
    this.nombre = nombre;
    this.correo = correo;
    this.fecha = fecha;
    this.hora = hora;
    this.cantidad = Number(cantidad);
    this.motivo = motivo;
    this.estado = estado;
    this.pacientes = pacientes;
  }
}

let reservas = JSON.parse(localStorage.getItem("reservas")) || [];
const formReserva = document.querySelector("#reservaForm");
const tablaReservas = document.querySelector("#reservaLista");
const totalReservas = document.querySelector("#contador");
let editIndex = null;


function validarNombre(nombre) {
  return /^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]+$/.test(nombre);
}

function fechaValida(fecha) {
  const hoy = new Date().toISOString().split("T")[0];
  return fecha >= hoy;
}

formReserva.addEventListener("submit", async (ev) => {
  ev.preventDefault();

  const nombre = document.querySelector("#nombre").value.trim();
  const correo = document.querySelector("#email").value.trim();
  const fecha = document.querySelector("#fecha").value;
  const hora = document.querySelector("#hora").value;
  const cant = Number(document.querySelector("#personas").value);
  const motivo = document.querySelector("#motivo").value.trim();

  if (!nombre || !correo || !fecha || !hora || !cant) {
    Swal.fire("Error", "Faltan datos obligatorios", "warning");
    return;
  }

  if (!validarNombre(nombre)) {
    Swal.fire("Error", "El nombre no puede contener números.", "error");
    return;
  }

  if (!fechaValida(fecha)) {
    Swal.fire("Error", "La fecha debe ser igual o posterior a hoy.", "error");
    return;
  }

  if (hora < "09:00" || hora > "21:00") {
    Swal.fire("Error", "Fuera de horario (09:00 a 21:00)", "error");
    return;
  }

  if (!(hora.endsWith(":00") || hora.endsWith(":30"))) {
    Swal.fire("Error", "Los turnos deben ser a la hora en punto o y media", "warning");
    return;
  }

  const duplicada = reservas.some((r) => r.fecha === fecha && r.hora === hora && editIndex === null);
  if (duplicada) {
    Swal.fire("Error", "Ya existe un turno reservado en esa fecha y hora.", "error");
    return;
  }

  let pacientes = [];
  if (cant > 1) {
    for (let i = 1; i <= cant; i++) {
      const { value: p } = await Swal.fire({
        title: `Paciente ${i}`,
        input: "text",
        inputLabel: "Ingrese el nombre",
        inputValidator: (value) => {
          if (!value || !validarNombre(value)) {
            return "Nombre inválido";
          }
        },
        showCancelButton: true,
      });
      if (!p) return;
      pacientes.push(p.trim());
    }
  }

  let estadoFinal = "Confirmada";
  let ocupadas = reservas
    .filter((r) => r.fecha === fecha && r.hora === hora)
    .reduce((acc, r) => acc + r.cantidad, 0);
  if (ocupadas + cant > 6) estadoFinal = "Pendiente";

  const nuevaReserva = new Reserva(nombre, correo, fecha, hora, cant, motivo, estadoFinal, pacientes);

  if (editIndex !== null) {
    reservas[editIndex] = nuevaReserva;
    editIndex = null;
  } else {
    reservas.push(nuevaReserva);
  }

  localStorage.setItem("reservas", JSON.stringify(reservas));
  formReserva.reset();
  renderReservas();
  Swal.fire("Éxito", "La reserva fue guardada correctamente", "success");
});

function renderReservas() {
  tablaReservas.innerHTML = "";
  reservas.forEach((res, idx) => {
    const tr = document.createElement("tr");

    const pacientesLista = res.pacientes.length > 0 ? res.pacientes.join(", ") : "-";

    tr.innerHTML = `
      <td>${res.nombre}</td>
      <td>${res.correo}</td>
      <td>${res.fecha}</td>
      <td>${res.hora}</td>
      <td>${res.cantidad}</td>
      <td>${pacientesLista}</td>
      <td class="estado-${res.estado.toLowerCase()}">${res.estado}</td>
    `;

    const trBotones = document.createElement("tr");
    trBotones.innerHTML = `
      <td colspan="7">
        <div class="btn-container">
          <button class="btn-confirmar">Confirmar</button>
          <button class="btn-cancelar">Cancelar</button>
          <button class="btn-editar">Editar</button>
          <button class="btn-borrar">Eliminar</button>
        </div>
      </td>
    `;

    trBotones.querySelector(".btn-confirmar").addEventListener("click", () => actualizarEstado(idx, "Confirmada"));
    trBotones.querySelector(".btn-cancelar").addEventListener("click", () => actualizarEstado(idx, "Cancelada"));
    trBotones.querySelector(".btn-editar").addEventListener("click", () => editarReserva(idx));
    trBotones.querySelector(".btn-borrar").addEventListener("click", () => borrarReserva(idx));

    tablaReservas.appendChild(tr);
    tablaReservas.appendChild(trBotones);
  });
  totalReservas.textContent = `Total: ${reservas.length}`;
}

function actualizarEstado(i, estado) {
  reservas[i].estado = estado;
  localStorage.setItem("reservas", JSON.stringify(reservas));
  renderReservas();
  Swal.fire("Estado actualizado", `La reserva está ahora ${estado}`, "info");
}

function borrarReserva(i) {
  Swal.fire({
    title: "¿Seguro?",
    text: "Esta acción eliminará la reserva",
    icon: "warning",
    showCancelButton: true,
    confirmButtonText: "Sí, eliminar",
  }).then((result) => {
    if (result.isConfirmed) {
      reservas.splice(i, 1);
      localStorage.setItem("reservas", JSON.stringify(reservas));
      renderReservas();
      Swal.fire("Eliminada", "La reserva fue borrada", "success");
    }
  });
}

function editarReserva(i) {
  const r = reservas[i];
  document.querySelector("#nombre").value = r.nombre;
  document.querySelector("#email").value = r.correo;
  document.querySelector("#fecha").value = r.fecha;
  document.querySelector("#hora").value = r.hora;
  document.querySelector("#personas").value = r.cantidad;
  document.querySelector("#motivo").value = r.motivo;
  editIndex = i;
  Swal.fire("Edición", "Modifica los datos en el formulario y guarda", "info");
}

function generarHoras() {
  const selectHora = document.querySelector("#hora");
  selectHora.innerHTML = "";

  for (let h = 9; h <= 21; h++) {
    ["00", "30"].forEach((m) => {
      if (!(h === 21 && m === "30")) {
        const opcion = document.createElement("option");
        const hora = `${String(h).padStart(2, "0")}:${m}`;
        opcion.value = hora;
        opcion.textContent = hora;
        selectHora.appendChild(opcion);
      }
    });
  }
}
generarHoras();

(async function init() {
  if (reservas.length === 0) {
    reservas = await API.cargarReservas();
    localStorage.setItem("reservas", JSON.stringify(reservas));
  }
  renderReservas();
})();
