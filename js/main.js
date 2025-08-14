class Reserva {
    constructor(nombre, correo, fecha, hora, cantidad, motivo, estado = "Pendiente") {
        this.nombre = nombre;
        this.correo = correo;
        this.fecha = fecha;
        this.hora = hora;
        this.cantidad = Number(cantidad);
        this.motivo = motivo;
        this.estado = estado;
    }
}

let reservas = JSON.parse(localStorage.getItem('reservas')) || [];

const formReserva = document.querySelector('#reservaForm');
const tablaReservas = document.querySelector('#reservaLista');
const totalReservas = document.querySelector('#contador');


function filtrarReservas(callback) {
    return reservas.filter(callback);
}

function crearActualizadorEstado(nuevoEstado) {
    return function (indice) {
        reservas[indice].estado = nuevoEstado;
        localStorage.setItem('reservas', JSON.stringify(reservas));
        renderReservas();
    };
}

formReserva.addEventListener('submit', ev => {
    ev.preventDefault();

    const nombre = document.querySelector('#nombre').value.trim();
    const correo = document.querySelector('#email').value.trim();
    const fecha = document.querySelector('#fecha').value;
    const hora = document.querySelector('#hora').value;
    const cant = document.querySelector('#personas').value;
    const motivo = document.querySelector('#motivo').value.trim();

    if (!nombre || !correo || !fecha || !hora || !cant) {
        alert('Faltan datos obligatorios');
        return;
    }

    if (hora < '09:00' || hora > '21:00') {
        alert('Fuera de horario (09:00 a 21:00)');
        return;
    }

    let ocupadas = filtrarReservas(r => r.fecha === fecha && r.hora === hora)
        .reduce((acc, r) => acc + r.cantidad, 0);

    let estadoFinal = 'Confirmada';
    if (ocupadas + Number(cant) > 6) estadoFinal = 'Pendiente';

    reservas.push(new Reserva(nombre, correo, fecha, hora, cant, motivo, estadoFinal));

    localStorage.setItem('reservas', JSON.stringify(reservas));

    formReserva.reset();
    renderReservas();
});

function renderReservas() {
    tablaReservas.innerHTML = '';
    reservas.forEach((res, idx) => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${res.nombre}</td>
            <td>${res.correo}</td>
            <td>${res.fecha}</td>
            <td>${res.hora}</td>
            <td>${res.cantidad}</td>
            <td class="estado-${res.estado.toLowerCase()}">${res.estado}</td>
            <td>
                <button onclick="setConfirmada(${idx})">Confirmar</button>
                <button onclick="setCancelada(${idx})">Cancelar</button>
                <button onclick="borrarReserva(${idx})">Eliminar</button>
            </td>
        `;
        tablaReservas.appendChild(tr);
    });
    totalReservas.textContent = `Total: ${reservas.length}`;
}

const setConfirmada = crearActualizadorEstado('Confirmada');
const setCancelada = crearActualizadorEstado('Cancelada');

function borrarReserva(i) {
    reservas.splice(i, 1);
    localStorage.setItem('reservas', JSON.stringify(reservas));
    renderReservas();
}

renderReservas();
