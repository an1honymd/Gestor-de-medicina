document.addEventListener("DOMContentLoaded", () => {
    // ==========================================
    // 1. ESTADO Y PERSISTENCIA (localStorage)
    // ==========================================
    const obtenerStorage = (clave, valorDefecto) => {
        try {
            const data = localStorage.getItem(clave);
            return data ? JSON.parse(data) : valorDefecto;
        } catch (e) {
            console.error(`Error al leer ${clave} de localStorage:`, e);
            return valorDefecto;
        }
    };

    const guardarStorage = (clave, valor) => {
        try {
            localStorage.setItem(clave, JSON.stringify(valor));
        } catch (e) {
            console.error(`Error al guardar ${clave} en localStorage:`, e);
        }
    };

    let paciente = obtenerStorage("medControl_paciente", { nombre: "", edad: "" });
    let tratamiento = obtenerStorage("medControl_tratamiento", {
        historial: "", alergias: "", actuales: "", pasadas: "", pruebas: "", observaciones: ""
    });
    let medicamentos = obtenerStorage("medControl_medicamentos", []);
    let historialTomas = obtenerStorage("medControl_historial", []);
    let medicacionPendienteModal = null;

    // ==========================================
    // 2. REFERENCIAS AL DOM
    // ==========================================
    const $ = (id) => document.getElementById(id);

    const btnNotificaciones = $("btnNotificaciones");
    const formPaciente = $("formPaciente"); // Si los inputs de paciente están en un form
    const nombrePacienteInput = $("nombrePaciente");
    const edadPacienteInput = $("edadPaciente");
    const btnGuardarPaciente = $("btnGuardarPaciente");

    const formTratamiento = $("formTratamiento");
    const historialClinicoInput = $("historialClinico");
    const alergiasInput = $("alergias");
    const medicacionesActualesInput = $("medicacionesActuales");
    const medicacionesPasadasInput = $("medicacionesPasadas");
    const resultadosPruebasInput = $("resultadosPruebas");
    const observacionesInput = $("observaciones");
    const btnLimpiarTratamiento = $("btnLimpiarTratamiento");

    const resumenClinicoContainer = $("resumenClinico");
    const proximaMedicamento = $("proximaMedicamento");
    const proximaHora = $("proximaHora");
    const contadorElem = $("contador");

    const formMedicamento = $("formMedicamento");
    const frecuenciaSelect = $("frecuencia");
    const horariosContainer = $("horariosContainer");
    const listaMedicamentos = $("listaMedicamentos");
    const cantidadMedicamentos = $("cantidadMedicamentos");

    const historialContainer = $("historial");
    const modalRecordatorio = $("modalRecordatorio");
    const recordatorioTexto = $("recordatorioTexto");
    const btnPosponer = $("btnPosponer");
    const btnTomado = $("btnTomado");

    // ==========================================
    // 3. DATOS DEL PACIENTE (CON AUTOLIMPIEZA)
    // ==========================================
    const cargarDatosPaciente = () => {
        // Se mantiene la información cargada internamente
    };

    if (btnGuardarPaciente) {
        btnGuardarPaciente.addEventListener("click", () => {
            paciente.nombre = nombrePacienteInput ? nombrePacienteInput.value.trim() : "";
            paciente.edad = edadPacienteInput ? edadPacienteInput.value.trim() : "";
            guardarStorage("medControl_paciente", paciente);
            renderizarResumenClinico();
            
            // Limpia automáticamente los campos del paciente
            if (nombrePacienteInput) nombrePacienteInput.value = "";
            if (edadPacienteInput) edadPacienteInput.value = "";
            if (formPaciente) formPaciente.reset();

            alert("Información del paciente guardada correctamente.");
        });
    }

    // ==========================================
    // 4. REGISTRO DE TRATAMIENTO Y RESUMEN (CON AUTOLIMPIEZA)
    // ==========================================
    const cargarDatosTratamiento = () => {
        // Se mantiene la información guardada en el estado
    };

    if (formTratamiento) {
        formTratamiento.addEventListener("submit", (e) => {
            e.preventDefault();
            tratamiento = {
                historial: historialClinicoInput ? historialClinicoInput.value.trim() : "",
                alergias: alergiasInput ? alergiasInput.value.trim() : "",
                actuales: medicacionesActualesInput ? medicacionesActualesInput.value.trim() : "",
                pasadas: medicacionesPasadasInput ? medicacionesPasadasInput.value.trim() : "",
                pruebas: resultadosPruebasInput ? resultadosPruebasInput.value.trim() : "",
                observaciones: observacionesInput ? observacionesInput.value.trim() : ""
            };
            guardarStorage("medControl_tratamiento", tratamiento);
            renderizarResumenClinico();
            
            // Limpia automáticamente el formulario de tratamiento
            formTratamiento.reset();

            alert("Registro de tratamiento guardado correctamente.");
        });
    }

    if (btnLimpiarTratamiento) {
        btnLimpiarTratamiento.addEventListener("click", () => {
            if (formTratamiento) formTratamiento.reset();
            tratamiento = { historial: "", alergias: "", actuales: "", pasadas: "", pruebas: "", observaciones: "" };
            guardarStorage("medControl_tratamiento", tratamiento);
            renderizarResumenClinico();
        });
    }

    const renderizarResumenClinico = () => {
        if (!resumenClinicoContainer) return;

        const tienePaciente = Boolean(paciente.nombre || paciente.edad);
        const tieneTratamiento = Object.values(tratamiento).some(val => val && val.trim() !== "");

        if (!tienePaciente && !tieneTratamiento) {
            resumenClinicoContainer.innerHTML = `
                <div class="vacio">
                    <div class="vacio-icon">🏥</div>
                    <h3>No hay información clínica registrada</h3>
                    <p>Completa el registro de tratamiento para visualizar la información.</p>
                </div>`;
            return;
        }

        let html = "";
        if (tienePaciente) {
            html += `
            <div class="resumen-item resumen-completo">
                <h3>👤 Datos del Paciente</h3>
                <p><strong>Nombre:</strong> ${paciente.nombre || 'No especificado'} | <strong>Edad:</strong> ${paciente.edad ? paciente.edad + ' años' : 'No especificada'}</p>
            </div>`;
        }
        if (tratamiento.historial) html += `<div class="resumen-item"><h3>📋 Historial Clínico</h3><p>${tratamiento.historial}</p></div>`;
        if (tratamiento.alergias) html += `<div class="resumen-item"><h3>⚠️ Alergias</h3><p>${tratamiento.alergias}</p></div>`;
        if (tratamiento.actuales) html += `<div class="resumen-item"><h3>💊 Medicaciones Actuales</h3><p>${tratamiento.actuales}</p></div>`;
        if (tratamiento.pasadas) html += `<div class="resumen-item"><h3>💊 Medicaciones Pasadas</h3><p>${tratamiento.pasadas}</p></div>`;
        if (tratamiento.pruebas) html += `<div class="resumen-item"><h3>🧪 Resultados de Pruebas</h3><p>${tratamiento.pruebas}</p></div>`;
        if (tratamiento.observaciones) html += `<div class="resumen-item resumen-completo"><h3>📝 Observaciones</h3><p>${tratamiento.observaciones}</p></div>`;

        resumenClinicoContainer.innerHTML = html;
    };

    // ==========================================
    // 5. PROGRAMACIÓN DE MEDICAMENTOS (CON AUTOLIMPIEZA)
    // ==========================================
    if (frecuenciaSelect && horariosContainer) {
        frecuenciaSelect.addEventListener("change", (e) => {
            const val = e.target.value;
            horariosContainer.innerHTML = "";

            if (!val) return;

            let cantidadCampos = 1;
            if (val === "2") cantidadCampos = 2;
            else if (val === "3") cantidadCampos = 3;
            else if (val === "4") cantidadCampos = 4;

            for (let i = 0; i < cantidadCampos; i++) {
                const div = document.createElement("div");
                div.className = "horario-item";
                div.innerHTML = `
                    <label>Hora de toma ${cantidadCampos > 1 ? (i + 1) : ''}</label>
                    <input type="time" class="horaMedicamento" required>
                `;
                horariosContainer.appendChild(div);
            }
        });
    }

    if (formMedicamento) {
        formMedicamento.addEventListener("submit", (e) => {
            e.preventDefault();

            const horasInputs = document.querySelectorAll(".horaMedicamento");
            const horas = Array.from(horasInputs)
                .map(input => input.value)
                .filter(val => val !== "");

            if (horas.length === 0) {
                alert("Por favor, ingresa al menos una hora para la toma.");
                return;
            }

            const nombreMed = $("nombreMedicamento") ? $("nombreMedicamento").value.trim() : "";
            const dosisMed = $("dosis") ? $("dosis").value.trim() : "";
            const fechaInicioMed = $("fechaInicio") ? $("fechaInicio").value : "";
            const fechaFinMed = $("fechaFin") ? $("fechaFin").value : "";
            const actividadMed = $("actividad") ? $("actividad").value : "Sin actividad";

            const nuevoMedicamento = {
                id: Date.now(),
                nombre: nombreMed,
                dosis: dosisMed,
                frecuencia: frecuenciaSelect ? frecuenciaSelect.options[frecuenciaSelect.selectedIndex].text : "",
                fechaInicio: fechaInicioMed,
                fechaFin: fechaFinMed,
                actividad: actividadMed,
                horas: horas
            };

            medicamentos.push(nuevoMedicamento);
            guardarStorage("medControl_medicamentos", medicamentos);

            // Limpia automáticamente el formulario de medicamentos
            formMedicamento.reset();
            if (horariosContainer) {
                horariosContainer.innerHTML = `
                    <div class="horario-item">
                        <label>Hora de toma</label>
                        <input type="time" class="horaMedicamento" required>
                    </div>`;
            }

            renderizarMedicamentos();
            actualizarProximaToma();
        });
    }

    const renderizarMedicamentos = () => {
        if (cantidadMedicamentos) cantidadMedicamentos.textContent = medicamentos.length;
        if (!listaMedicamentos) return;

        if (medicamentos.length === 0) {
            listaMedicamentos.innerHTML = `
                <div class="vacio">
                    <div class="vacio-icon">💊</div>
                    <h3>No hay tratamientos</h3>
                    <p>Agrega un medicamento para comenzar.</p>
                </div>`;
            return;
        }

        listaMedicamentos.innerHTML = "";
        medicamentos.forEach(med => {
            const card = document.createElement("div");
            card.className = "medicamento";
            card.innerHTML = `
                <div class="medicamento-header">
                    <div>
                        <h3>${med.nombre}</h3>
                        <div class="dosis">${med.dosis}</div>
                    </div>
                </div>
                ${med.actividad && med.actividad !== 'Sin actividad' ? `<span class="actividad">${med.actividad}</span>` : ''}
                <div class="horarios-lista">
                    ${med.horas.map(h => `<span class="hora">⏰ ${h}</span>`).join('')}
                </div>
                <div class="medicamento-footer">
                    <small>Desde: ${med.fechaInicio} ${med.fechaFin ? '| Hasta: ' + med.fechaFin : ''}</small>
                    <button class="btn-eliminar" data-id="${med.id}">🗑️ Eliminar</button>
                </div>
            `;
            listaMedicamentos.appendChild(card);
        });
    };

    if (listaMedicamentos) {
        listaMedicamentos.addEventListener("click", (e) => {
            if (e.target && e.target.classList.contains("btn-eliminar")) {
                const id = Number(e.target.getAttribute("data-id"));
                medicamentos = medicamentos.filter(m => m.id !== id);
                guardarStorage("medControl_medicamentos", medicamentos);
                renderizarMedicamentos();
                actualizarProximaToma();
            }
        });
    }

    // ==========================================
    // 6. PRÓXIMA TOMA Y CONTADOR EN TIEMPO REAL
    // ==========================================
    const actualizarProximaToma = () => {
        if (!proximaMedicamento || !proximaHora || !contadorElem) return;

        if (medicamentos.length === 0) {
            proximaMedicamento.textContent = "No hay medicamentos programados";
            proximaHora.textContent = "Agrega un medicamento para comenzar.";
            contadorElem.textContent = "--";
            return;
        }

        const ahora = new Date();
        let proximaTomaGlobal = null;
        let medicamentoProximo = null;

        medicamentos.forEach(med => {
            if (!med.horas || !Array.isArray(med.horas)) return;

            med.horas.forEach(horaStr => {
                const partes = horaStr.split(":");
                if (partes.length !== 2) return;

                const h = parseInt(partes[0], 10);
                const m = parseInt(partes[1], 10);

                let fechaToma = new Date();
                fechaToma.setHours(h, m, 0, 0);

                if (fechaToma <= ahora) {
                    fechaToma.setDate(fechaToma.getDate() + 1);
                }

                if (!proximaTomaGlobal || fechaToma < proximaTomaGlobal) {
                    proximaTomaGlobal = fechaToma;
                    medicamentoProximo = { ...med, horaToma: horaStr };
                }
            });
        });

        if (medicamentoProximo && proximaTomaGlobal) {
            proximaMedicamento.textContent = `${medicamentoProximo.nombre} (${medicamentoProximo.dosis})`;
            proximaHora.textContent = `Hora programada: ${medicamentoProximo.horaToma} hs`;

            const diffMs = proximaTomaGlobal - ahora;

            if (diffMs > 0) {
                const horasFaltantes = Math.floor(diffMs / (1000 * 60 * 60));
                const minsFaltantes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
                const segsFaltantes = Math.floor((diffMs % (1000 * 60)) / 1000);

                contadorElem.textContent = `En ${horasFaltantes}h ${minsFaltantes}m ${segsFaltantes}s`;

                if (diffMs <= 1000 && modalRecordatorio && !modalRecordatorio.classList.contains("activo")) {
                    mostrarModalRecordatorio(medicamentoProximo);
                }
            }
        }
    };

    // ==========================================
    // 7. MODAL Y HISTORIAL DE TOMAS
    // ==========================================
    const mostrarModalRecordatorio = (med) => {
        if (!modalRecordatorio || !recordatorioTexto) return;
        medicacionPendienteModal = med;
        recordatorioTexto.innerHTML = `
            <p>Es hora de tomar <strong>${med.nombre}</strong> (${med.dosis}).</p>
            ${med.actividad && med.actividad !== 'Sin actividad' ? `<p><small>Asociado a: ${med.actividad}</small></p>` : ''}
        `;
        modalRecordatorio.classList.add("activo");
    };

    if (btnTomado) {
        btnTomado.addEventListener("click", () => {
            if (medicacionPendienteModal) {
                const registro = {
                    id: Date.now(),
                    nombre: medicacionPendienteModal.nombre,
                    dosis: medicacionPendienteModal.dosis,
                    fechaHora: new Date().toLocaleString()
                };
                historialTomas.unshift(registro);
                guardarStorage("medControl_historial", historialTomas);
                renderizarHistorial();
            }
            if (modalRecordatorio) modalRecordatorio.classList.remove("activo");
        });
    }

    if (btnPosponer) {
        btnPosponer.addEventListener("click", () => {
            if (modalRecordatorio) modalRecordatorio.classList.remove("activo");
        });
    }

    const renderizarHistorial = () => {
        if (!historialContainer) return;

        if (historialTomas.length === 0) {
            historialContainer.innerHTML = `
                <div class="vacio pequeño">
                    <p>Todavía no hay registros de tomas.</p>
                </div>`;
            return;
        }

        historialContainer.innerHTML = "";
        historialTomas.forEach(item => {
            const div = document.createElement("div");
            div.className = "historial-item";
            div.innerHTML = `
                <div>
                    <span class="historial-medicamento">${item.nombre}</span> (${item.dosis})
                    <div class="historial-hora">${item.fechaHora}</div>
                </div>
                <span class="estado">Tomado</span>
            `;
            historialContainer.appendChild(div);
        });
    };

    // ==========================================
    // 8. NOTIFICACIONES
    // ==========================================
    if (btnNotificaciones) {
        btnNotificaciones.addEventListener("click", () => {
            if (!("Notification" in window)) {
                alert("Este navegador no soporta notificaciones del sistema.");
                return;
            }

            Notification.requestPermission().then(permission => {
                if (permission === "granted") {
                    new Notification("MedControl", {
                        body: "¡Las notificaciones se activaron correctamente!",
                        icon: "💊"
                    });
                } else {
                    alert("Permiso de notificaciones denegado o no otorgado.");
                }
            });
        });
    }

    // ==========================================
    // 9. INICIALIZACIÓN GENERAL
    // ==========================================
    const inicializar = () => {
        cargarDatosPaciente();
        cargarDatosTratamiento();
        renderizarResumenClinico();
        renderizarMedicamentos();
        renderizarHistorial();
        actualizarProximaToma();

        setInterval(actualizarProximaToma, 1000);
    };

    inicializar();
});