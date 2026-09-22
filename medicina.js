document.addEventListener("DOMContentLoaded", () => {

    // ==========================================
    // 1. FUNCIONES DE localStorage
    // ==========================================

    const obtenerStorage = (clave, valorDefecto) => {
        try {
            const data = localStorage.getItem(clave);
            return data ? JSON.parse(data) : valorDefecto;
        } catch (error) {
            console.error("Error al leer " + clave + ":", error);
            return valorDefecto;
        }
    };

    const guardarStorage = (clave, valor) => {
        try {
            localStorage.setItem(clave, JSON.stringify(valor));
        } catch (error) {
            console.error("Error al guardar " + clave + ":", error);
        }
    };


    // ==========================================
    // 2. DATOS PRINCIPALES
    // ==========================================

    let paciente = obtenerStorage(
        "medControl_paciente",
        {
            nombre: "",
            edad: ""
        }
    );

    let tratamiento = obtenerStorage(
        "medControl_tratamiento",
        {
            historial: "",
            alergias: "",
            actuales: "",
            pasadas: "",
            pruebas: "",
            observaciones: ""
        }
    );

    let medicamentos = obtenerStorage(
        "medControl_medicamentos",
        []
    );

    let historialTomas = obtenerStorage(
        "medControl_historial",
        []
    );

    // NUEVO: historial de cumplimiento
    let historialCumplimiento = obtenerStorage(
        "medControl_cumplimiento",
        []
    );

    let medicacionPendienteModal = null;


    // ==========================================
    // 3. REFERENCIA RÁPIDA AL DOM
    // ==========================================

    const $ = (id) => document.getElementById(id);


    // Paciente
    const btnNotificaciones = $("btnNotificaciones");
    const formPaciente = $("formPaciente");
    const nombrePacienteInput = $("nombrePaciente");
    const edadPacienteInput = $("edadPaciente");
    const btnGuardarPaciente = $("btnGuardarPaciente");


    // Tratamiento
    const formTratamiento = $("formTratamiento");
    const historialClinicoInput = $("historialClinico");
    const alergiasInput = $("alergias");
    const medicacionesActualesInput = $("medicacionesActuales");
    const medicacionesPasadasInput = $("medicacionesPasadas");
    const resultadosPruebasInput = $("resultadosPruebas");
    const observacionesInput = $("observaciones");
    const btnLimpiarTratamiento = $("btnLimpiarTratamiento");


    // Resumen
    const resumenClinicoContainer = $("resumenClinico");


    // Próxima toma
    const proximaMedicamento = $("proximaMedicamento");
    const proximaHora = $("proximaHora");
    const contadorElem = $("contador");


    // Medicamentos
    const formMedicamento = $("formMedicamento");
    const frecuenciaSelect = $("frecuencia");
    const horariosContainer = $("horariosContainer");
    const listaMedicamentos = $("listaMedicamentos");
    const cantidadMedicamentos = $("cantidadMedicamentos");


    // Historial normal
    const historialContainer = $("historial");


    // Modal
    const modalRecordatorio = $("modalRecordatorio");
    const recordatorioTexto = $("recordatorioTexto");
    const btnPosponer = $("btnPosponer");
    const btnTomado = $("btnTomado");


    // Historial de cumplimiento
    const resumenCumplimiento = $("resumenCumplimiento");
    const historialCumplimientoContainer = $("historialCumplimiento");
    const porcentajeCumplimiento = $("porcentajeCumplimiento");


    // ==========================================
    // 4. PACIENTE
    // ==========================================

    if (btnGuardarPaciente) {

        btnGuardarPaciente.addEventListener("click", () => {

            paciente.nombre = nombrePacienteInput
                ? nombrePacienteInput.value.trim()
                : "";

            paciente.edad = edadPacienteInput
                ? edadPacienteInput.value.trim()
                : "";

            guardarStorage(
                "medControl_paciente",
                paciente
            );

            renderizarResumenClinico();

            if (nombrePacienteInput) {
                nombrePacienteInput.value = "";
            }

            if (edadPacienteInput) {
                edadPacienteInput.value = "";
            }

            if (formPaciente) {
                formPaciente.reset();
            }

            alert("Información del paciente guardada correctamente.");
        });
    }


    // ==========================================
    // 5. TRATAMIENTO CLÍNICO
    // ==========================================

    if (formTratamiento) {

        formTratamiento.addEventListener("submit", (e) => {

            e.preventDefault();

            tratamiento = {
                historial: historialClinicoInput
                    ? historialClinicoInput.value.trim()
                    : "",

                alergias: alergiasInput
                    ? alergiasInput.value.trim()
                    : "",

                actuales: medicacionesActualesInput
                    ? medicacionesActualesInput.value.trim()
                    : "",

                pasadas: medicacionesPasadasInput
                    ? medicacionesPasadasInput.value.trim()
                    : "",

                pruebas: resultadosPruebasInput
                    ? resultadosPruebasInput.value.trim()
                    : "",

                observaciones: observacionesInput
                    ? observacionesInput.value.trim()
                    : ""
            };

            guardarStorage(
                "medControl_tratamiento",
                tratamiento
            );

            renderizarResumenClinico();

            formTratamiento.reset();

            alert("Registro de tratamiento guardado correctamente.");
        });
    }


    if (btnLimpiarTratamiento) {

        btnLimpiarTratamiento.addEventListener("click", () => {

            if (formTratamiento) {
                formTratamiento.reset();
            }

            tratamiento = {
                historial: "",
                alergias: "",
                actuales: "",
                pasadas: "",
                pruebas: "",
                observaciones: ""
            };

            guardarStorage(
                "medControl_tratamiento",
                tratamiento
            );

            renderizarResumenClinico();
        });
    }


    // ==========================================
    // 6. RESUMEN CLÍNICO
    // ==========================================

    const renderizarResumenClinico = () => {

        if (!resumenClinicoContainer) {
            return;
        }

        const tienePaciente =
            paciente.nombre ||
            paciente.edad;

        const tieneTratamiento =
            Object.values(tratamiento).some(
                valor => valor && valor.trim() !== ""
            );

        if (!tienePaciente && !tieneTratamiento) {

            resumenClinicoContainer.innerHTML = `
                <div class="vacio">
                    <div class="vacio-icon">🏥</div>
                    <h3>No hay información clínica registrada</h3>
                    <p>Completa el registro de tratamiento para visualizar la información.</p>
                </div>
            `;

            return;
        }


        let html = "";


        if (tienePaciente) {

            html += `
                <div class="resumen-item resumen-completo">
                    <h3>👤 Datos del Paciente</h3>

                    <p>
                        <strong>Nombre:</strong>
                        ${paciente.nombre || "No especificado"}

                        |

                        <strong>Edad:</strong>
                        ${
                            paciente.edad
                                ? paciente.edad + " años"
                                : "No especificada"
                        }
                    </p>
                </div>
            `;
        }


        if (tratamiento.historial) {

            html += `
                <div class="resumen-item">
                    <h3>📋 Historial Clínico</h3>
                    <p>${tratamiento.historial}</p>
                </div>
            `;
        }


        if (tratamiento.alergias) {

            html += `
                <div class="resumen-item">
                    <h3>⚠️ Alergias</h3>
                    <p>${tratamiento.alergias}</p>
                </div>
            `;
        }


        if (tratamiento.actuales) {

            html += `
                <div class="resumen-item">
                    <h3>💊 Medicaciones Actuales</h3>
                    <p>${tratamiento.actuales}</p>
                </div>
            `;
        }


        if (tratamiento.pasadas) {

            html += `
                <div class="resumen-item">
                    <h3>💊 Medicaciones Pasadas</h3>
                    <p>${tratamiento.pasadas}</p>
                </div>
            `;
        }


        if (tratamiento.pruebas) {

            html += `
                <div class="resumen-item">
                    <h3>🧪 Resultados de Pruebas</h3>
                    <p>${tratamiento.pruebas}</p>
                </div>
            `;
        }


        if (tratamiento.observaciones) {

            html += `
                <div class="resumen-item resumen-completo">
                    <h3>📝 Observaciones</h3>
                    <p>${tratamiento.observaciones}</p>
                </div>
            `;
        }


        resumenClinicoContainer.innerHTML = html;
    };


    // ==========================================
    // 7. CREAR HORARIOS SEGÚN FRECUENCIA
    // ==========================================

    if (frecuenciaSelect && horariosContainer) {

        frecuenciaSelect.addEventListener("change", (e) => {

            const valor = e.target.value;

            horariosContainer.innerHTML = "";

            if (!valor) {
                return;
            }


            let cantidadCampos = 1;


            if (valor === "2") {
                cantidadCampos = 2;
            }

            else if (valor === "3") {
                cantidadCampos = 3;
            }

            else if (valor === "4") {
                cantidadCampos = 4;
            }


            for (let i = 0; i < cantidadCampos; i++) {

                const div = document.createElement("div");

                div.className = "horario-item";

                div.innerHTML = `
                    <label>
                        Hora de toma
                        ${
                            cantidadCampos > 1
                                ? i + 1
                                : ""
                        }
                    </label>

                    <input
                        type="time"
                        class="horaMedicamento"
                        required
                    >
                `;

                horariosContainer.appendChild(div);
            }
        });
    }


    // ==========================================
    // 8. AGREGAR MEDICAMENTO
    // ==========================================

    if (formMedicamento) {

        formMedicamento.addEventListener("submit", (e) => {

            e.preventDefault();


            const horasInputs =
                document.querySelectorAll(".horaMedicamento");


            const horas = Array.from(horasInputs)
                .map(input => input.value)
                .filter(valor => valor !== "");


            if (horas.length === 0) {

                alert(
                    "Por favor, ingresa al menos una hora para la toma."
                );

                return;
            }


            const nombreInput = $("nombreMedicamento");
            const dosisInput = $("dosis");
            const fechaInicioInput = $("fechaInicio");
            const fechaFinInput = $("fechaFin");
            const actividadInput = $("actividad");


            const nombreMed = nombreInput
                ? nombreInput.value.trim()
                : "";

            const dosisMed = dosisInput
                ? dosisInput.value.trim()
                : "";

            const fechaInicioMed = fechaInicioInput
                ? fechaInicioInput.value
                : "";

            const fechaFinMed = fechaFinInput
                ? fechaFinInput.value
                : "";

            const actividadMed = actividadInput
                ? actividadInput.value
                : "Sin actividad";


            if (!nombreMed) {

                alert("Ingresa el nombre del medicamento.");

                return;
            }


            if (!fechaInicioMed) {

                alert("Ingresa la fecha de inicio del tratamiento.");

                return;
            }


            if (
                fechaFinMed &&
                fechaFinMed < fechaInicioMed
            ) {

                alert(
                    "La fecha de finalización no puede ser anterior a la fecha de inicio."
                );

                return;
            }


            const nuevoMedicamento = {

                id: Date.now(),

                nombre: nombreMed,

                dosis: dosisMed,

                frecuencia:
                    frecuenciaSelect &&
                    frecuenciaSelect.selectedIndex >= 0
                        ? frecuenciaSelect.options[
                            frecuenciaSelect.selectedIndex
                        ].text
                        : "",

                fechaInicio: fechaInicioMed,

                fechaFin: fechaFinMed,

                actividad: actividadMed,

                horas: horas
            };


            medicamentos.push(nuevoMedicamento);


            guardarStorage(
                "medControl_medicamentos",
                medicamentos
            );


            formMedicamento.reset();


            horariosContainer.innerHTML = `
                <div class="horario-item">
                    <label>Hora de toma</label>

                    <input
                        type="time"
                        class="horaMedicamento"
                        required
                    >
                </div>
            `;


            renderizarMedicamentos();

            actualizarProximaToma();

            actualizarHistorialCumplimiento();
        });
    }


    // ==========================================
    // 9. MOSTRAR MEDICAMENTOS
    // ==========================================

    const renderizarMedicamentos = () => {

        if (cantidadMedicamentos) {

            cantidadMedicamentos.textContent =
                medicamentos.length;
        }


        if (!listaMedicamentos) {
            return;
        }


        if (medicamentos.length === 0) {

            listaMedicamentos.innerHTML = `
                <div class="vacio">
                    <div class="vacio-icon">💊</div>
                    <h3>No hay tratamientos</h3>
                    <p>Agrega un medicamento para comenzar.</p>
                </div>
            `;

            return;
        }


        listaMedicamentos.innerHTML = "";


        medicamentos.forEach(med => {

            const card =
                document.createElement("div");


            card.className = "medicamento";


            const nombre =
                med.nombre || "Medicamento";


            const dosis =
                med.dosis || "Sin dosis";


            const horas =
                Array.isArray(med.horas)
                    ? med.horas
                    : [];


            card.innerHTML = `

                <div class="medicamento-header">

                    <div>

                        <h3>${nombre}</h3>

                        <div class="dosis">
                            ${dosis}
                        </div>

                    </div>

                </div>


                ${
                    med.actividad &&
                    med.actividad !== "Sin actividad"

                    ? `
                        <span class="actividad">
                            ${med.actividad}
                        </span>
                    `

                    : ""
                }


                <div class="horarios-lista">

                    ${
                        horas.length > 0

                        ? horas
                            .map(
                                hora =>
                                    `<span class="hora">
                                        ⏰ ${hora}
                                    </span>`
                            )
                            .join("")

                        : `
                            <span class="hora">
                                Sin horario
                            </span>
                        `
                    }

                </div>


                <div class="medicamento-footer">

                    <small>
                        Desde:
                        ${med.fechaInicio || "No definida"}

                        ${
                            med.fechaFin
                                ? " | Hasta: " + med.fechaFin
                                : ""
                        }
                    </small>


                    <button
                        class="btn-eliminar"
                        data-id="${med.id}"
                    >
                        🗑️ Eliminar
                    </button>

                </div>

            `;


            listaMedicamentos.appendChild(card);
        });
    };


    // ==========================================
    // 10. ELIMINAR MEDICAMENTO
    // ==========================================

    if (listaMedicamentos) {

        listaMedicamentos.addEventListener("click", (e) => {

            const boton =
                e.target.closest(".btn-eliminar");


            if (!boton) {
                return;
            }


            const id =
                Number(
                    boton.getAttribute("data-id")
                );


            medicamentos =
                medicamentos.filter(
                    med => Number(med.id) !== id
                );


            guardarStorage(
                "medControl_medicamentos",
                medicamentos
            );


            renderizarMedicamentos();

            actualizarProximaToma();

            actualizarHistorialCumplimiento();
        });
    }


    // ==========================================
    // 11. FUNCIONES PARA FECHAS
    // ==========================================

    const obtenerFechaLocal = (fecha) => {

        const year = fecha.getFullYear();

        const month =
            String(fecha.getMonth() + 1)
                .padStart(2, "0");

        const day =
            String(fecha.getDate())
                .padStart(2, "0");


        return `${year}-${month}-${day}`;
    };


    const crearFecha = (fechaTexto, horaTexto) => {

        if (!fechaTexto || !horaTexto) {
            return null;
        }


        const partesFecha =
            fechaTexto.split("-");


        const partesHora =
            horaTexto.split(":");


        if (
            partesFecha.length !== 3 ||
            partesHora.length < 2
        ) {
            return null;
        }


        const fecha = new Date(

            Number(partesFecha[0]),

            Number(partesFecha[1]) - 1,

            Number(partesFecha[2]),

            Number(partesHora[0]),

            Number(partesHora[1]),

            0,

            0
        );


        if (isNaN(fecha.getTime())) {
            return null;
        }


        return fecha;
    };


    const sumarDias = (fecha, dias) => {

        const nuevaFecha =
            new Date(fecha.getTime());


        nuevaFecha.setDate(
            nuevaFecha.getDate() + dias
        );


        return nuevaFecha;
    };


    // ==========================================
    // 12. GENERAR TOMAS PROGRAMADAS
    // ==========================================

    const obtenerTomasProgramadas = () => {

        const resultado = [];

        const ahora = new Date();


        medicamentos.forEach(med => {

            if (
                !med ||
                !med.fechaInicio ||
                !Array.isArray(med.horas)
            ) {
                return;
            }


            let fechaActual =
                crearFecha(
                    med.fechaInicio,
                    "00:00"
                );


            if (!fechaActual) {
                return;
            }


            let fechaFinal;


            if (med.fechaFin) {

                fechaFinal =
                    crearFecha(
                        med.fechaFin,
                        "23:59"
                    );

            } else {

                fechaFinal =
                    new Date(ahora);

                fechaFinal.setHours(
                    23,
                    59,
                    59,
                    999
                );
            }


            if (
                !fechaFinal ||
                fechaActual > fechaFinal
            ) {
                return;
            }


            // No revisar días posteriores a hoy
            const limite =
                fechaFinal < ahora
                    ? fechaFinal
                    : ahora;


            while (fechaActual <= limite) {

                const fechaTexto =
                    obtenerFechaLocal(
                        fechaActual
                    );


                med.horas.forEach(hora => {

                    const fechaHora =
                        crearFecha(
                            fechaTexto,
                            hora
                        );


                    if (!fechaHora) {
                        return;
                    }


                    if (fechaHora <= ahora) {

                        resultado.push({

                            clave:
                                String(med.id) +
                                "_" +
                                fechaTexto +
                                "_" +
                                hora,

                            medicamentoId:
                                med.id,

                            nombre:
                                med.nombre || "Medicamento",

                            dosis:
                                med.dosis || "",

                            fecha:
                                fechaTexto,

                            hora:
                                hora,

                            fechaHora:
                                fechaHora
                        });
                    }
                });


                fechaActual =
                    sumarDias(
                        fechaActual,
                        1
                    );
            }
        });


        return resultado;
    };


    // ==========================================
    // 13. ACTUALIZAR HISTORIAL DE CUMPLIMIENTO
    // ==========================================

    const actualizarHistorialCumplimiento = () => {

        const tomasProgramadas =
            obtenerTomasProgramadas();


        tomasProgramadas.forEach(toma => {

            const indice =
                historialCumplimiento.findIndex(
                    registro =>
                        registro.clave === toma.clave
                );


            if (indice === -1) {

                historialCumplimiento.push({

                    clave: toma.clave,

                    medicamentoId:
                        toma.medicamentoId,

                    nombre:
                        toma.nombre,

                    dosis:
                        toma.dosis,

                    fecha:
                        toma.fecha,

                    hora:
                        toma.hora,

                    estado: "omitido",

                    fechaHoraTomada: ""
                });

            }
        });


        guardarStorage(
            "medControl_cumplimiento",
            historialCumplimiento
        );


        renderizarCumplimiento();
    };


    // ==========================================
    // 14. REGISTRAR UNA TOMA COMO TOMADA
    // ==========================================

    const registrarTomaCumplida = () => {

        if (!medicacionPendienteModal) {
            return;
        }


        const med =
            medicacionPendienteModal;


        const fechaProgramada =
            med.fechaProgramada ||
            obtenerFechaLocal(new Date());


        const horaProgramada =
            med.horaToma || "";


        const clave =
            String(med.id) +
            "_" +
            fechaProgramada +
            "_" +
            horaProgramada;


        const ahora =
            new Date();


        const indice =
            historialCumplimiento.findIndex(
                registro =>
                    registro.clave === clave
            );


        const registroCumplimiento = {

            clave: clave,

            medicamentoId:
                med.id,

            nombre:
                med.nombre || "Medicamento",

            dosis:
                med.dosis || "",

            fecha:
                fechaProgramada,

            hora:
                horaProgramada,

            estado: "tomado",

            fechaHoraTomada:
                ahora.toLocaleString()
        };


        if (indice === -1) {

            historialCumplimiento.push(
                registroCumplimiento
            );

        } else {

            historialCumplimiento[indice] =
                {
                    ...historialCumplimiento[indice],
                    ...registroCumplimiento
                };
        }


        guardarStorage(
            "medControl_cumplimiento",
            historialCumplimiento
        );
    };


    // ==========================================
    // 15. HISTORIAL DE CUMPLIMIENTO
    // ==========================================

    const renderizarCumplimiento = () => {

        if (
            !resumenCumplimiento &&
            !historialCumplimientoContainer &&
            !porcentajeCumplimiento
        ) {
            return;
        }


        // Actualiza primero los estados
        const tomasProgramadas =
            obtenerTomasProgramadas();


        tomasProgramadas.forEach(toma => {

            const indice =
                historialCumplimiento.findIndex(
                    registro =>
                        registro.clave === toma.clave
                );


            if (indice === -1) {

                historialCumplimiento.push({

                    clave: toma.clave,

                    medicamentoId:
                        toma.medicamentoId,

                    nombre:
                        toma.nombre,

                    dosis:
                        toma.dosis,

                    fecha:
                        toma.fecha,

                    hora:
                        toma.hora,

                    estado: "omitido",

                    fechaHoraTomada: ""
                });

            }
        });


        guardarStorage(
            "medControl_cumplimiento",
            historialCumplimiento
        );


        const registros =
            historialCumplimiento;


        const tomadas =
            registros.filter(
                registro =>
                    registro.estado === "tomado"
            ).length;


        const omitidas =
            registros.filter(
                registro =>
                    registro.estado === "omitido"
            ).length;


        const pendientes =
            registros.filter(
                registro =>
                    registro.estado === "pendiente"
            ).length;


        const evaluadas =
            tomadas + omitidas;


        let porcentaje = 0;


        if (evaluadas > 0) {

            porcentaje =
                Math.round(
                    (tomadas / evaluadas) * 100
                );
        }


        if (porcentajeCumplimiento) {

            porcentajeCumplimiento.textContent =
                porcentaje + "%";
        }


        if (resumenCumplimiento) {

            resumenCumplimiento.innerHTML = `

                <div class="cumplimiento-stat">

                    <span class="etiqueta">
                        Programadas
                    </span>

                    <span class="valor">
                        ${registros.length}
                    </span>

                </div>


                <div class="cumplimiento-stat">

                    <span class="etiqueta">
                        Tomadas
                    </span>

                    <span class="valor">
                        ${tomadas}
                    </span>

                </div>


                <div class="cumplimiento-stat">

                    <span class="etiqueta">
                        Omitidas
                    </span>

                    <span class="valor">
                        ${omitidas}
                    </span>

                </div>


                <div class="cumplimiento-stat">

                    <span class="etiqueta">
                        Pendientes
                    </span>

                    <span class="valor">
                        ${pendientes}
                    </span>

                </div>

            `;
        }


        if (!historialCumplimientoContainer) {
            return;
        }


        if (registros.length === 0) {

            historialCumplimientoContainer.innerHTML = `

                <div class="vacio">

                    <div class="vacio-icon">
                        📈
                    </div>

                    <h3>
                        No hay historial de cumplimiento
                    </h3>

                    <p>
                        El historial aparecerá cuando existan
                        tomas programadas durante el tratamiento.
                    </p>

                </div>

            `;

            return;
        }


        // ======================================
        // CUMPLIMIENTO POR MEDICAMENTO
        // ======================================

        const grupos = {};


        registros.forEach(registro => {

            const id =
                String(registro.medicamentoId);


            if (!grupos[id]) {

                grupos[id] = {

                    nombre:
                        registro.nombre,

                    dosis:
                        registro.dosis,

                    registros: []
                };
            }


            grupos[id].registros.push(
                registro
            );
        });


        let html = "";


        Object.values(grupos).forEach(grupo => {

            const registrosMed =
                grupo.registros;


            const tomadasMed =
                registrosMed.filter(
                    registro =>
                        registro.estado === "tomado"
                ).length;


            const omitidasMed =
                registrosMed.filter(
                    registro =>
                        registro.estado === "omitido"
                ).length;


            const pendientesMed =
                registrosMed.filter(
                    registro =>
                        registro.estado === "pendiente"
                ).length;


            const evaluadasMed =
                tomadasMed + omitidasMed;


            let porcentajeMed = 0;


            if (evaluadasMed > 0) {

                porcentajeMed =
                    Math.round(
                        (tomadasMed /
                            evaluadasMed) *
                        100
                    );
            }


            html += `

                <div class="cumplimiento-medicamento">

                    <div class="cumplimiento-medicamento-header">

                        <div>

                            <h3>
                                💊 ${grupo.nombre}
                            </h3>

                            <p>
                                ${grupo.dosis || "Sin dosis"}
                            </p>

                        </div>

                        <strong>
                            ${porcentajeMed}%
                        </strong>

                    </div>


                    <div class="barra-cumplimiento">

                        <span
                            style="width:${porcentajeMed}%"
                        ></span>

                    </div>


                    <div class="cumplimiento-detalles">

                        <div class="cumplimiento-detalle">

                            <span>
                                Programadas
                            </span>

                            <strong>
                                ${registrosMed.length}
                            </strong>

                        </div>


                        <div class="cumplimiento-detalle">

                            <span>
                                Tomadas
                            </span>

                            <strong>
                                ${tomadasMed}
                            </strong>

                        </div>


                        <div class="cumplimiento-detalle">

                            <span>
                                Omitidas
                            </span>

                            <strong>
                                ${omitidasMed}
                            </strong>

                        </div>


                        <div class="cumplimiento-detalle">

                            <span>
                                Pendientes
                            </span>

                            <strong>
                                ${pendientesMed}
                            </strong>

                        </div>

                    </div>

                </div>

            `;
        });


        // ======================================
        // ÚLTIMAS TOMAS
        // ======================================

        const registrosOrdenados =
            [...registros].sort(
                (a, b) => {

                    const fechaA =
                        crearFecha(
                            a.fecha,
                            a.hora
                        );

                    const fechaB =
                        crearFecha(
                            b.fecha,
                            b.hora
                        );


                    return (
                        (fechaB
                            ? fechaB.getTime()
                            : 0) -

                        (fechaA
                            ? fechaA.getTime()
                            : 0)
                    );
                }
            );


        html += `

            <div class="cumplimiento-historial">

                <h3>
                    📋 Detalle de tomas
                </h3>

        `;


        registrosOrdenados.forEach(registro => {

            let textoEstado =
                "Omitido";

            let claseEstado =
                "estado-omitido";


            if (registro.estado === "tomado") {

                textoEstado =
                    "Tomado";

                claseEstado =
                    "estado-tomado";
            }


            if (registro.estado === "pendiente") {

                textoEstado =
                    "Pendiente";

                claseEstado =
                    "estado-pendiente";
            }


            html += `

                <div class="cumplimiento-historial-item">

                    <div>

                        <strong>
                            ${registro.nombre}
                        </strong>

                        <div>
                            ${registro.dosis || ""}
                        </div>

                    </div>


                    <div>

                        ${registro.fecha}
                        <br>

                        ${registro.hora}

                    </div>


                    <span class="${claseEstado}">

                        ${textoEstado}

                    </span>

                </div>

            `;
        });


        html += `</div>`;


        historialCumplimientoContainer.innerHTML =
            html;
    };


    // ==========================================
    // 16. PRÓXIMA TOMA
    // ==========================================

    const actualizarProximaToma = () => {

        if (
            !proximaMedicamento ||
            !proximaHora ||
            !contadorElem
        ) {
            return;
        }


        if (medicamentos.length === 0) {

            proximaMedicamento.textContent =
                "No hay medicamentos programados";

            proximaHora.textContent =
                "Agrega un medicamento para comenzar.";

            contadorElem.textContent =
                "--";

            return;
        }


        const ahora =
            new Date();


        let proximaTomaGlobal =
            null;


        let medicamentoProximo =
            null;


        medicamentos.forEach(med => {

            if (
                !Array.isArray(med.horas) ||
                med.horas.length === 0
            ) {
                return;
            }


            // Comprobar fecha de inicio
            if (med.fechaInicio) {

                const inicio =
                    crearFecha(
                        med.fechaInicio,
                        "00:00"
                    );


                if (
                    inicio &&
                    ahora < inicio
                ) {

                    const primeraHora =
                        med.horas[0];


                    const fechaPrimera =
                        crearFecha(
                            med.fechaInicio,
                            primeraHora
                        );


                    if (
                        fechaPrimera &&
                        (
                            !proximaTomaGlobal ||
                            fechaPrimera <
                            proximaTomaGlobal
                        )
                    ) {

                        proximaTomaGlobal =
                            fechaPrimera;

                        medicamentoProximo = {

                            ...med,

                            horaToma:
                                primeraHora,

                            fechaProgramada:
                                med.fechaInicio
                        };
                    }


                    return;
                }
            }


            // Comprobar fecha final
            if (med.fechaFin) {

                const fin =
                    crearFecha(
                        med.fechaFin,
                        "23:59"
                    );


                if (
                    fin &&
                    ahora > fin
                ) {
                    return;
                }
            }


            med.horas.forEach(horaStr => {

                const partes =
                    horaStr.split(":");


                if (partes.length < 2) {
                    return;
                }


                const horas =
                    parseInt(
                        partes[0],
                        10
                    );


                const minutos =
                    parseInt(
                        partes[1],
                        10
                    );


                if (
                    isNaN(horas) ||
                    isNaN(minutos)
                ) {
                    return;
                }


                let fechaToma =
                    new Date(ahora);


                fechaToma.setHours(
                    horas,
                    minutos,
                    0,
                    0
                );


                if (fechaToma <= ahora) {

                    fechaToma.setDate(
                        fechaToma.getDate() + 1
                    );
                }


                // No superar fecha final
                if (med.fechaFin) {

                    const fechaFin =
                        crearFecha(
                            med.fechaFin,
                            "23:59"
                        );


                    if (
                        fechaFin &&
                        fechaToma > fechaFin
                    ) {
                        return;
                    }
                }


                if (
                    !proximaTomaGlobal ||
                    fechaToma <
                    proximaTomaGlobal
                ) {

                    proximaTomaGlobal =
                        fechaToma;


                    medicamentoProximo = {

                        ...med,

                        horaToma:
                            horaStr,

                        fechaProgramada:
                            obtenerFechaLocal(
                                fechaToma
                            )
                    };
                }
            });
        });


        if (
            medicamentoProximo &&
            proximaTomaGlobal
        ) {

            proximaMedicamento.textContent =
                `${medicamentoProximo.nombre} (${medicamentoProximo.dosis})`;


            proximaHora.textContent =
                `Hora programada: ${medicamentoProximo.horaToma} hs`;


            const diffMs =
                proximaTomaGlobal.getTime() -
                ahora.getTime();


            if (diffMs > 0) {

                const horasFaltantes =
                    Math.floor(
                        diffMs /
                        (1000 * 60 * 60)
                    );


                const minsFaltantes =
                    Math.floor(
                        (
                            diffMs %
                            (1000 * 60 * 60)
                        ) /
                        (1000 * 60)
                    );


                const segsFaltantes =
                    Math.floor(
                        (
                            diffMs %
                            (1000 * 60)
                        ) /
                        1000
                    );


                contadorElem.textContent =
                    `En ${horasFaltantes}h ${minsFaltantes}m ${segsFaltantes}s`;


                // Mostrar recordatorio
                if (
                    diffMs <= 1000 &&
                    modalRecordatorio &&
                    !modalRecordatorio.classList.contains("activo")
                ) {

                    mostrarModalRecordatorio(
                        medicamentoProximo
                    );
                }

            } else {

                contadorElem.textContent =
                    "Es hora de la toma";
            }

        } else {

            proximaMedicamento.textContent =
                "No hay tomas programadas";

            proximaHora.textContent =
                "Revisa las fechas de tus tratamientos.";

            contadorElem.textContent =
                "--";
        }
    };


    // ==========================================
    // 17. MOSTRAR MODAL DE RECORDATORIO
    // ==========================================

    const mostrarModalRecordatorio = (med) => {

        if (
            !modalRecordatorio ||
            !recordatorioTexto
        ) {
            return;
        }


        medicacionPendienteModal =
            med;


        recordatorioTexto.innerHTML = `

            <p>
                Es hora de tomar
                <strong>
                    ${med.nombre}
                </strong>
                (${med.dosis}).
            </p>

            ${
                med.actividad &&
                med.actividad !== "Sin actividad"

                ? `
                    <p>
                        <small>
                            Asociado a:
                            ${med.actividad}
                        </small>
                    </p>
                `

                : ""
            }

        `;


        modalRecordatorio.classList.add(
            "activo"
        );
    };


    // ==========================================
    // 18. BOTÓN "YA LO TOMÉ"
    // ==========================================

    if (btnTomado) {

        btnTomado.addEventListener(
            "click",
            () => {

                if (!medicacionPendienteModal) {
                    return;
                }


                const ahora =
                    new Date();


                // Historial normal
                const registro = {

                    id: Date.now(),

                    medicamentoId:
                        medicacionPendienteModal.id,

                    nombre:
                        medicacionPendienteModal.nombre,

                    dosis:
                        medicacionPendienteModal.dosis,

                    fechaHora:
                        ahora.toLocaleString(),

                    fecha:
                        medicacionPendienteModal.fechaProgramada ||
                        obtenerFechaLocal(ahora),

                    hora:
                        medicacionPendienteModal.horaToma || ""
                };


                historialTomas.unshift(
                    registro
                );


                guardarStorage(
                    "medControl_historial",
                    historialTomas
                );


                // Historial de cumplimiento
                registrarTomaCumplida();


                renderizarHistorial();

                actualizarHistorialCumplimiento();


                if (modalRecordatorio) {

                    modalRecordatorio.classList.remove(
                        "activo"
                    );
                }


                medicacionPendienteModal =
                    null;
            }
        );
    }


    // ==========================================
    // 19. BOTÓN POSPONER
    // ==========================================

    if (btnPosponer) {

        btnPosponer.addEventListener(
            "click",
            () => {

                if (modalRecordatorio) {

                    modalRecordatorio.classList.remove(
                        "activo"
                    );
                }

                medicacionPendienteModal =
                    null;
            }
        );
    }


    // ==========================================
    // 20. HISTORIAL NORMAL DE TOMAS
    // ==========================================

    const renderizarHistorial = () => {

        if (!historialContainer) {
            return;
        }


        if (historialTomas.length === 0) {

            historialContainer.innerHTML = `

                <div class="vacio pequeño">

                    <p>
                        Todavía no hay registros de tomas.
                    </p>

                </div>

            `;

            return;
        }


        historialContainer.innerHTML = "";


        historialTomas.forEach(item => {

            const div =
                document.createElement("div");


            div.className =
                "historial-item";


            div.innerHTML = `

                <div>

                    <span class="historial-medicamento">
                        ${item.nombre || "Medicamento"}
                    </span>

                    ${
                        item.dosis
                            ? `(${item.dosis})`
                            : ""
                    }

                    <div class="historial-hora">
                        ${item.fechaHora || ""}
                    </div>

                </div>


                <span class="estado">
                    Tomado
                </span>

            `;


            historialContainer.appendChild(
                div
            );
        });
    };


    // ==========================================
    // 21. NOTIFICACIONES
    // ==========================================

    if (btnNotificaciones) {

        btnNotificaciones.addEventListener(
            "click",
            () => {

                if (!("Notification" in window)) {

                    alert(
                        "Este navegador no soporta notificaciones del sistema."
                    );

                    return;
                }


                Notification
                    .requestPermission()
                    .then(permission => {

                        if (
                            permission === "granted"
                        ) {

                            new Notification(
                                "MedControl",
                                {
                                    body:
                                        "¡Las notificaciones se activaron correctamente!",
                                    icon:
                                        "💊"
                                }
                            );

                        } else {

                            alert(
                                "Permiso de notificaciones denegado o no otorgado."
                            );
                        }
                    })

                    .catch(error => {

                        console.error(
                            "Error con las notificaciones:",
                            error
                        );

                    });
            }
        );
    }


    // ==========================================
    // 22. ACTUALIZACIÓN AUTOMÁTICA DEL CUMPLIMIENTO
    // ==========================================

    setInterval(() => {

        actualizarProximaToma();

        actualizarHistorialCumplimiento();

    }, 1000);


    // ==========================================
    // 23. INICIALIZACIÓN
    // ==========================================

    const inicializar = () => {

        renderizarResumenClinico();

        renderizarMedicamentos();

        renderizarHistorial();

        actualizarProximaToma();

        actualizarHistorialCumplimiento();
    };


    inicializar();

});