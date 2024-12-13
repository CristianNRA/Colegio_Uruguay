document.addEventListener("DOMContentLoaded", function () {
    const tabs = document.querySelectorAll(".tab-link");
    const tabContents = document.querySelectorAll(".tab-content");
    const formRegistrar = document.getElementById("form-registrar");
    const btnAgregarAutorizado = document.getElementById("agregar-autorizado");
    const buscarInput = document.getElementById("buscar-rut");
    const buscarBtn = document.getElementById("buscar-alumno");
    const resultadoBuscar = document.getElementById("resultado-buscar");
    const cursoLista = document.getElementById("curso-lista");
    const mostrarListaBtn = document.getElementById("mostrar-lista");
    const listaAlumnosDiv = document.getElementById("lista-alumnos");
    const autorizadosDiv = document.getElementById("autorizados");
    const buscarInputAtraso = document.getElementById("buscar-rut-atraso");
    const buscarBtnAtraso = document.getElementById("buscar-alumno-atraso");
    const resultadoAtraso = document.getElementById("resultado-atraso");
    const cambioIndividualDiv = document.getElementById("cambio-individual");
    const cambioCompletoDiv = document.getElementById("cambio-completo");
    const resultadoCambioCurso = document.getElementById("resultado-cambio-curso");

    document.addEventListener("DOMContentLoaded", function () {
        const formRegistrar = document.getElementById("formRegistrar");
    
        // Prevenir el envío tradicional del formulario
        formRegistrar.addEventListener("submit", function (e) {
            e.preventDefault();
    
            // Aquí puedes agregar el código para manejar los datos del formulario
            // Por ejemplo, validar y luego enviar los datos con AJAX o procesarlos según sea necesario
            const nombre = document.getElementById("nombre").value;
            const rut = document.getElementById("rut").value;
            const curso = document.getElementById("curso").value;
            // Procesar los datos...
        });
    });
    

    let alumnos = JSON.parse(localStorage.getItem("alumnos")) || [];
    const cursos = [
        "Prekínder", "Kínder", "1ºA", "1ºB", "2ºA", "2ºB", "3ºA", "3ºB",
        "4ºA", "4ºB", "5ºA", "5ºB", "6ºA", "6ºB", "7ºA", "7ºB", "8ºA", "8ºB"
    ];

    // Inicializar opciones de curso en los selectores
    function populateCourses(selectElement) {
        cursos.forEach(curso => {
            const option = document.createElement("option");
            option.value = curso;
            option.textContent = curso;
            selectElement.appendChild(option);
        });
    }
    populateCourses(document.getElementById("curso"));
    populateCourses(cursoLista);
    populateCourses(document.getElementById("curso-origen"));
    populateCourses(document.getElementById("curso-destino"));
    populateCourses(document.getElementById("curso-origen-completo"));
    populateCourses(document.getElementById("curso-destino-completo"));

    // Cambiar pestañas
    tabs.forEach((tab) => {
        tab.addEventListener("click", (e) => {
            e.preventDefault();
            const target = tab.getAttribute("data-tab");

            // Desactivar todas las pestañas y contenidos
            tabs.forEach(t => t.classList.remove("active"));
            tabContents.forEach(content => content.classList.remove("active"));

            // Activar la pestaña seleccionada
            tab.classList.add("active");

            // Mostrar el contenido correspondiente
            document.getElementById(target).classList.add("active");
        });
    });

    // Registrar o editar alumno
    formRegistrar.addEventListener("submit", function (e) {
        e.preventDefault();
        const nombre = document.getElementById("nombre").value.trim();
        const rut = document.getElementById("rut").value.trim();
        const curso = document.getElementById("curso").value;

        const autorizados = Array.from(autorizadosDiv.querySelectorAll("div")).map((div) => {
            const nombreAutorizado = div.querySelector(".nombre-autorizado").value.trim();
            const rutAutorizado = div.querySelector(".rut-autorizado").value.trim();
            return { nombre: nombreAutorizado, rut: rutAutorizado };
        });

        // Si está editando, actualizamos los datos
        if (nombre && rut && curso) {
            const index = alumnos.findIndex((alumno) => alumno.rut === rut); // Buscar si el alumno ya existe
            if (index !== -1) {
                alumnos[index] = { nombre, rut, curso, autorizados }; // Editamos los datos
                alert("Alumno editado correctamente.");
            } else {
                alumnos.push({ nombre, rut, curso, autorizados }); // Si no existe, registramos como nuevo
                alert("Alumno registrado correctamente.");
            }
            localStorage.setItem("alumnos", JSON.stringify(alumnos));
            formRegistrar.reset();
            autorizadosDiv.innerHTML = ""; // Limpiar autorizados
        } else {
            alert("Por favor, complete todos los campos.");
        }
    });

    // Agregar un autorizado
    btnAgregarAutorizado.addEventListener("click", () => {
        if (autorizadosDiv.children.length < 5) {
            const div = document.createElement("div");
            div.innerHTML = ` 
                <label>Nombre:</label>
                <input type="text" class="nombre-autorizado">
                <label>RUT:</label>
                <input type="text" class="rut-autorizado">
            `;
            autorizadosDiv.appendChild(div);
        } else {
            alert("Solo se pueden agregar hasta 4 personas autorizadas.");
        }
    });

    // Buscar alumno
    buscarBtn.addEventListener("click", () => {
        const query = buscarInput.value.trim().toLowerCase();
        const alumno = alumnos.find((alumno) =>
            alumno.rut.toLowerCase() === query || alumno.nombre.toLowerCase() === query
        );

        if (alumno) {
            const autorizadosHTML = alumno.autorizados
                .map((autorizado) => `<li>${autorizado.nombre} (${autorizado.rut})</li>`)
                .join("");
            resultadoBuscar.innerHTML = ` 
                <p>Alumno encontrado:</p>
                <p>Nombre: ${alumno.nombre}</p>
                <p>RUT: ${alumno.rut}</p>
                <p>Curso: ${alumno.curso}</p>
                <p>Personas autorizadas:</p>
                <ul>${autorizadosHTML}</ul>
                <button id="editar-alumno">Editar</button>
            `;
            document.getElementById("editar-alumno").addEventListener("click", () => {
                // Llenamos el formulario con los datos del alumno para editar
                document.getElementById("nombre").value = alumno.nombre;
                document.getElementById("rut").value = alumno.rut;
                document.getElementById("curso").value = alumno.curso;

                // Limpiar la sección de autorizados y cargar los autorizados actuales
                autorizadosDiv.innerHTML = "";
                alumno.autorizados.forEach((autorizado) => {
                    const div = document.createElement("div");
                    div.innerHTML = `
                        <label>Nombre:</label>
                        <input type="text" class="nombre-autorizado" value="${autorizado.nombre}">
                        <label>RUT:</label>
                        <input type="text" class="rut-autorizado" value="${autorizado.rut}">
                    `;
                    autorizadosDiv.appendChild(div);
                });
            });
        } else {
            resultadoBuscar.innerHTML = "<p>No se encontró el alumno.</p>";
        }
    });

    // Mostrar lista por curso
    mostrarListaBtn.addEventListener("click", () => {
        const curso = cursoLista.value;
        const alumnosCurso = alumnos.filter((alumno) => alumno.curso === curso);

        listaAlumnosDiv.innerHTML = alumnosCurso
            .map((alumno) => `
                <div class="alumno">
                    <p>${alumno.nombre} - ${alumno.rut} (${alumno.curso})</p>
                    <button class="eliminar-btn" data-rut="${alumno.rut}">Eliminar</button>
                </div>
            `)
            .join("");

        listaAlumnosDiv.querySelectorAll(".eliminar-btn").forEach((btn) => {
            btn.addEventListener("click", (e) => {
                const rut = e.target.getAttribute("data-rut");
                alumnos = alumnos.filter((alumno) => alumno.rut !== rut);
                localStorage.setItem("alumnos", JSON.stringify(alumnos));
                mostrarListaBtn.click(); // Actualizar la lista
            });
        });
    });
    
 
// Evento de búsqueda de alumno para atrasos
document.getElementById('buscar-alumno-atraso').addEventListener('click', function () {
    const rutONombre = document.getElementById('buscar-rut-atraso').value.trim();
    if (!rutONombre) {
        alert('Por favor, ingrese el RUT o nombre del alumno.');
        return;
    }

    const alumnos = JSON.parse(localStorage.getItem('alumnos')) || [];
    const alumno = alumnos.find(al => al.rut === rutONombre || al.nombre === rutONombre);

    const resultadoDiv = document.getElementById('resultado-atraso');
    resultadoDiv.innerHTML = ''; // Limpiar resultados anteriores

    if (alumno) {
        resultadoDiv.innerHTML = `
            <h3>Atrasos de ${alumno.nombre}</h3>
            <button id="btn-agregar-atraso">Agregar Atraso</button>
            <button id="btn-mostrar-atrasos">Mostrar Atrasos</button>
            <div id="area-agregar-atraso"></div>
        `;

        // Configurar botón para agregar atraso
        document.getElementById('btn-agregar-atraso').addEventListener('click', function () {
            mostrarFormularioAgregarAtraso(alumno.rut);
        });

        // Configurar botón para mostrar atrasos
        document.getElementById('btn-mostrar-atrasos').addEventListener('click', function () {
            mostrarListaAtrasos(alumno.rut);
        });
    } else {
        resultadoDiv.innerHTML = '<p>No se encontró al alumno.</p>';
    }
});

// Función para mostrar el formulario de agregar atraso
function mostrarFormularioAgregarAtraso(rut) {
    const areaAgregar = document.getElementById('area-agregar-atraso');
    areaAgregar.innerHTML = `
        <label>Fecha y Hora del Atraso:</label>
        <input type="datetime-local" id="fecha-atraso">
        <label>Motivo del Atraso:</label>
        <input type="text" id="motivo-atraso" placeholder="Ingrese motivo del atraso">
        <button id="guardar-atraso">Guardar</button>
    `;

    document.getElementById('guardar-atraso').addEventListener('click', function () {
        const fechaAtraso = document.getElementById('fecha-atraso').value;
        const motivoAtraso = document.getElementById('motivo-atraso').value.trim();

        if (!fechaAtraso || !motivoAtraso) {
            alert('Por favor, complete la fecha/hora y el motivo.');
            return;
        }

        const alumnos = JSON.parse(localStorage.getItem('alumnos')) || [];
        const alumno = alumnos.find(al => al.rut === rut);

        if (alumno) {
            alumno.atrasos = alumno.atrasos || [];
            alumno.atrasos.push({ fecha: fechaAtraso, motivo: motivoAtraso });

            localStorage.setItem('alumnos', JSON.stringify(alumnos));
            alert('Atraso agregado correctamente.');
            areaAgregar.innerHTML = ''; // Ocultar formulario después de agregar
        }
    });
}

// Función para mostrar la lista de atrasos
function mostrarListaAtrasos(rut) {
    const alumnos = JSON.parse(localStorage.getItem('alumnos')) || [];
    const alumno = alumnos.find(al => al.rut === rut);

    const listaAtrasosDiv = document.getElementById('lista-atrasos');
    listaAtrasosDiv.innerHTML = '';

    if (alumno && alumno.atrasos && alumno.atrasos.length > 0) {
        listaAtrasosDiv.innerHTML = `
            <ul>
                ${alumno.atrasos.map((atraso, index) => `
                    <li>
                        <strong>Fecha:</strong> ${formatearFecha(atraso.fecha)} <br>
                        <strong>Motivo:</strong> ${atraso.motivo} 
                        <button onclick="borrarAtraso('${rut}', ${index})">Borrar</button>
                    </li>
                `).join('')}
            </ul>
        `;
    } else {
        listaAtrasosDiv.innerHTML = '<p>No hay atrasos registrados.</p>';
    }
}

// Función para formatear la fecha
function formatearFecha(fechaISO) {
    const fecha = new Date(fechaISO);
    const dia = String(fecha.getDate()).padStart(2, '0');
    const mes = String(fecha.getMonth() + 1).padStart(2, '0');
    const anio = fecha.getFullYear();
    const hora = String(fecha.getHours()).padStart(2, '0');
    const minutos = String(fecha.getMinutes()).padStart(2, '0');

    return `Fecha: ${dia}/${mes}/${anio} - Hora: ${hora}:${minutos}`;
}

// Función para borrar un atraso
function borrarAtraso(rut, index) {
    const alumnos = JSON.parse(localStorage.getItem('alumnos')) || [];
    const alumno = alumnos.find(al => al.rut === rut);

    if (alumno && alumno.atrasos) {
        // Verificar si el índice es válido
        if (index >= 0 && index < alumno.atrasos.length) {
            alumno.atrasos.splice(index, 1); // Eliminar atraso en el índice especificado
            localStorage.setItem('alumnos', JSON.stringify(alumnos));
            alert('Atraso eliminado correctamente.');
            mostrarListaAtrasos(rut); // Actualizar la lista de atrasos después de borrar
        } else {
            alert('Índice de atraso no válido.');
        }
    } else {
        alert('No se encontraron atrasos para este alumno.');
    }
}


// Cargar cursos
const curso = ["Prekínder", "Kínder", "1A", "1B", "2A", "2B", "3A", "3B", "4A", "4B", "5A", "5B", "6A", "6B", "7A", "7B", "8A", "8B"];
  
// Cargar cursos en los selectores
const cursoOrigenSelect = document.getElementById("curso-origen");
const cursoDestinoSelect = document.getElementById("curso-destino");
const cursoOrigenCompletoSelect = document.getElementById("curso-origen-completo");
const cursoDestinoCompletoSelect = document.getElementById("curso-destino-completo");

cursos.forEach(curso => {
  let option = document.createElement("option");
  option.value = curso;
  option.textContent = curso;
  cursoOrigenSelect.appendChild(option);
  cursoDestinoSelect.appendChild(option.cloneNode(true)); // Clonamos la opción para destino
  cursoOrigenCompletoSelect.appendChild(option.cloneNode(true)); // Clonamos para completo
  cursoDestinoCompletoSelect.appendChild(option.cloneNode(true)); // Clonamos para completo
});

// Cargar alumnos dependiendo del curso seleccionado
document.getElementById("curso-origen").addEventListener("change", () => {
  const cursoOrigen = cursoOrigenSelect.value;
  const alumnoOrigenSelect = document.getElementById("alumno-origen");
  alumnoOrigenSelect.innerHTML = "<option value=''>Seleccionar Alumno</option>"; // Limpiar lista de alumnos

  if (cursoOrigen) {
    const alumnos = JSON.parse(localStorage.getItem("alumnos")) || [];
    const alumnosCursoOrigen = alumnos.filter(a => a.curso === cursoOrigen);

    alumnosCursoOrigen.forEach(alumno => {
      const option = document.createElement("option");
      option.value = alumno.nombre;
      option.textContent = alumno.nombre;
      alumnoOrigenSelect.appendChild(option);
    });
  }
});

// Cambio individual de curso
document.getElementById("cambiar-curso-btn").addEventListener("click", () => {
  const cursoOrigen = cursoOrigenSelect.value;
  const alumnoOrigen = document.getElementById("alumno-origen").value;
  const cursoDestino = cursoDestinoSelect.value;

  if (!cursoOrigen || !alumnoOrigen || !cursoDestino) {
    alert("Por favor, seleccione todos los campos.");
    return;
  }

  const alumnos = JSON.parse(localStorage.getItem("alumnos")) || [];
  const alumno = alumnos.find((a) => a.curso === cursoOrigen && a.nombre === alumnoOrigen);

  if (alumno) {
    alumno.curso = cursoDestino;
    localStorage.setItem("alumnos", JSON.stringify(alumnos));
    alert(`Alumno ${alumnoOrigen} ha sido cambiado a ${cursoDestino}.`);
  } else {
    alert("Alumno no encontrado.");
  }
});

// Cambio completo de curso
document.getElementById("cambiar-curso-completo-btn").addEventListener("click", () => {
  const cursoOrigen = cursoOrigenCompletoSelect.value;
  const cursoDestino = cursoDestinoCompletoSelect.value;

  if (!cursoOrigen || !cursoDestino) {
    alert("Por favor, seleccione todos los campos.");
    return;
  }

  const alumnos = JSON.parse(localStorage.getItem("alumnos")) || [];
  const alumnosCursoOrigen = alumnos.filter((a) => a.curso === cursoOrigen);

  if (alumnosCursoOrigen.length > 0) {
    alumnosCursoOrigen.forEach((alumno) => {
      alumno.curso = cursoDestino;
    });

    localStorage.setItem("alumnos", JSON.stringify(alumnos));
    alert(`Todos los alumnos del curso ${cursoOrigen} han sido cambiados a ${cursoDestino}.`);
  } else {
    alert("No se encontraron alumnos en el curso seleccionado.");
  }
});
});
