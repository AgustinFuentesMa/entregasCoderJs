(async function (global) {
  async function cargarReservas() {
    try {
 
      let reservas = JSON.parse(localStorage.getItem("reservas"));
      if (reservas && reservas.length > 0) {
        return reservas;
      }

      const res = await fetch("./data/reservas.json", { cache: "no-store" });
      if (!res.ok) throw new Error("Error al cargar JSON");
      const data = await res.json();

      reservas = data.reservas || [];
      localStorage.setItem("reservas", JSON.stringify(reservas));

      return reservas;
    } catch (err) {
      Swal.fire("Error", "No se pudo cargar el archivo JSON", "error");
      return [];
    }
  }

  function guardarReservas(reservas) {
    localStorage.setItem("reservas", JSON.stringify(reservas));
  }

  global.API = { cargarReservas, guardarReservas };
})(window);
