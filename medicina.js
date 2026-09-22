/* =========================================================
   MEDCONTROL
   SISTEMA DE SEGUIMIENTO DE MEDICACIÓN
========================================================= */

'use strict';


/* =========================================================
   VARIABLES
========================================================= */

const STORAGE_MEDICAMENTOS = 'medcontrol_medicamentos';

const STORAGE_PACIENTE = 'medcontrol_paciente';

const STORAGE_HISTORIAL = 'medcontrol_historial';


let medicamentos =
    JSON.parse(
        localStorage.getItem(STORAGE_MEDICAMENTOS)
    ) || [];


let historial =
    JSON.parse(
        localStorage.getItem(STORAGE_HISTORIAL)
    ) || [];


let paciente =
    JSON.parse(
        localStorage.getItem(STORAGE_PACIENTE)
    ) || null;


let medicamentoRecordatorioActual = null;


/* =========================================================
   ELEMENTOS HTML
========================================================= */

const formMedicamento =
    document.getElementById('formMedicamento');

const frecuencia =
    document.getElementById('frecuencia');

const horariosContainer =
    document.getElementById('horariosContainer');

const listaMedicamentos =
    document.getElementById('listaMedicamentos');

const cantidadMedicamentos =
    document.getElementById('cantidadMedicamentos');

const proximaMedicamento =
    document.getElementById('proximaMedicamento');

const proximaHora =
    document.getElementById('proximaHora');

const contador =
    document.getElementById('contador');

const modalRecordatorio =
    document.getElementById('modalRecordatorio');

const recordatorioTexto =
    document.getElementById('recordatorioTexto');

const historialContainer =
    document.getElementById('historial');


/* =========================================================
   INICIO
========================================================= */

document.addEventListener('DOMContentLoaded', () => {

    cargarPaciente();

    mostrarMedicamentos();

    mostrarHistorial();

    actualizarProximaToma();

    configurarFechaMinima();

});


/* =========================================================
   FECHA MÍNIMA
========================================================= */

function configurarFechaMinima() {

    const hoy =
        new Date().toISOString().split('T')[0];

    document.getElementById('fechaInicio').value = hoy;

    document.getElementById('fechaInicio').min = hoy;

    document.getElementById('fechaFin').min = hoy;

}


/* =========================================================
   GENERAR HORARIOS
========================================================= */

frecuencia.addEventListener('change', () => {

    const cantidad = frecuencia.value;

    horariosContainer.innerHTML = '';

    if (cantidad === 'personalizado') {

        agregarHorario();

        return;
    }


    const numero = parseInt(cantidad);


    if (!numero) {

        agregarHorario();

        return;
    }


    for (let i = 0; i < numero; i++) {

        agregarHorario();

    }

});


function agregarHorario() {

    const div =
        document.createElement('div');

    div.className = 'horario-item';


    div.innerHTML = `

        <label>
            Hora de toma
        </label>

        <input
            type="time"
            class="horaMedicamento"
            required>

    `;


    horariosContainer.appendChild(div);

}


/* =========================================================
   AGREGAR MEDICAMENTO
========================================================= */

formMedicamento.addEventListener('submit', (event) => {

    event.preventDefault();


    const nombre =
        document.getElementById('nombreMedicamento')
        .value
        .trim();


    const dosis =
        document.getElementById('dosis')
        .value
        .trim();


    const actividad =
        document.getElementById('actividad')
        .value;


    const fechaInicio =
        document.getElementById('fechaInicio')
        .value;


    const fechaFin =
        document.getElementById('fechaFin')
        .value;


    const horas =
        Array.from(
            document.querySelectorAll('.horaMedicamento')
        )
        .map(input => input.value)
        .filter(hora => hora !== '');


    if (horas.length === 0) {

        alert(
            'Debes seleccionar al menos un horario.'
        );

        return;

    }


    const medicamento = {

        id: Date.now(),

        nombre: nombre,

        dosis: dosis,

        actividad: actividad,

        fechaInicio: fechaInicio,

        fechaFin: fechaFin,

        horas: horas.sort()

    };


    medicamentos.push(medicamento);


    guardarMedicamentos();


    formMedicamento.reset();


    horariosContainer.innerHTML = '';

    agregarHorario();


    mostrarMedicamentos();

    actualizarProximaToma();


    alert(
        'El tratamiento fue programado correctamente.'
    );

});


/* =========================================================
   GUARDAR MEDICAMENTOS
========================================================= */

function guardarMedicamentos() {

    localStorage.setItem(

        STORAGE_MEDICAMENTOS,

        JSON.stringify(medicamentos)

    );

}


/* =========================================================
   MOSTRAR MEDICAMENTOS
========================================================= */

function mostrarMedicamentos() {

    cantidadMedicamentos.textContent =
        medicamentos.length;


    if (medicamentos.length === 0) {

        listaMedicamentos.innerHTML = `

            <div class="vacio">

                <div class="vacio-icon">
                    💊
                </div>

                <h3>No hay tratamientos</h3>

                <p>
                    Agrega un medicamento para comenzar.
                </p>

            </div>

        `;

        return;

    }


    listaMedicamentos.innerHTML = '';


    medicamentos.forEach(medicamento => {

        const tarjeta =
            document.createElement('div');

        tarjeta.className = 'medicamento';


        const horariosHTML =
            medicamento.horas
                .map(hora => {

                    return `
                        <span class="hora">
                            ⏰ ${hora}
                        </span>
                    `;

                })
                .join('');


        tarjeta.innerHTML = `

            <div class="medicamento-header">

                <div>

                    <h3>
                        ${escapeHTML(medicamento.nombre)}
                    </h3>

                    <div class="dosis">
                        ${escapeHTML(medicamento.dosis)}
                    </div>

                </div>

                <span>
                    💊
                </span>

            </div>


            <div class="actividad">

                ${escapeHTML(medicamento.actividad)}

            </div>


            <div class="horarios-lista">

                ${horariosHTML}

            </div>


            <div class="medicamento-footer">

                <small>
                    Desde:
                    ${formatearFecha(medicamento.fechaInicio)}
                </small>


                <button
                    class="btn-eliminar"
                    onclick="eliminarMedicamento(${medicamento.id})">

                    🗑️ Eliminar

                </button>

            </div>

        `;


        listaMedicamentos.appendChild(tarjeta);

    });

}


/* =========================================================
   ELIMINAR MEDICAMENTO
========================================================= */

function eliminarMedicamento(id) {

    const confirmar =
        confirm(
            '¿Deseas eliminar este tratamiento?'
        );


    if (!confirmar) {

        return;

    }


    medicamentos =
        medicamentos.filter(
            medicamento =>
                medicamento.id !== id
        );


    guardarMedicamentos();

    mostrarMedicamentos();

    actualizarProximaToma();

}


/* =========================================================
   PRÓXIMA TOMA
========================================================= */

function actualizarProximaToma() {

    if (medicamentos.length === 0) {

        proximaMedicamento.textContent =
            'No hay medicamentos programados';

        proximaHora.textContent =
            'Agrega un medicamento para comenzar.';

        contador.textContent = '--';

        return;

    }


    const ahora = new Date();

    let siguiente = null;


    medicamentos.forEach(medicamento => {

        medicamento.horas.forEach(hora => {

            const partes =
                hora.split(':');

            const fecha =
                new Date(ahora);

            fecha.setHours(
                parseInt(partes[0]),
                parseInt(partes[1]),
                0,
                0
            );


            if (fecha <= ahora) {

                fecha.setDate(
                    fecha.getDate() + 1
                );

            }


            if (
                siguiente === null ||
                fecha < siguiente.fecha
            ) {

                siguiente = {

                    fecha: fecha,

                    medicamento: medicamento,

                    hora: hora

                };

            }

        });

    });


    if (!siguiente) {

        return;

    }


    proximaMedicamento.textContent =
        `${siguiente.medicamento.nombre} - ${siguiente.medicamento.dosis}`;


    proximaHora.textContent =
        `A las ${siguiente.hora} • ${siguiente.medicamento.actividad}`;


    actualizarContador(siguiente.fecha);

}


/* =========================================================
   CONTADOR
========================================================= */

function actualizarContador(fecha) {

    const ahora = new Date();

    const diferencia =
        fecha.getTime() - ahora.getTime();


    if (diferencia <= 0) {

        contador.textContent =
            '¡Es hora de tomarlo!';

        return;

    }


    const horas =
        Math.floor(
            diferencia / 1000 / 60 / 60
        );


    const minutos =
        Math.floor(
            (diferencia / 1000 / 60) % 60
        );


    const segundos =
        Math.floor(
            (diferencia / 1000) % 60
        );


    contador.textContent =
        `Faltan ${horas}h ${minutos}m ${segundos}s`;

}


/* =========================================================
   COMPROBAR RECORDATORIOS
========================================================= */

setInterval(() => {

    actualizarProximaToma();

    comprobarRecordatorios();

}, 1000);


/* =========================================================
   RECORDATORIOS
========================================================= */

function comprobarRecordatorios() {

    const ahora = new Date();

    const horaActual =
        `${String(ahora.getHours()).padStart(2, '0')}:${String(ahora.getMinutes()).padStart(2, '0')}`;


    medicamentos.forEach(medicamento => {

        medicamento.horas.forEach(hora => {

            if (hora === horaActual) {

                const clave =
                    `${medicamento.id}-${hora}-${ahora.toDateString()}`;


                if (
                    localStorage.getItem(
                        'recordatorio-' + clave
                    )
                ) {

                    return;

                }


                localStorage.setItem(
                    'recordatorio-' + clave,
                    'mostrado'
                );


                mostrarRecordatorio(
                    medicamento,
                    hora
                );

            }

        });

    });

}


/* =========================================================
   MOSTRAR MODAL
========================================================= */

function mostrarRecordatorio(
    medicamento,
    hora
) {

    medicamentoRecordatorioActual = {

        medicamento: medicamento,

        hora: hora

    };


    const pacienteNombre =
        paciente?.nombre ||
        'Paciente';


    recordatorioTexto.innerHTML = `

        <p>
            Hola
            <strong>
                ${escapeHTML(pacienteNombre)}
            </strong>.
        </p>

        <p style="margin-top:10px">

            Es momento de tomar:

        </p>

        <h3 style="margin-top:10px">

            💊 ${escapeHTML(medicamento.nombre)}

        </h3>

        <p style="margin-top:5px">

            Dosis:
            <strong>
                ${escapeHTML(medicamento.dosis)}
            </strong>

        </p>

        <p style="margin-top:5px">

            Rutina:
            <strong>
                ${escapeHTML(medicamento.actividad)}
            </strong>

        </p>

    `;


    modalRecordatorio.classList.add('activo');


    reproducirAlerta();

}


/* =========================================================
   BOTÓN TOMADO
========================================================= */

document.getElementById('btnTomado')
    .addEventListener('click', () => {

        if (!medicamentoRecordatorioActual) {

            return;

        }


        const medicamento =
            medicamentoRecordatorioActual.medicamento;


        const hora =
            medicamentoRecordatorioActual.hora;


        historial.unshift({

            id: Date.now(),

            medicamento: medicamento.nombre,

            dosis: medicamento.dosis,

            hora: hora,

            fecha: new Date().toLocaleString('es-GT'),

            estado: 'Tomado'

        });


        guardarHistorial();

        mostrarHistorial();


        cerrarModal();


    });


/* =========================================================
   POSPONER
========================================================= */

document.getElementById('btnPosponer')
    .addEventListener('click', () => {

        cerrarModal();


        setTimeout(() => {

            if (
                medicamentoRecordatorioActual
            ) {

                mostrarRecordatorio(

                    medicamentoRecordatorioActual
                        .medicamento,

                    medicamentoRecordatorioActual
                        .hora

                );

            }

        }, 10 * 60 * 1000);

    });


/* =========================================================
   CERRAR MODAL
========================================================= */

function cerrarModal() {

    modalRecordatorio.classList.remove(
        'activo'
    );

}


/* =========================================================
   NOTIFICACIONES
========================================================= */

document.getElementById('btnNotificaciones')
    .addEventListener('click', async () => {

        if (
            !('Notification' in window)
        ) {

            alert(
                'Tu navegador no permite notificaciones.'
            );

            return;

        }


        const permiso =
            await Notification.requestPermission();


        if (permiso === 'granted') {

            new Notification(
                'MedControl',
                {
                    body:
                        'Las notificaciones de medicamentos están activadas.'
                }
            );


            document.getElementById(
                'btnNotificaciones'
            ).textContent =
                '🔔 Notificaciones activadas';

        } else {

            alert(
                'No se permitió el uso de notificaciones.'
            );

        }

    });


/* =========================================================
   ENVIAR NOTIFICACIÓN
========================================================= */

function enviarNotificacion(
    medicamento
) {

    if (
        'Notification' in window &&
        Notification.permission === 'granted'
    ) {

        new Notification(
            '💊 Hora del medicamento',
            {

                body:
                    `Toma ${medicamento.nombre} - ${medicamento.dosis}`

            }
        );

    }

}


/* =========================================================
   SONIDO DE ALERTA
========================================================= */

function reproducirAlerta() {

    try {

        const contexto =
            new (
                window.AudioContext ||
                window.webkitAudioContext
            )();


        const oscilador =
            contexto.createOscillator();


        const ganancia =
            contexto.createGain();


        oscilador.connect(ganancia);

        ganancia.connect(
            contexto.destination
        );


        oscilador.frequency.value =
            800;


        ganancia.gain.value =
            0.2;


        oscilador.start();


        setTimeout(() => {

            oscilador.stop();

        }, 500);

    } catch (error) {

        console.log(
            'No fue posible reproducir sonido.'
        );

    }

}


/* =========================================================
   HISTORIAL
========================================================= */

function guardarHistorial() {

    localStorage.setItem(

        STORAGE_HISTORIAL,

        JSON.stringify(historial)

    );

}


function mostrarHistorial() {

    if (historial.length === 0) {

        historialContainer.innerHTML = `

            <div class="vacio pequeño">

                <p>
                    Todavía no hay registros de tomas.
                </p>

            </div>

        `;

        return;

    }


    historialContainer.innerHTML = '';


    historial
        .slice(0, 20)
        .forEach(registro => {

            const elemento =
                document.createElement('div');

            elemento.className =
                'historial-item';


            elemento.innerHTML = `

                <div>

                    <div class="historial-medicamento">

                        💊
                        ${escapeHTML(registro.medicamento)}

                        -
                        ${escapeHTML(registro.dosis)}

                    </div>

                    <div class="historial-hora">

                        ${escapeHTML(registro.fecha)}

                        • Hora programada:
                        ${escapeHTML(registro.hora)}

                    </div>

                </div>


                <span class="estado">

                    ✓ ${escapeHTML(registro.estado)}

                </span>

            `;


            historialContainer.appendChild(
                elemento
            );

        });

}


/* =========================================================
   PACIENTE
========================================================= */

document.getElementById('btnGuardarPaciente')
    .addEventListener('click', () => {

        const nombre =
            document.getElementById(
                'nombrePaciente'
            ).value.trim();


        const edad =
            document.getElementById(
                'edadPaciente'
            ).value;


        if (!nombre) {

            alert(
                'Ingresa el nombre del paciente.'
            );

            return;

        }


        paciente = {

            nombre: nombre,

            edad: edad

        };


        localStorage.setItem(

            STORAGE_PACIENTE,

            JSON.stringify(paciente)

        );


        alert(
            'Información del paciente guardada.'
        );

    });


/* =========================================================
   CARGAR PACIENTE
========================================================= */

function cargarPaciente() {

    if (!paciente) {

        return;

    }


    document.getElementById(
        'nombrePaciente'
    ).value =
        paciente.nombre || '';


    document.getElementById(
        'edadPaciente'
    ).value =
        paciente.edad || '';

}


/* =========================================================
   FORMATEAR FECHA
========================================================= */

function formatearFecha(fecha) {

    if (!fecha) {

        return 'No definida';

    }


    const partes =
        fecha.split('-');


    if (partes.length !== 3) {

        return fecha;

    }


    return `${partes[2]}/${partes[1]}/${partes[0]}`;

}


/* =========================================================
   SEGURIDAD BÁSICA HTML
========================================================= */

function escapeHTML(texto) {

    const div =
        document.createElement('div');

    div.textContent =
        texto ?? '';

    return div.innerHTML;

}