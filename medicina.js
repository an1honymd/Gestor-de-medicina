document.addEventListener("DOMContentLoaded", () => {


    /* =========================================================
       FUNCIONES GENERALES
    ========================================================= */

    const $ = (id) => document.getElementById(id);


    function guardarLocalStorage(clave, datos) {

        localStorage.setItem(
            clave,
            JSON.stringify(datos)
        );

    }


    function cargarLocalStorage(
        clave,
        valorInicial
    ) {

        try {

            const datos =
                localStorage.getItem(clave);

            if (!datos) {

                return valorInicial;

            }

            return JSON.parse(datos);

        } catch (error) {

            console.error(
                "Error al cargar:",
                clave,
                error
            );

            return valorInicial;

        }

    }


    function escaparHTML(texto) {

        if (
            texto === null ||
            texto === undefined
        ) {

            return "";

        }


        return String(texto)
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;");

    }


    /* =========================================================
       DATOS
    ========================================================= */

    let paciente =
        cargarLocalStorage(
            "medControl_paciente",
            {
                nombre: "",
                edad: ""
            }
        );


    let tratamiento =
        cargarLocalStorage(
            "medControl_tratamiento",
            {}
        );


    let medicamentos =
        cargarLocalStorage(
            "medControl_medicamentos",
            []
        );


    let historial =
        cargarLocalStorage(
            "medControl_historial",
            []
        );


    let cumplimiento =
        cargarLocalStorage(
            "medControl_cumplimiento",
            []
        );


    let recetas =
        cargarLocalStorage(
            "medControl_recetas",
            []
        );


    /* =========================================================
       REFERENCIAS
    ========================================================= */

    const nombrePaciente =
        $("nombrePaciente");

    const edadPaciente =
        $("edadPaciente");

    const btnGuardarPaciente =
        $("btnGuardarPaciente");


    const formTratamiento =
        $("formTratamiento");

    const historialClinico =
        $("historialClinico");

    const alergias =
        $("alergias");

    const medicacionesActuales =
        $("medicacionesActuales");

    const medicacionesPasadas =
        $("medicacionesPasadas");

    const resultadosPruebas =
        $("resultadosPruebas");

    const observaciones =
        $("observaciones");

    const btnLimpiarTratamiento =
        $("btnLimpiarTratamiento");

    const resumenClinico =
        $("resumenClinico");


    const formMedicamento =
        $("formMedicamento");

    const nombreMedicamento =
        $("nombreMedicamento");

    const dosis =
        $("dosis");

    const frecuencia =
        $("frecuencia");

    const fechaInicio =
        $("fechaInicio");

    const fechaFin =
        $("fechaFin");

    const actividad =
        $("actividad");

    const horariosContainer =
        $("horariosContainer");

    const cantidadMedicamentos =
        $("cantidadMedicamentos");

    const listaMedicamentos =
        $("listaMedicamentos");


    const historialContainer =
        $("historial");


    const proximaMedicamento =
        $("proximaMedicamento");

    const proximaHora =
        $("proximaHora");

    const contador =
        $("contador");


    const modalRecordatorio =
        $("modalRecordatorio");

    const recordatorioTexto =
        $("recordatorioTexto");

    const btnTomado =
        $("btnTomado");

    const btnPosponer =
        $("btnPosponer");


    const resumenCumplimiento =
        $("resumenCumplimiento");

    const historialCumplimiento =
        $("historialCumplimiento");

    const porcentajeCumplimiento =
        $("porcentajeCumplimiento");

    const barraProgresoCumplimiento =
        $("barraProgresoCumplimiento");


    const formReceta =
        $("formReceta");

    const nombreMedico =
        $("nombreMedico");

    const numeroReceta =
        $("numeroReceta");

    const medicamentoReceta =
        $("medicamentoReceta");

    const fechaReceta =
        $("fechaReceta");

    const fechaVencimientoReceta =
        $("fechaVencimientoReceta");

    const diasAvisoReceta =
        $("diasAvisoReceta");

    const listaRecetas =
        $("listaRecetas");


    const btnNotificaciones =
        $("btnNotificaciones");


    /* =========================================================
       VARIABLES
    ========================================================= */

    let medicacionPendienteModal =
        null;

    let ultimaTomaMostrada =
        null;

    let tiempoPospuesto =
        null;


    /* =========================================================
       FECHA LOCAL
    ========================================================= */

    function fechaLocalISO(
        fecha = new Date()
    ) {

        const año =
            fecha.getFullYear();

        const mes =
            String(
                fecha.getMonth() + 1
            ).padStart(2, "0");

        const dia =
            String(
                fecha.getDate()
            ).padStart(2, "0");


        return `${año}-${mes}-${dia}`;

    }


    function formatearFecha(fecha) {

        if (!fecha) {

            return "";

        }


        const partes =
            fecha.split("-");


        if (
            partes.length !== 3
        ) {

            return fecha;

        }


        return `${partes[2]}/${partes[1]}/${partes[0]}`;

    }


    function combinarFechaHora(
        fecha,
        hora
    ) {

        if (
            !fecha ||
            !hora
        ) {

            return null;

        }


        const partesFecha =
            fecha.split("-");

        const partesHora =
            hora.split(":");


        if (
            partesFecha.length !== 3 ||
            partesHora.length < 2
        ) {

            return null;

        }


        return new Date(
            Number(partesFecha[0]),
            Number(partesFecha[1]) - 1,
            Number(partesFecha[2]),
            Number(partesHora[0]),
            Number(partesHora[1]),
            0,
            0
        );

    }


    function crearClaveToma(
        medicamentoId,
        fecha,
        hora
    ) {

        return (
            `${medicamentoId}_${fecha}_${hora}`
        );

    }


    /* =========================================================
       PACIENTE
    ========================================================= */

    function cargarPaciente() {

        if (nombrePaciente) {

            nombrePaciente.value =
                paciente.nombre || "";

        }


        if (edadPaciente) {

            edadPaciente.value =
                paciente.edad || "";

        }

    }


    function guardarPaciente() {

        const nombre =
            nombrePaciente
                ? nombrePaciente.value.trim()
                : "";


        const edad =
            edadPaciente
                ? edadPaciente.value
                : "";


        if (!nombre) {

            alert(
                "Ingresa el nombre del paciente."
            );

            return;

        }


        if (!edad) {

            alert(
                "Ingresa la edad del paciente."
            );

            return;

        }


        paciente = {

            nombre,

            edad

        };


        guardarLocalStorage(
            "medControl_paciente",
            paciente
        );


        actualizarResumenClinico();


        alert(
            "Información del paciente guardada correctamente."
        );

    }


    if (btnGuardarPaciente) {

        btnGuardarPaciente.addEventListener(
            "click",
            guardarPaciente
        );

    }


    /* =========================================================
       TRATAMIENTO CLÍNICO
    ========================================================= */

    function cargarTratamiento() {

        if (!tratamiento) {

            tratamiento = {};

        }


        if (historialClinico) {

            historialClinico.value =
                tratamiento.historialClinico || "";

        }


        if (alergias) {

            alergias.value =
                tratamiento.alergias || "";

        }


        if (medicacionesActuales) {

            medicacionesActuales.value =
                tratamiento.medicacionesActuales || "";

        }


        if (medicacionesPasadas) {

            medicacionesPasadas.value =
                tratamiento.medicacionesPasadas || "";

        }


        if (resultadosPruebas) {

            resultadosPruebas.value =
                tratamiento.resultadosPruebas || "";

        }


        if (observaciones) {

            observaciones.value =
                tratamiento.observaciones || "";

        }

    }


    if (formTratamiento) {

        formTratamiento.addEventListener(
            "submit",
            (event) => {

                event.preventDefault();


                tratamiento = {

                    historialClinico:
                        historialClinico
                            ? historialClinico.value.trim()
                            : "",

                    alergias:
                        alergias
                            ? alergias.value.trim()
                            : "",

                    medicacionesActuales:
                        medicacionesActuales
                            ? medicacionesActuales.value.trim()
                            : "",

                    medicacionesPasadas:
                        medicacionesPasadas
                            ? medicacionesPasadas.value.trim()
                            : "",

                    resultadosPruebas:
                        resultadosPruebas
                            ? resultadosPruebas.value.trim()
                            : "",

                    observaciones:
                        observaciones
                            ? observaciones.value.trim()
                            : "",

                    fechaActualizacion:
                        new Date().toISOString()

                };


                guardarLocalStorage(
                    "medControl_tratamiento",
                    tratamiento
                );


                actualizarResumenClinico();


                alert(
                    "Registro de tratamiento guardado correctamente."
                );

            }
        );

    }


    if (btnLimpiarTratamiento) {

        btnLimpiarTratamiento.addEventListener(
            "click",
            () => {

                if (formTratamiento) {

                    formTratamiento.reset();

                }

            }
        );

    }


    function actualizarResumenClinico() {

        if (!resumenClinico) {

            return;

        }


        const nombre =
            paciente.nombre ||
            "No registrado";


        const edad =
            paciente.edad ||
            "No registrada";


        resumenClinico.innerHTML = `

            <div class="resumen-grid">

                <div class="resumen-item">

                    <strong>
                        👤 Paciente
                    </strong>

                    <span>
                        ${escaparHTML(nombre)}
                    </span>

                </div>


                <div class="resumen-item">

                    <strong>
                        🎂 Edad
                    </strong>

                    <span>
                        ${escaparHTML(edad)}
                    </span>

                </div>


                <div class="resumen-item">

                    <strong>
                        📋 Historial clínico
                    </strong>

                    <span>
                        ${escaparHTML(
                            tratamiento.historialClinico ||
                            "No registrado"
                        )}
                    </span>

                </div>


                <div class="resumen-item">

                    <strong>
                        ⚠️ Alergias
                    </strong>

                    <span>
                        ${escaparHTML(
                            tratamiento.alergias ||
                            "No registradas"
                        )}
                    </span>

                </div>


                <div class="resumen-item">

                    <strong>
                        💊 Medicaciones actuales
                    </strong>

                    <span>
                        ${escaparHTML(
                            tratamiento.medicacionesActuales ||
                            "No registradas"
                        )}
                    </span>

                </div>


                <div class="resumen-item">

                    <strong>
                        💊 Medicaciones pasadas
                    </strong>

                    <span>
                        ${escaparHTML(
                            tratamiento.medicacionesPasadas ||
                            "No registradas"
                        )}
                    </span>

                </div>


                <div class="resumen-item">

                    <strong>
                        🧪 Resultados de pruebas
                    </strong>

                    <span>
                        ${escaparHTML(
                            tratamiento.resultadosPruebas ||
                            "No registrados"
                        )}
                    </span>

                </div>


                <div class="resumen-item">

                    <strong>
                        📝 Observaciones
                    </strong>

                    <span>
                        ${escaparHTML(
                            tratamiento.observaciones ||
                            "Sin observaciones"
                        )}
                    </span>

                </div>

            </div>

        `;

    }


    /* =========================================================
       HORARIOS
    ========================================================= */

    function generarHorarios() {

        if (
            !horariosContainer ||
            !frecuencia
        ) {

            return;

        }


        let cantidad =
            parseInt(
                frecuencia.value
            );


        if (
            frecuencia.value ===
            "personalizado"
        ) {

            cantidad = 1;

        }


        if (
            isNaN(cantidad) ||
            cantidad < 1
        ) {

            cantidad = 1;

        }


        horariosContainer.innerHTML =
            "";


        for (
            let i = 0;
            i < cantidad;
            i++
        ) {

            const contenedor =
                document.createElement("div");


            contenedor.className =
                "horario-item";


            contenedor.innerHTML = `

                <label>
                    Hora ${i + 1}
                </label>

                <input
                    type="time"
                    class="horaMedicamento"
                    required
                >

            `;


            horariosContainer.appendChild(
                contenedor
            );

        }

    }


    if (frecuencia) {

        frecuencia.addEventListener(
            "change",
            generarHorarios
        );

    }


    /* =========================================================
       MEDICAMENTOS
    ========================================================= */

    if (formMedicamento) {

        formMedicamento.addEventListener(
            "submit",
            (event) => {

                event.preventDefault();


                const nombre =
                    nombreMedicamento.value.trim();


                const dosisValor =
                    dosis.value.trim();


                const inicio =
                    fechaInicio.value;


                const fin =
                    fechaFin.value;


                const valorFrecuencia =
                    frecuencia.value;


                const actividadValor =
                    actividad
                        ? actividad.value
                        : "Sin actividad";


                if (!nombre) {

                    alert(
                        "Ingresa el nombre del medicamento."
                    );

                    return;

                }


                if (!dosisValor) {

                    alert(
                        "Ingresa la dosis."
                    );

                    return;

                }


                if (!valorFrecuencia) {

                    alert(
                        "Selecciona la frecuencia."
                    );

                    return;

                }


                if (
                    !inicio ||
                    !fin
                ) {

                    alert(
                        "Ingresa las fechas del tratamiento."
                    );

                    return;

                }


                if (fin < inicio) {

                    alert(
                        "La fecha de finalización no puede ser anterior a la fecha de inicio."
                    );

                    return;

                }


                const horas =
                    Array.from(
                        document.querySelectorAll(
                            ".horaMedicamento"
                        )
                    )
                    .map(
                        input =>
                            input.value
                    )
                    .filter(
                        hora =>
                            hora !== ""
                    );


                if (
                    horas.length === 0
                ) {

                    alert(
                        "Debes agregar al menos un horario."
                    );

                    return;

                }


                const nuevoMedicamento = {

                    id:
                        Date.now().toString(),

                    nombre,

                    dosis:
                        dosisValor,

                    frecuencia:
                        valorFrecuencia,

                    fechaInicio:
                        inicio,

                    fechaFin:
                        fin,

                    actividad:
                        actividadValor,

                    horarios:
                        horas,

                    fechaRegistro:
                        new Date().toISOString()

                };


                medicamentos.push(
                    nuevoMedicamento
                );


                guardarLocalStorage(
                    "medControl_medicamentos",
                    medicamentos
                );


                formMedicamento.reset();


                generarHorarios();


                renderizarMedicamentos();

                actualizarHistorialCumplimiento();

                actualizarProximaToma();


                alert(
                    "Tratamiento programado correctamente."
                );

            }
        );

    }


    /* =========================================================
       MOSTRAR MEDICAMENTOS
    ========================================================= */

    function renderizarMedicamentos() {

        if (!listaMedicamentos) {

            return;

        }


        if (cantidadMedicamentos) {

            cantidadMedicamentos.textContent =
                medicamentos.length;

        }


        if (
            medicamentos.length === 0
        ) {

            listaMedicamentos.innerHTML = `

                <div class="vacio">

                    <div class="vacio-icon">
                        💊
                    </div>

                    <h3>
                        No hay tratamientos
                    </h3>

                    <p>
                        Agrega un medicamento para comenzar.
                    </p>

                </div>

            `;

            return;

        }


        listaMedicamentos.innerHTML =
            medicamentos
                .map(med => `

                    <div class="medicamento-card">

                        <div class="medicamento-header">

                            <div>

                                <h3>
                                    💊
                                    ${escaparHTML(
                                        med.nombre
                                    )}
                                </h3>

                                <p>
                                    Dosis:
                                    ${escaparHTML(
                                        med.dosis
                                    )}
                                </p>

                            </div>


                            <button
                                type="button"
                                class="btn btn-danger btn-eliminar-medicamento"
                                data-id="${med.id}"
                            >
                                🗑️
                            </button>

                        </div>


                        <div class="medicamento-info">

                            <div>

                                <strong>
                                    📅 Inicio
                                </strong>

                                <span>
                                    ${formatearFecha(
                                        med.fechaInicio
                                    )}
                                </span>

                            </div>


                            <div>

                                <strong>
                                    📅 Finalización
                                </strong>

                                <span>
                                    ${formatearFecha(
                                        med.fechaFin
                                    )}
                                </span>

                            </div>


                            <div>

                                <strong>
                                    ⏰ Horarios
                                </strong>

                                <span>
                                    ${med.horarios
                                        .map(
                                            h =>
                                                escaparHTML(h)
                                        )
                                        .join(", ")
                                    }
                                </span>

                            </div>


                            <div>

                                <strong>
                                    🔄 Frecuencia
                                </strong>

                                <span>
                                    ${obtenerTextoFrecuencia(
                                        med.frecuencia
                                    )}
                                </span>

                            </div>


                            <div>

                                <strong>
                                    📌 Actividad
                                </strong>

                                <span>
                                    ${escaparHTML(
                                        med.actividad ||
                                        "Sin actividad"
                                    )}
                                </span>

                            </div>

                        </div>

                    </div>

                `)
                .join("");


        document
            .querySelectorAll(
                ".btn-eliminar-medicamento"
            )
            .forEach(boton => {

                boton.addEventListener(
                    "click",
                    () => {

                        eliminarMedicamento(
                            boton.dataset.id
                        );

                    }
                );

            });

    }


    function obtenerTextoFrecuencia(
        valor
    ) {

        const frecuencias = {

            "1":
                "Una vez al día",

            "2":
                "Dos veces al día",

            "3":
                "Tres veces al día",

            "4":
                "Cuatro veces al día",

            "personalizado":
                "Personalizada"

        };


        return (
            frecuencias[valor] ||
            valor ||
            "No especificada"
        );

    }


    function eliminarMedicamento(id) {

        const medicamento =
            medicamentos.find(
                med =>
                    med.id === id
            );


        if (!medicamento) {

            return;

        }


        const confirmar =
            confirm(
                `¿Deseas eliminar "${medicamento.nombre}"?`
            );


        if (!confirmar) {

            return;

        }


        medicamentos =
            medicamentos.filter(
                med =>
                    med.id !== id
            );


        cumplimiento =
            cumplimiento.filter(
                registro =>
                    registro.medicamentoId !== id
            );


        guardarLocalStorage(
            "medControl_medicamentos",
            medicamentos
        );


        guardarLocalStorage(
            "medControl_cumplimiento",
            cumplimiento
        );


        renderizarMedicamentos();

        renderizarCumplimiento();

        actualizarProximaToma();

    }


    /* =========================================================
       OBTENER TODAS LAS TOMAS DEL TRATAMIENTO
    ========================================================= */

    function obtenerTomasProgramadas() {

        const resultado = [];

        const ahora =
            new Date();


        medicamentos.forEach(
            med => {

                if (
                    !med.fechaInicio ||
                    !med.fechaFin ||
                    !Array.isArray(
                        med.horarios
                    )
                ) {

                    return;

                }


                const inicio =
                    new Date(
                        `${med.fechaInicio}T00:00:00`
                    );


                const fin =
                    new Date(
                        `${med.fechaFin}T23:59:59`
                    );


                const fechaActual =
                    new Date(inicio);


                while (
                    fechaActual <= fin
                ) {

                    const fecha =
                        fechaLocalISO(
                            fechaActual
                        );


                    med.horarios.forEach(
                        hora => {

                            const fechaHora =
                                combinarFechaHora(
                                    fecha,
                                    hora
                                );


                            if (!fechaHora) {

                                return;

                            }


                            const clave =
                                crearClaveToma(
                                    med.id,
                                    fecha,
                                    hora
                                );


                            const registro =
                                cumplimiento.find(
                                    item =>
                                        item.clave ===
                                        clave
                                );


                            let estado =
                                "pendiente";


                            if (
                                fechaHora <=
                                ahora
                            ) {

                                estado =
                                    "omitido";

                            }


                            if (
                                registro &&
                                registro.estado ===
                                "tomado"
                            ) {

                                estado =
                                    "tomado";

                            }


                            resultado.push({

                                clave,

                                medicamentoId:
                                    med.id,

                                medicamento:
                                    med.nombre,

                                dosis:
                                    med.dosis,

                                fecha,

                                hora,

                                fechaHora,

                                estado

                            });

                        }
                    );


                    fechaActual.setDate(
                        fechaActual.getDate() + 1
                    );

                }

            }
        );


        return resultado;

    }


    /* =========================================================
       ACTUALIZAR CUMPLIMIENTO
    ========================================================= */

    function actualizarHistorialCumplimiento() {

        const ahora =
            new Date();


        const tomas =
            obtenerTomasProgramadas();


        tomas.forEach(
            toma => {

                /*
                 * Las tomas futuras no se registran
                 * como omitidas.
                 */

                if (
                    toma.fechaHora >
                    ahora
                ) {

                    return;

                }


                const existente =
                    cumplimiento.find(
                        registro =>
                            registro.clave ===
                            toma.clave
                    );


                /*
                 * Si ya está tomada,
                 * se conserva.
                 */

                if (
                    existente &&
                    existente.estado ===
                    "tomado"
                ) {

                    return;

                }


                /*
                 * Si ya pasó la hora y nunca se
                 * registró, queda como omitida.
                 */

                if (!existente) {

                    cumplimiento.push({

                        clave:
                            toma.clave,

                        medicamentoId:
                            toma.medicamentoId,

                        medicamento:
                            toma.medicamento,

                        dosis:
                            toma.dosis,

                        fecha:
                            toma.fecha,

                        hora:
                            toma.hora,

                        estado:
                            "omitido",

                        fechaRegistro:
                            new Date().toISOString()

                    });

                }

            }
        );


        guardarLocalStorage(
            "medControl_cumplimiento",
            cumplimiento
        );


        renderizarCumplimiento();

    }


    /* =========================================================
       ESTADÍSTICAS DE CUMPLIMIENTO
    ========================================================= */

    function obtenerEstadisticasCumplimiento() {

        const ahora =
            new Date();


        const tomas =
            obtenerTomasProgramadas();


        let tomadas = 0;

        let omitidas = 0;

        let pendientes = 0;


        tomas.forEach(
            toma => {

                if (
                    toma.fechaHora >
                    ahora
                ) {

                    pendientes++;

                    return;

                }


                const registro =
                    cumplimiento.find(
                        item =>
                            item.clave ===
                            toma.clave
                    );


                if (
                    registro &&
                    registro.estado ===
                    "tomado"
                ) {

                    tomadas++;

                } else {

                    omitidas++;

                }

            }
        );


        const evaluadas =
            tomadas +
            omitidas;


        const porcentaje =
            evaluadas > 0
                ? Math.round(
                    (
                        tomadas /
                        evaluadas
                    ) * 100
                )
                : 0;


        return {

            total:
                tomas.length,

            evaluadas,

            tomadas,

            omitidas,

            pendientes,

            porcentaje

        };

    }


    /* =========================================================
       RENDERIZAR CUMPLIMIENTO
    ========================================================= */

    function renderizarCumplimiento() {

        if (
            !historialCumplimiento
        ) {

            return;

        }


        const estadisticas =
            obtenerEstadisticasCumplimiento();


        /*
         * RESUMEN GENERAL
         */

        if (resumenCumplimiento) {

            resumenCumplimiento.innerHTML = `

                <div class="cumplimiento-stat">

                    <strong>
                        ${estadisticas.evaluadas}
                    </strong>

                    <span>
                        Evaluadas
                    </span>

                </div>


                <div class="cumplimiento-stat">

                    <strong>
                        ${estadisticas.tomadas}
                    </strong>

                    <span>
                        Tomadas
                    </span>

                </div>


                <div class="cumplimiento-stat">

                    <strong>
                        ${estadisticas.omitidas}
                    </strong>

                    <span>
                        Omitidas
                    </span>

                </div>


                <div class="cumplimiento-stat">

                    <strong>
                        ${estadisticas.pendientes}
                    </strong>

                    <span>
                        Pendientes
                    </span>

                </div>

            `;

        }


        if (porcentajeCumplimiento) {

            porcentajeCumplimiento.textContent =
                `${estadisticas.porcentaje}%`;

        }


        if (
            barraProgresoCumplimiento
        ) {

            barraProgresoCumplimiento.style.width =
                `${estadisticas.porcentaje}%`;

        }


        if (
            medicamentos.length === 0
        ) {

            historialCumplimiento.innerHTML = `

                <div class="vacio">

                    <div class="vacio-icon">
                        📈
                    </div>

                    <h3>
                        No hay historial de cumplimiento
                    </h3>

                    <p>
                        Programa un medicamento para comenzar.
                    </p>

                </div>

            `;

            return;

        }


        const ahora =
            new Date();


        const todasLasTomas =
            obtenerTomasProgramadas();


        historialCumplimiento.innerHTML =
            medicamentos
                .map(med => {

                    const tomasMed =
                        todasLasTomas.filter(
                            toma =>
                                toma.medicamentoId ===
                                med.id
                        );


                    let tomadas = 0;

                    let omitidas = 0;

                    let pendientes = 0;


                    tomasMed.forEach(
                        toma => {

                            if (
                                toma.fechaHora >
                                ahora
                            ) {

                                pendientes++;

                                return;

                            }


                            const registro =
                                cumplimiento.find(
                                    item =>
                                        item.clave ===
                                        toma.clave
                                );


                            if (
                                registro &&
                                registro.estado ===
                                "tomado"
                            ) {

                                tomadas++;

                            } else {

                                omitidas++;

                            }

                        }
                    );


                    const evaluadas =
                        tomadas +
                        omitidas;


                    const porcentaje =
                        evaluadas > 0
                            ? Math.round(
                                (
                                    tomadas /
                                    evaluadas
                                ) * 100
                            )
                            : 0;


                    const historialHTML =
                        tomasMed
                            .sort(
                                (a, b) =>
                                    a.fechaHora -
                                    b.fechaHora
                            )
                            .map(
                                toma => {

                                    const registro =
                                        cumplimiento.find(
                                            item =>
                                                item.clave ===
                                                toma.clave
                                        );


                                    let estado =
                                        "pendiente";


                                    if (
                                        registro &&
                                        registro.estado ===
                                        "tomado"
                                    ) {

                                        estado =
                                            "tomado";

                                    } else if (
                                        toma.fechaHora <=
                                        ahora
                                    ) {

                                        estado =
                                            "omitido";

                                    }


                                    let clase =
                                        "estado-pendiente";

                                    let texto =
                                        "Pendiente";


                                    if (
                                        estado ===
                                        "tomado"
                                    ) {

                                        clase =
                                            "estado-tomado";

                                        texto =
                                            "Tomado";

                                    }


                                    if (
                                        estado ===
                                        "omitido"
                                    ) {

                                        clase =
                                            "estado-omitido";

                                        texto =
                                            "Omitido";

                                    }


                                    return `

                                        <div class="cumplimiento-historial-item">

                                            <div>

                                                <strong>
                                                    ${formatearFecha(
                                                        toma.fecha
                                                    )}
                                                </strong>

                                                <span>
                                                    ${escaparHTML(
                                                        toma.hora
                                                    )}
                                                </span>

                                            </div>


                                            <span
                                                class="${clase}"
                                            >
                                                ${texto}
                                            </span>

                                        </div>

                                    `;

                                }
                            )
                            .join("");


                    return `

                        <div
                            class="cumplimiento-medicamento"
                        >

                            <div
                                class="cumplimiento-medicamento-header"
                            >

                                <div>

                                    <h3>
                                        💊
                                        ${escaparHTML(
                                            med.nombre
                                        )}
                                    </h3>

                                    <p>
                                        Dosis:
                                        ${escaparHTML(
                                            med.dosis
                                        )}
                                    </p>

                                </div>


                                <strong>
                                    ${porcentaje}%
                                </strong>

                            </div>


                            <div class="barra-progreso">

                                <span
                                    class="barra-cumplimiento"
                                    style="
                                        width:
                                        ${porcentaje}%;
                                    "
                                ></span>

                            </div>


                            <div
                                class="cumplimiento-detalles"
                            >

                                <div
                                    class="cumplimiento-detalle"
                                >

                                    <strong>
                                        ${evaluadas}
                                    </strong>

                                    <span>
                                        Evaluadas
                                    </span>

                                </div>


                                <div
                                    class="cumplimiento-detalle"
                                >

                                    <strong>
                                        ${tomadas}
                                    </strong>

                                    <span>
                                        Tomadas
                                    </span>

                                </div>


                                <div
                                    class="cumplimiento-detalle"
                                >

                                    <strong>
                                        ${omitidas}
                                    </strong>

                                    <span>
                                        Omitidas
                                    </span>

                                </div>


                                <div
                                    class="cumplimiento-detalle"
                                >

                                    <strong>
                                        ${pendientes}
                                    </strong>

                                    <span>
                                        Pendientes
                                    </span>

                                </div>

                            </div>


                            <div
                                class="cumplimiento-historial"
                            >

                                ${
                                    historialHTML ||
                                    "<p>No hay registros.</p>"
                                }

                            </div>

                        </div>

                    `;

                })
                .join("");

    }


    /* =========================================================
       REGISTRAR TOMA COMO TOMADA
    ========================================================= */

    function registrarTomaCumplida(
        toma
    ) {

        if (!toma) {

            return;

        }


        const ahora =
            new Date();


        const existente =
            cumplimiento.find(
                registro =>
                    registro.clave ===
                    toma.clave
            );


        if (
            existente &&
            existente.estado ===
            "tomado"
        ) {

            alert(
                "Esta toma ya fue registrada."
            );

            return;

        }


        if (existente) {

            existente.estado =
                "tomado";

            existente.fechaToma =
                ahora.toISOString();

        } else {

            cumplimiento.push({

                clave:
                    toma.clave,

                medicamentoId:
                    toma.medicamentoId,

                medicamento:
                    toma.medicamento,

                dosis:
                    toma.dosis,

                fecha:
                    toma.fecha,

                hora:
                    toma.hora,

                estado:
                    "tomado",

                fechaToma:
                    ahora.toISOString(),

                fechaRegistro:
                    ahora.toISOString()

            });

        }


        guardarLocalStorage(
            "medControl_cumplimiento",
            cumplimiento
        );


        /*
         * Historial general.
         */

        historial.push({

            id:
                Date.now().toString(),

            medicamentoId:
                toma.medicamentoId,

            medicamento:
                toma.medicamento,

            dosis:
                toma.dosis,

            fechaProgramada:
                toma.fecha,

            horaProgramada:
                toma.hora,

            fechaToma:
                ahora.toISOString(),

            estado:
                "tomado"

        });


        guardarLocalStorage(
            "medControl_historial",
            historial
        );


        renderizarHistorial();

        renderizarCumplimiento();


        medicacionPendienteModal =
            null;

        ultimaTomaMostrada =
            null;


        cerrarModal();


        actualizarProximaToma();

    }


    /* =========================================================
       PRÓXIMA TOMA
    ========================================================= */

    function actualizarProximaToma() {

        if (
            !proximaMedicamento ||
            !proximaHora
        ) {

            return;

        }


        const ahora =
            new Date();


        let siguiente =
            null;


        medicamentos.forEach(
            med => {

                if (
                    !med.fechaInicio ||
                    !med.fechaFin ||
                    !Array.isArray(
                        med.horarios
                    )
                ) {

                    return;

                }


                const inicio =
                    new Date(
                        `${med.fechaInicio}T00:00:00`
                    );


                const fin =
                    new Date(
                        `${med.fechaFin}T23:59:59`
                    );


                /*
                 * Si el tratamiento todavía
                 * no empieza, buscamos su
                 * primera toma.
                 */

                if (
                    ahora < inicio
                ) {

                    med.horarios.forEach(
                        hora => {

                            const fechaToma =
                                combinarFechaHora(
                                    med.fechaInicio,
                                    hora
                                );


                            if (
                                !siguiente ||
                                fechaToma <
                                siguiente.fechaHora
                            ) {

                                siguiente = {

                                    medicamentoId:
                                        med.id,

                                    medicamento:
                                        med.nombre,

                                    dosis:
                                        med.dosis,

                                    fecha:
                                        med.fechaInicio,

                                    hora,

                                    fechaHora:
                                        fechaToma,

                                    clave:
                                        crearClaveToma(
                                            med.id,
                                            med.fechaInicio,
                                            hora
                                        )

                                };

                            }

                        }
                    );


                    return;

                }


                if (
                    ahora > fin
                ) {

                    return;

                }


                med.horarios.forEach(
                    hora => {

                        let fechaToma =
                            combinarFechaHora(
                                fechaLocalISO(
                                    ahora
                                ),
                                hora
                            );


                        if (
                            fechaToma <=
                            ahora
                        ) {

                            const mañana =
                                new Date(
                                    ahora
                                );


                            mañana.setDate(
                                mañana.getDate() +
                                1
                            );


                            fechaToma =
                                combinarFechaHora(
                                    fechaLocalISO(
                                        mañana
                                    ),
                                    hora
                                );

                        }


                        if (
                            fechaToma > fin
                        ) {

                            return;

                        }


                        const clave =
                            crearClaveToma(
                                med.id,
                                fechaLocalISO(
                                    fechaToma
                                ),
                                hora
                            );


                        const registro =
                            cumplimiento.find(
                                item =>
                                    item.clave ===
                                    clave
                            );


                        if (
                            registro &&
                            registro.estado ===
                            "tomado"
                        ) {

                            return;

                        }


                        if (
                            !siguiente ||
                            fechaToma <
                            siguiente.fechaHora
                        ) {

                            siguiente = {

                                medicamentoId:
                                    med.id,

                                medicamento:
                                    med.nombre,

                                dosis:
                                    med.dosis,

                                fecha:
                                    fechaLocalISO(
                                        fechaToma
                                    ),

                                hora,

                                fechaHora:
                                    fechaToma,

                                clave

                            };

                        }

                    }
                );

            }
        );


        if (!siguiente) {

            proximaMedicamento.textContent =
                "No hay próximas tomas";


            proximaHora.textContent =
                "--:--";


            if (contador) {

                contador.textContent =
                    "Sin tomas programadas";

            }


            medicacionPendienteModal =
                null;


            return;

        }


        proximaMedicamento.textContent =
            siguiente.medicamento;


        proximaHora.textContent =
            siguiente.hora;


        medicacionPendienteModal =
            siguiente;


        actualizarContador(
            siguiente.fechaHora
        );

    }


    /* =========================================================
       CONTADOR
    ========================================================= */

    function actualizarContador(
        fechaObjetivo
    ) {

        if (!contador) {

            return;

        }


        const ahora =
            new Date();


        /*
         * Si está pospuesto,
         * utilizamos esa hora.
         */

        if (
            tiempoPospuesto
        ) {

            fechaObjetivo =
                tiempoPospuesto;

        }


        const diferencia =
            fechaObjetivo -
            ahora;


        if (
            diferencia <= 0
        ) {

            contador.textContent =
                "¡Es hora de tomar el medicamento!";


            mostrarModalRecordatorio(
                medicacionPendienteModal
            );


            return;

        }


        const horas =
            Math.floor(
                diferencia /
                (1000 * 60 * 60)
            );


        const minutos =
            Math.floor(
                (
                    diferencia %
                    (1000 * 60 * 60)
                ) /
                (1000 * 60)
            );


        const segundos =
            Math.floor(
                (
                    diferencia %
                    (1000 * 60)
                ) /
                1000
            );


        if (horas > 0) {

            contador.textContent =
                `Faltan ${horas}h ${minutos}m ${segundos}s`;

        } else {

            contador.textContent =
                `Faltan ${minutos}m ${segundos}s`;

        }

    }


    /* =========================================================
       MODAL
    ========================================================= */

    function mostrarModalRecordatorio(
        toma
    ) {

        if (
            !modalRecordatorio ||
            !toma
        ) {

            return;

        }


        if (
            ultimaTomaMostrada ===
            toma.clave
        ) {

            return;

        }


        ultimaTomaMostrada =
            toma.clave;


        if (recordatorioTexto) {

            recordatorioTexto.innerHTML = `

                <strong>
                    💊
                    ${escaparHTML(
                        toma.medicamento
                    )}
                </strong>

                <br>

                Dosis:
                ${escaparHTML(
                    toma.dosis
                )}

                <br>

                Hora:
                ${escaparHTML(
                    toma.hora
                )}

            `;

        }


        modalRecordatorio.classList.add(
            "activo"
        );

    }


    function cerrarModal() {

        if (modalRecordatorio) {

            modalRecordatorio.classList.remove(
                "activo"
            );

        }

    }


    if (btnTomado) {

        btnTomado.addEventListener(
            "click",
            () => {

                if (
                    medicacionPendienteModal
                ) {

                    registrarTomaCumplida(
                        medicacionPendienteModal
                    );

                }

            }
        );

    }


    if (btnPosponer) {

        btnPosponer.addEventListener(
            "click",
            () => {

                if (
                    medicacionPendienteModal
                ) {

                    tiempoPospuesto =
                        new Date(
                            Date.now() +
                            10 * 60 * 1000
                        );

                    ultimaTomaMostrada =
                        null;

                    cerrarModal();

                    actualizarContador(
                        tiempoPospuesto
                    );

                }

            }
        );

    }


    /* =========================================================
       HISTORIAL GENERAL
    ========================================================= */

    function renderizarHistorial() {

        if (!historialContainer) {

            return;

        }


        if (
            historial.length === 0
        ) {

            historialContainer.innerHTML = `

                <div class="vacio pequeño">

                    <p>
                        Todavía no hay registros de tomas.
                    </p>

                </div>

            `;

            return;

        }


        const registros =
            [...historial]
                .sort(
                    (a, b) =>
                        new Date(
                            b.fechaToma
                        ) -
                        new Date(
                            a.fechaToma
                        )
                );


        historialContainer.innerHTML =
            registros
                .map(item => {

                    const fecha =
                        new Date(
                            item.fechaToma
                        );


                    const fechaTexto =
                        fecha.toLocaleDateString(
                            "es-GT"
                        );


                    const horaTexto =
                        fecha.toLocaleTimeString(
                            "es-GT",
                            {
                                hour: "2-digit",
                                minute: "2-digit"
                            }
                        );


                    return `

                        <div class="historial-item">

                            <div>

                                <strong>
                                    💊
                                    ${escaparHTML(
                                        item.medicamento
                                    )}
                                </strong>

                                <span>
                                    Dosis:
                                    ${escaparHTML(
                                        item.dosis
                                    )}
                                </span>

                            </div>


                            <div>

                                <span>
                                    Programado:
                                    ${formatearFecha(
                                        item.fechaProgramada
                                    )}
                                    ${escaparHTML(
                                        item.horaProgramada
                                    )}
                                </span>

                                <span>
                                    Registrado:
                                    ${fechaTexto}
                                    ${horaTexto}
                                </span>

                            </div>

                        </div>

                    `;

                })
                .join("");

    }


    /* =========================================================
       RECETAS
    ========================================================= */

    if (formReceta) {

        formReceta.addEventListener(
            "submit",
            (event) => {

                event.preventDefault();


                const medico =
                    nombreMedico
                        ? nombreMedico.value.trim()
                        : "";


                const numero =
                    numeroReceta
                        ? numeroReceta.value.trim()
                        : "";


                const medicamento =
                    medicamentoReceta
                        ? medicamentoReceta.value.trim()
                        : "";


                const fecha =
                    fechaReceta
                        ? fechaReceta.value
                        : "";


                const vencimiento =
                    fechaVencimientoReceta
                        ? fechaVencimientoReceta.value
                        : "";


                const diasAviso =
                    diasAvisoReceta
                        ? Number(
                            diasAvisoReceta.value
                        ) || 0
                        : 0;


                if (!medicamento) {

                    alert(
                        "Ingresa el medicamento."
                    );

                    return;

                }


                if (
                    !fecha ||
                    !vencimiento
                ) {

                    alert(
                        "Ingresa las fechas."
                    );

                    return;

                }


                if (
                    vencimiento <
                    fecha
                ) {

                    alert(
                        "La fecha de vencimiento no puede ser anterior a la fecha de receta."
                    );

                    return;

                }


                recetas.push({

                    id:
                        Date.now().toString(),

                    medico,

                    numero,

                    medicamento,

                    fecha,

                    vencimiento,

                    diasAviso,

                    alertas:
                        0,

                    fechaRegistro:
                        new Date().toISOString(),

                    ultimaAlerta:
                        ""

                });


                guardarLocalStorage(
                    "medControl_recetas",
                    recetas
                );


                formReceta.reset();


                if (diasAvisoReceta) {

                    diasAvisoReceta.value =
                        7;

                }


                renderizarRecetas();


                alert(
                    "Receta guardada correctamente."
                );

            }
        );

    }


    function obtenerEstadoReceta(
        receta
    ) {

        const ahora =
            new Date();


        const vencimiento =
            new Date(
                `${receta.vencimiento}T23:59:59`
            );


        const diferencia =
            vencimiento -
            ahora;


        if (
            diferencia < 0
        ) {

            return {

                clase:
                    "vencida",

                texto:
                    "Vencida"

            };

        }


        const dias =
            Math.ceil(
                diferencia /
                (1000 * 60 * 60 * 24)
            );


        if (
            dias <=
            Number(
                receta.diasAviso || 0
            )
        ) {

            return {

                clase:
                    "alerta",

                texto:
                    `Vence en ${dias} día(s)`

            };

        }


        return {

            clase:
                "normal",

            texto:
                `Vigente - ${dias} día(s) restantes`

        };

    }


    function renderizarRecetas() {

        if (!listaRecetas) {

            return;

        }


        if (
            recetas.length === 0
        ) {

            listaRecetas.innerHTML = `

                <div class="vacio">

                    <div class="vacio-icon">
                        📝
                    </div>

                    <h3>
                        No hay recetas registradas
                    </h3>

                    <p>
                        Las recetas aparecerán aquí.
                    </p>

                </div>

            `;

            return;

        }


        listaRecetas.innerHTML =
            recetas
                .map(
                    receta => {

                        const estado =
                            obtenerEstadoReceta(
                                receta
                            );


                        return `

                            <div class="receta">

                                <div class="receta-header">

                                    <div>

                                        <h3>
                                            📝
                                            ${escaparHTML(
                                                receta.medicamento
                                            )}
                                        </h3>

                                        <span
                                            class="receta-numero"
                                        >
                                            Receta:
                                            ${escaparHTML(
                                                receta.numero ||
                                                "Sin número"
                                            )}
                                        </span>

                                    </div>


                                    <button
                                        type="button"
                                        class="btn btn-danger btn-eliminar-receta"
                                        data-id="${receta.id}"
                                    >
                                        🗑️
                                    </button>

                                </div>


                                <div class="receta-datos">

                                    <div>

                                        <strong>
                                            👨‍⚕️ Médico
                                        </strong>

                                        <span>
                                            ${escaparHTML(
                                                receta.medico ||
                                                "No registrado"
                                            )}
                                        </span>

                                    </div>


                                    <div>

                                        <strong>
                                            📅 Fecha
                                        </strong>

                                        <span>
                                            ${formatearFecha(
                                                receta.fecha
                                            )}
                                        </span>

                                    </div>


                                    <div>

                                        <strong>
                                            ⏳ Vencimiento
                                        </strong>

                                        <span>
                                            ${formatearFecha(
                                                receta.vencimiento
                                            )}
                                        </span>

                                    </div>

                                </div>


                                <div
                                    class="receta-estado
                                    ${estado.clase}"
                                >

                                    ${estado.texto}

                                </div>


                                <div class="receta-footer">

                                    <span>
                                        🔔 Aviso:
                                        ${receta.diasAviso}
                                        día(s) antes
                                    </span>

                                    <span>
                                        Alertas:
                                        ${receta.alertas || 0}
                                    </span>

                                </div>

                            </div>

                        `;

                    }
                )
                .join("");


        document
            .querySelectorAll(
                ".btn-eliminar-receta"
            )
            .forEach(
                boton => {

                    boton.addEventListener(
                        "click",
                        () => {

                            const id =
                                boton.dataset.id;


                            const confirmar =
                                confirm(
                                    "¿Deseas eliminar esta receta?"
                                );


                            if (!confirmar) {

                                return;

                            }


                            recetas =
                                recetas.filter(
                                    receta =>
                                        receta.id !==
                                        id
                                );


                            guardarLocalStorage(
                                "medControl_recetas",
                                recetas
                            );


                            renderizarRecetas();

                        }
                    );

                }
            );

    }


    /* =========================================================
       ALERTAS DE RECETAS
    ========================================================= */

    function comprobarAlertasRecetas() {

        let cambios =
            false;


        const hoy =
            fechaLocalISO();


        recetas.forEach(
            receta => {

                const estado =
                    obtenerEstadoReceta(
                        receta
                    );


                if (
                    estado.clase ===
                    "alerta"
                ) {

                    if (
                        receta.ultimaAlerta !==
                        hoy
                    ) {

                        receta.alertas =
                            Number(
                                receta.alertas ||
                                0
                            ) + 1;


                        receta.ultimaAlerta =
                            hoy;


                        cambios =
                            true;


                        if (
                            "Notification" in
                            window &&
                            Notification.permission ===
                            "granted"
                        ) {

                            new Notification(
                                "MedControl - Receta",
                                {

                                    body:
                                        `La receta de ${receta.medicamento} está próxima a vencer.`

                                }
                            );

                        }

                    }

                }

            }
        );


        if (cambios) {

            guardarLocalStorage(
                "medControl_recetas",
                recetas
            );


            renderizarRecetas();

        }

    }


    /* =========================================================
       NOTIFICACIONES
    ========================================================= */

    if (btnNotificaciones) {

        btnNotificaciones.addEventListener(
            "click",
            async () => {

                if (
                    !("Notification" in window)
                ) {

                    alert(
                        "Tu navegador no permite notificaciones."
                    );

                    return;

                }


                try {

                    const permiso =
                        await Notification
                            .requestPermission();


                    if (
                        permiso ===
                        "granted"
                    ) {

                        btnNotificaciones.textContent =
                            "🔔 Notificaciones activadas";


                        alert(
                            "Las notificaciones fueron activadas correctamente."
                        );

                    } else {

                        alert(
                            "Las notificaciones no fueron activadas."
                        );

                    }

                } catch (error) {

                    console.error(
                        error
                    );

                }

            }
        );

    }


    /* =========================================================
       ACTUALIZACIÓN AUTOMÁTICA
    ========================================================= */

    function actualizarSistema() {

        actualizarHistorialCumplimiento();

        actualizarProximaToma();

        if (
            medicacionPendienteModal &&
            medicacionPendienteModal.fechaHora
        ) {

            actualizarContador(
                medicacionPendienteModal.fechaHora
            );

        }

        comprobarAlertasRecetas();

    }


    /* =========================================================
       INICIALIZACIÓN
    ========================================================= */

    cargarPaciente();

    cargarTratamiento();

    actualizarResumenClinico();


    if (
        horariosContainer &&
        horariosContainer.children.length === 0
    ) {

        generarHorarios();

    }


    renderizarMedicamentos();

    renderizarHistorial();

    renderizarCumplimiento();

    renderizarRecetas();

    actualizarHistorialCumplimiento();

    actualizarProximaToma();

    comprobarAlertasRecetas();


    /*
     * Actualizamos el sistema cada segundo
     * para el contador y los recordatorios.
     */

    setInterval(
        actualizarSistema,
        1000
    );

});