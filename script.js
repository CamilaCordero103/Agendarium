// ==========================================
// 1. FRASES MOTIVACIONALES
// ==========================================
const frases = [
    "La vida es un 10% lo que te pasa y un 90% cómo reaccionas a ello.",
    "No cuentes los días, haz que los días cuenten.",
    "Aprender es descubrir que algo es posible.",
    "Tu crecimiento comienza justo al final de tu zona de confort.",
    "La educación no es preparación para la vida; la educación es la vida en sí misma.",
    "Sé el cambio que deseas ver en el mundo.",
    "El conocimiento te dará poder, pero el carácter te dará respeto.",
    "Nunca eres demasiado viejo para fijarte otra meta o tener un nuevo sueño.",
    "La sabiduría empieza en la maravilla.",
    "Acepta lo que es, deja ir lo que fue y ten fe en lo que será.",
    "Productividad es hacer cosas que nunca antes habías podido hacer.",
    "La acción es la clave fundamental de todo éxito.",
    "Hacer es mejor que decir.",
    "Concéntrate en ser productivo en lugar de estar ocupado.",
    "La mejor manera de empezar es dejar de hablar y empezar a actuar.",
    "El éxito no es la clave de la felicidad. La felicidad es la clave del éxito.",
    "El éxito es ir de fracaso en fracaso sin perder el entusiasmo.",
    "Las limitaciones viven solo en nuestras mentes, pero si usamos nuestra imaginación, nuestras posibilidades se vuelven ilimitadas.",
    "No juzgues cada día por la cosecha que recoges, sino por las semillas que plantas.",
    "La única limitación en nuestra realización del mañana serán nuestras dudas de hoy.",
    "El éxito es la suma de pequeños esfuerzos repetidos día tras día.",
    "Para tener éxito, tu deseo de alcanzarlo debe ser mayor que tu miedo al fracaso.",
    "Cáete siete veces y levántate ocho.",
    "El único lugar donde el éxito viene antes que el trabajo es en el diccionario.",
    "No he fallado. Simplemente he encontrado 10,000 formas que no funcionan.",
    "Todo lo que puedas imaginar es real.",
    "Haz de cada día tu obra maestra.",
    "Si puedes soñarlo, puedes hacerlo.",
    "Si la oportunidad no llama, construye una puerta.",
    "Donde hay amor hay vida.",
    "La felicidad no es algo ya hecho. Viene de tus propias acciones.",
    "Cree que puedes y casi lo habrás logrado.",
    "La mejor forma de predecir el futuro es creándolo.",
    "El momento es ahora.",
    "Sé tú mismo; los demás puestos ya están ocupados.",
    "Si no encuentras una puerta, busca la ventana. Y si no hay ventana, toma un mazo y haz una."
];

function cargarFraseAleatoria() {
    const el = document.getElementById('frase-motivacional');
    if (el) {
        const indice = Math.floor(Math.random() * frases.length);
        el.textContent = `"${frases[indice]}"`;
    }
}

// ==========================================
// 2. CAMBIO DE PESTAÑAS
// ==========================================
const botonesPestana = document.querySelectorAll('.btn-pestana');
const paginas = document.querySelectorAll('.pagina');

botonesPestana.forEach(boton => {
    boton.addEventListener('click', () => {
        botonesPestana.forEach(btn => btn.classList.remove('activa'));
        paginas.forEach(pag => pag.classList.remove('activa'));

        boton.classList.add('activa');
        const destino = boton.getAttribute('data-destino');
        const pagDestino = document.getElementById(destino);
        if (pagDestino) pagDestino.classList.add('activa');
    });
});

// ==========================================
// 3. MODO GRIS / CLARO
// ==========================================
const btnModo = document.getElementById('btn-modo');

if (localStorage.getItem('tema') === 'oscuro') {
    document.body.classList.add('modo-oscuro');
    if (btnModo) btnModo.textContent = '☀️ Modo Color';
}

if (btnModo) {
    btnModo.addEventListener('click', () => {
        document.body.classList.toggle('modo-oscuro');
        if (document.body.classList.contains('modo-oscuro')) {
            btnModo.textContent = '☀️ Modo Color';
            localStorage.setItem('tema', 'oscuro');
        } else {
            btnModo.textContent = '🌙 Modo Gris';
            localStorage.setItem('tema', 'claro');
        }
    });
}

// ==========================================
// 4. TEXTAREAS AUTO-EXPANDIBLES
// ==========================================
function autoExpandirTextarea(textarea) {
    if (!textarea) return;
    textarea.style.height = 'auto';
    textarea.style.height = (textarea.scrollHeight) + 'px';
}

document.addEventListener('input', function(e) {
    if (e.target.tagName.toLowerCase() === 'textarea') {
        autoExpandirTextarea(e.target);
    }
});

// ==========================================
// 5. CONFETI
// ==========================================
function lanzarConfeti(x, y) {
    const colores = ['#ff4081', '#7c4dff', '#00e676', '#ffeb3b', '#ff9100', '#5798D7', '#B9C255'];
    for (let i = 0; i < 45; i++) {
        const confeti = document.createElement('div');
        confeti.classList.add('particula-confeti');
        confeti.style.left = `${x}px`;
        confeti.style.top = `${y}px`;
        confeti.style.backgroundColor = colores[Math.floor(Math.random() * colores.length)];
        
        const angulo = Math.random() * Math.PI * 2;
        const distancia = 80 + Math.random() * 180;
        confeti.style.setProperty('--dx', `${Math.cos(angulo) * distancia}px`);
        confeti.style.setProperty('--dy', `${Math.sin(angulo) * distancia - 60}px`);

        document.body.appendChild(confeti);
        setTimeout(() => confeti.remove(), 5600);
    }
}

// ==========================================
// 6. CALENDARIO MES, LUNAS Y CATEGORÍAS DINÁMICAS
// ==========================================
let fechaActual = new Date();
let diaSeleccionadoClave = "";
let eventosTemporales = [];
let animoSeleccionado = "";
let imagenesBase64Actuales = [];

let listaCategoriasEventos = JSON.parse(localStorage.getItem('mis_categorias_eventos')) || [
    { nombre: "🎈 Cumpleaños", bg: "#dcfce7", color: "#166534" },
    { nombre: "❤️ Aniversario", bg: "#fee2e2", color: "#991b1b" },
    { nombre: "🧉 Junta con amigos", bg: "#ffedd5", color: "#9a3412" },
    { nombre: "⭐ Importante", bg: "#fef9c3", color: "#854d0e" },
    { nombre: "🙃 Otros", bg: "#f3e8ff", color: "#6b21a8" }
];

function obtenerColorTextoAdecuado(hexColor) {
    const hex = hexColor.replace('#', '');
    const r = parseInt(hex.substr(0, 2), 16) || 0;
    const g = parseInt(hex.substr(2, 2), 16) || 0;
    const b = parseInt(hex.substr(4, 2), 16) || 0;
    return (((r * 299) + (g * 587) + (b * 114)) / 1000 >= 128) ? '#1e293b' : '#ffffff';
}

function buscarEstiloCategoria(nombreTipo) {
    const encontrada = listaCategoriasEventos.find(c => c.nombre === nombreTipo);
    return encontrada ? { bg: encontrada.bg, color: encontrada.color } : { bg: "#f3e8ff", color: "#6b21a8" };
}

function actualizarSelectCategorias() {
    const selectTipoModal = document.getElementById('tipo-evento');
    const selectTipoHoy = document.getElementById('select-tipo-evento-hoy');
    const contenedorPills = document.getElementById('lista-pills-categorias');
    
    [selectTipoModal, selectTipoHoy].forEach(selectEl => {
        if (selectEl) {
            selectEl.innerHTML = "";
            listaCategoriasEventos.forEach(cat => {
                const option = document.createElement('option');
                option.value = cat.nombre;
                option.textContent = cat.nombre;
                selectEl.appendChild(option);
            });
        }
    });

    if (contenedorPills) {
        contenedorPills.innerHTML = "";
        listaCategoriasEventos.forEach((cat, index) => {
            const pill = document.createElement('span');
            pill.classList.add('pill-cat-gestion');
            pill.style.backgroundColor = cat.bg;
            pill.style.color = cat.color;
            pill.innerHTML = `${cat.nombre} <button type="button" class="btn-del-cat-pill" title="Eliminar" onclick="window.eliminarCategoria(${index})">&times;</button>`;
            contenedorPills.appendChild(pill);
        });
    }
}

window.eliminarCategoria = function(index) {
    if (listaCategoriasEventos.length <= 1) {
        alert("Debes mantener al menos una categoría.");
        return;
    }
    listaCategoriasEventos.splice(index, 1);
    localStorage.setItem('mis_categorias_eventos', JSON.stringify(listaCategoriasEventos));
    actualizarSelectCategorias();
    renderizarCalendario();
    if (typeof renderizarVistaSemana === 'function') renderizarVistaSemana();
    if (typeof renderizarVistaAno === 'function') renderizarVistaAno();
};

const btnToggleCrearCat = document.getElementById('btn-toggle-crear-cat');
const formCrearCat = document.getElementById('form-crear-categoria');
const btnGuardarCat = document.getElementById('btn-guardar-cat');

if (btnToggleCrearCat && formCrearCat) {
    btnToggleCrearCat.addEventListener('click', () => formCrearCat.classList.toggle('oculto'));
}

if (btnGuardarCat) {
    btnGuardarCat.addEventListener('click', () => {
        const inputNombre = document.getElementById('input-nombre-cat');
        const inputColor = document.getElementById('input-color-cat');
        if (!inputNombre || !inputColor) return;
        const nombreCat = inputNombre.value.trim();
        if (nombreCat === "") return;

        const bgHex = inputColor.value;
        const textHex = obtenerColorTextoAdecuado(bgHex);

        if (!listaCategoriasEventos.some(c => c.nombre === nombreCat)) {
            listaCategoriasEventos.push({ nombre: nombreCat, bg: bgHex, color: textHex });
            localStorage.setItem('mis_categorias_eventos', JSON.stringify(listaCategoriasEventos));
            actualizarSelectCategorias();
            const selectTipo = document.getElementById('tipo-evento');
            if (selectTipo) selectTipo.value = nombreCat;
        }

        inputNombre.value = "";
        formCrearCat.classList.add('oculto');
    });
}

function obtenerInfoLuna(fecha = new Date()) {
    try {
        const año = fecha.getFullYear();
        let mes = fecha.getMonth() + 1;
        const dia = fecha.getDate();

        let y = año, m = mes;
        if (m < 3) { y--; m += 12; }
        let c = 365.25 * y;
        let e = 30.6 * m;
        let jd = c + e + dia - 694039.09;
        let ciclo = (jd / 29.5305882) - Math.floor(jd / 29.5305882);
        let diasFase = ciclo * 29.5305882;
        let porcentaje = Math.round((1 - Math.cos(ciclo * 2 * Math.PI)) / 2 * 100);

        let icono = "🌑", nombre = "Luna nueva";
        if (diasFase < 1.84) { icono = "🌑"; nombre = "Luna nueva"; }
        else if (diasFase < 5.53) { icono = "🌒"; nombre = "Creciente cóncava"; }
        else if (diasFase < 9.22) { icono = "🌓"; nombre = "Cuarto creciente"; }
        else if (diasFase < 12.91) { icono = "🌔"; nombre = "Creciente gibosa"; }
        else if (diasFase < 16.61) { icono = "🌕"; nombre = "Luna llena"; }
        else if (diasFase < 20.30) { icono = "🌖"; nombre = "Menguante gibosa"; }
        else if (diasFase < 23.99) { icono = "🌗"; nombre = "Cuarto menguante"; }
        else if (diasFase < 27.68) { icono = "🌘"; nombre = "Menguante cóncava"; }
        else { icono = "🌑"; nombre = "Luna nueva"; }

        return `${icono} ${nombre} ${porcentaje}%`;
    } catch (e) {
        return "🌕 Luna llena";
    }
}

document.querySelectorAll('.btn-animo').forEach(btn => {
    btn.addEventListener('click', () => {
        document.querySelectorAll('.btn-animo').forEach(b => b.classList.remove('seleccionado'));
        btn.classList.add('seleccionado');
        animoSeleccionado = btn.getAttribute('data-animo');
    });
});

const btnAgregarEvento = document.getElementById('btn-agregar-evento');
if (btnAgregarEvento) {
    btnAgregarEvento.addEventListener('click', () => {
        const textoInput = document.getElementById('texto-evento');
        const tipoInput = document.getElementById('tipo-evento');
        if (!textoInput || !tipoInput) return;
        const texto = textoInput.value.trim();
        
        if (texto !== "") {
            eventosTemporales.push({ tipo: tipoInput.value, texto });
            textoInput.value = "";
            renderizarListaEventosModal();
        }
    });
}

function renderizarListaEventosModal() {
    const ul = document.getElementById('lista-eventos-dia');
    if (!ul) return;
    ul.innerHTML = "";
    if (!Array.isArray(eventosTemporales)) return;

    eventosTemporales.forEach((ev, index) => {
        if (!ev) return;
        let tipo = typeof ev === 'string' ? "🙃 Otros" : (ev.tipo || "📌 Evento");
        let texto = typeof ev === 'string' ? ev : (ev.texto || "");

        const estilo = buscarEstiloCategoria(tipo);
        const li = document.createElement('li');
        li.classList.add('etiqueta-evento');
        li.style.backgroundColor = estilo.bg;
        li.style.color = estilo.color;
        li.style.padding = "6px 10px";
        li.style.marginBottom = "4px";
        li.innerHTML = `<span>${tipo} - ${texto}</span> <span style="cursor:pointer; font-weight:bold;" onclick="window.eliminarEvento(${index})">&times;</span>`;
        ul.appendChild(li);
    });
}

window.eliminarEvento = function(index) {
    eventosTemporales.splice(index, 1);
    renderizarListaEventosModal();
};

function renderizarCalendario() {
    const tituloMes = document.getElementById('titulo-mes');
    const grillaCalendario = document.getElementById('grilla-calendario');

    const año = fechaActual.getFullYear();
    const mes = fechaActual.getMonth();
    const nombresMeses = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"];
    
    if (tituloMes) tituloMes.textContent = `${nombresMeses[mes]} ${año}`;
    if (!grillaCalendario) return;
    grillaCalendario.innerHTML = "";

    let primerDia = new Date(año, mes, 1).getDay();
    primerDia = primerDia === 0 ? 6 : primerDia - 1; 
    const totalDias = new Date(año, mes + 1, 0).getDate();

    for (let i = 0; i < primerDia; i++) {
        grillaCalendario.appendChild(document.createElement('div'));
    }

    for (let dia = 1; dia <= totalDias; dia++) {
        const cuadro = document.createElement('div');
        cuadro.classList.add('cuadro-dia');
        const claveFecha = `${año}-${String(mes + 1).padStart(2, '0')}-${String(dia).padStart(2, '0')}`;
        const datos = JSON.parse(localStorage.getItem(claveFecha)) || {};

        const fechaDia = new Date(año, mes, dia);
        const infoLuna = obtenerInfoLuna(fechaDia);
        const iconoLuna = infoLuna.split(' ')[0];

        const encabezado = document.createElement('div');
        encabezado.classList.add('encabezado-dia-mes');
        encabezado.innerHTML = `
            <span class="num-dia-mes">${dia} ${datos.animo || ''}</span>
            <span class="icono-luna-mes" title="${infoLuna}">${iconoLuna}</span>
        `;
        cuadro.appendChild(encabezado);

        if (datos.eventos && datos.eventos.length > 0) {
            datos.eventos.forEach(ev => {
                const estilo = buscarEstiloCategoria(ev.tipo);
                const etiq = document.createElement('div');
                etiq.classList.add('etiqueta-evento');
                etiq.style.backgroundColor = estilo.bg;
                etiq.style.color = estilo.color;
                const emoji = ev.tipo ? ev.tipo.split(' ')[0] : '📌';
                etiq.textContent = `${emoji} ${ev.texto || ''}`;
                cuadro.appendChild(etiq);
            });
        }

        const hoy = new Date();
        if (dia === hoy.getDate() && mes === hoy.getMonth() && año === hoy.getFullYear()) {
            cuadro.classList.add('hoy');
        }

        cuadro.addEventListener('click', () => abrirModalDia(claveFecha, dia, nombresMeses[mes]));
        grillaCalendario.appendChild(cuadro);
    }
}

function abrirModalDia(clave, dia, mesNombre) {
    const modal = document.getElementById('modal-dia');
    if (!modal) return;
    
    modal.classList.remove('oculto');
    diaSeleccionadoClave = clave;
    
    try {
        const elFecha = document.getElementById('fecha-modal');
        if (elFecha) elFecha.textContent = `${dia} de ${mesNombre}`;
        
        if (clave) {
            const partesFecha = clave.split('-');
            if (partesFecha.length === 3) {
                const fechaObj = new Date(parseInt(partesFecha[0]), parseInt(partesFecha[1]) - 1, parseInt(partesFecha[2]));
                const modalLuna = document.getElementById('modal-fase-lunar');
                if (modalLuna) modalLuna.textContent = obtenerInfoLuna(fechaObj);
            }
        }

        const datos = JSON.parse(localStorage.getItem(clave)) || {};
        
        animoSeleccionado = datos.animo || "";
        document.querySelectorAll('.btn-animo').forEach(b => {
            b.classList.toggle('seleccionado', b.getAttribute('data-animo') === animoSeleccionado);
        });

        eventosTemporales = Array.isArray(datos.eventos) ? datos.eventos : [];
        actualizarSelectCategorias();
        renderizarListaEventosModal();

        const elResumen = document.getElementById('texto-resumen');
        const elMenu = document.getElementById('texto-menu');
        const elCasa = document.getElementById('texto-casa');
        const elHobbies = document.getElementById('texto-hobbies');

        if (elResumen) elResumen.value = datos.resumen || "";
        if (elMenu) elMenu.value = datos.menu || "";
        if (elCasa) elCasa.value = datos.casa || "";
        if (elHobbies) elHobbies.value = datos.hobbies || "";

        imagenesBase64Actuales = Array.isArray(datos.imagenesBase64) ? datos.imagenesBase64 : [];
        renderizarGaleriaModal();

        setTimeout(() => {
            document.querySelectorAll('textarea').forEach(autoExpandirTextarea);
        }, 10);
    } catch (err) {
        console.error("Error cargando detalle del día:", err);
    }
}

const btnGuardarDia = document.getElementById('btn-guardar-dia');
if (btnGuardarDia) {
    btnGuardarDia.addEventListener('click', () => {
        const modal = document.getElementById('modal-dia');
        const datosPrevios = JSON.parse(localStorage.getItem(diaSeleccionadoClave)) || {};
        const datosDia = {
            ...datosPrevios,
            animo: animoSeleccionado,
            eventos: eventosTemporales,
            resumen: document.getElementById('texto-resumen') ? document.getElementById('texto-resumen').value : "",
            menu: document.getElementById('texto-menu') ? document.getElementById('texto-menu').value : "",
            casa: document.getElementById('texto-casa') ? document.getElementById('texto-casa').value : "",
            hobbies: document.getElementById('texto-hobbies') ? document.getElementById('texto-hobbies').value : "",
            imagenesBase64: imagenesBase64Actuales
        };

        localStorage.setItem(diaSeleccionadoClave, JSON.stringify(datosDia));
        if (modal) modal.classList.add('oculto');

        renderizarCalendario();
        if (typeof renderizarVistaSemana === 'function') renderizarVistaSemana();
        if (typeof renderizarVistaAno === 'function') renderizarVistaAno();
        cargarVistaHoy();
    });
}

const cerrarModal = document.getElementById('cerrar-modal');
if (cerrarModal) {
    cerrarModal.addEventListener('click', () => {
        const modal = document.getElementById('modal-dia');
        if (modal) modal.classList.add('oculto');
    });
}

const btnMesAnt = document.getElementById('mes-anterior');
const btnMesSig = document.getElementById('mes-siguiente');
if (btnMesAnt) btnMesAnt.addEventListener('click', () => { fechaActual.setMonth(fechaActual.getMonth() - 1); renderizarCalendario(); });
if (btnMesSig) btnMesSig.addEventListener('click', () => { fechaActual.setMonth(fechaActual.getMonth() + 1); renderizarCalendario(); });

// ==========================================
// 7. LÓGICA MÓDULO DE TAREAS, ATRASADAS Y REAGENDAMIENTO
// ==========================================
let listaTareas = JSON.parse(localStorage.getItem('mis_tareas_agenda')) || [];
let tareaEnEdicionId = null;

const nombresCategorias = {
    atrasadas: "⚠️ Atrasadas",
    hoy: "👌🏻 Hoy",
    manana: "🌅 Mañana",
    esta_semana: "📅 Esta semana",
    fin_semana: "🍿 Fin de semana",
    prox_semana: "🗓️ Próxima semana",
    proximos: "🔮 Próximos",
    sin_fecha: "📌 Sin fecha"
};

const ordenCategorias = ["atrasadas", "hoy", "manana", "esta_semana", "fin_semana", "prox_semana", "proximos", "sin_fecha"];

function esTareaAtrasada(tarea) {
    if (tarea.completada || tarea.categoria === 'sin_fecha' || tarea.categoria === 'proximos') return false;

    const hoyReal = new Date();
    hoyReal.setHours(0, 0, 0, 0);

    let fechaBase = tarea.fechaAsignada ? new Date(tarea.fechaAsignada + 'T00:00:00') : new Date(tarea.id);
    fechaBase.setHours(0, 0, 0, 0);

    let lunesBase = tarea.lunesAsignado ? new Date(tarea.lunesAsignado + 'T00:00:00') : obtenerLunesDeSemana(fechaBase);
    lunesBase.setHours(0, 0, 0, 0);

    const domingoBase = new Date(lunesBase);
    domingoBase.setDate(lunesBase.getDate() + 6);
    domingoBase.setHours(23, 59, 59, 999);

    if (tarea.categoria === 'hoy') {
        return hoyReal.getTime() > fechaBase.getTime();
    }
    if (tarea.categoria === 'manana') {
        const diaMananaBase = new Date(fechaBase);
        diaMananaBase.setDate(fechaBase.getDate() + 1);
        return hoyReal.getTime() > diaMananaBase.getTime();
    }
    if (tarea.categoria === 'esta_semana' || tarea.categoria === 'fin_semana') {
        return hoyReal.getTime() > domingoBase.getTime();
    }
    if (tarea.categoria === 'prox_semana') {
        const domingoProxBase = new Date(domingoBase);
        domingoProxBase.setDate(domingoBase.getDate() + 7);
        return hoyReal.getTime() > domingoProxBase.getTime();
    }

    return false;
}

function actualizarSelloFechaTarea(tarea, nuevaCategoria) {
    const hoy = new Date();
    const yyyy = hoy.getFullYear();
    const mm = String(hoy.getMonth() + 1).padStart(2, '0');
    const dd = String(hoy.getDate()).padStart(2, '0');
    
    const lunes = obtenerLunesDeSemana(hoy);
    const lyyyy = lunes.getFullYear();
    const lmm = String(lunes.getMonth() + 1).padStart(2, '0');
    const ldd = String(lunes.getDate()).padStart(2, '0');

    tarea.categoria = nuevaCategoria;
    tarea.fechaAsignada = `${yyyy}-${mm}-${dd}`;
    tarea.lunesAsignado = `${lyyyy}-${lmm}-${ldd}`;
}

function agregarNuevaTarea() {
    const inputTexto = document.getElementById('input-nueva-tarea');
    if (!inputTexto) return;
    
    const texto = inputTexto.value.trim();
    if (texto === "") return;

    const nuevaTarea = {
        id: Date.now(),
        texto: texto,
        importancia: document.getElementById('select-importancia').value,
        categoria: 'hoy',
        completada: false
    };

    actualizarSelloFechaTarea(nuevaTarea, document.getElementById('select-fecha-categoria').value);

    listaTareas.push(nuevaTarea);
    guardarYRenderizarTareas();
    inputTexto.value = "";
    
    if (typeof cargarVistaHoy === 'function') cargarVistaHoy();
    if (typeof renderizarVistaSemana === 'function') renderizarVistaSemana();
}

const btnAgregarTarea = document.getElementById('btn-agregar-tarea');
const inputNuevaTarea = document.getElementById('input-nueva-tarea');

if (btnAgregarTarea) btnAgregarTarea.addEventListener('click', agregarNuevaTarea);
if (inputNuevaTarea) {
    inputNuevaTarea.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            agregarNuevaTarea();
        }
    });
}

function guardarYRenderizarTareas() {
    localStorage.setItem('mis_tareas_agenda', JSON.stringify(listaTareas));
    renderizarTareas();
}

function renderizarTareas() {
    const contenedor = document.getElementById('contenedor-lista-tareas');
    const contenedorCompletadas = document.getElementById('lista-completadas');
    const spanCantCompletadas = document.getElementById('cant-completadas');
    
    if (!contenedor || !contenedorCompletadas) return;

    contenedor.innerHTML = "";
    contenedorCompletadas.innerHTML = "";

    const pendientes = listaTareas.filter(t => !t.completada);
    const completadas = listaTareas.filter(t => t.completada);

    if (spanCantCompletadas) spanCantCompletadas.textContent = completadas.length;

    const tareasAtrasadas = pendientes.filter(t => esTareaAtrasada(t));
    const tareasEnTiempo = pendientes.filter(t => !esTareaAtrasada(t));

    ordenCategorias.forEach(catClave => {
        let tareasDeGrupo = [];

        if (catClave === 'atrasadas') {
            tareasDeGrupo = tareasAtrasadas;
        } else {
            tareasDeGrupo = tareasEnTiempo.filter(t => t.categoria === catClave);
        }

        if (tareasDeGrupo.length > 0) {
            const grupoDiv = document.createElement('div');
            grupoDiv.classList.add('grupo-tarea-categoria');
            if (catClave === 'atrasadas') grupoDiv.classList.add('grupo-atrasadas');

            const titulo = document.createElement('div');
            titulo.classList.add('titulo-grupo-tarea');
            if (catClave === 'atrasadas') titulo.classList.add('titulo-atrasadas');
            titulo.textContent = nombresCategorias[catClave];
            grupoDiv.appendChild(titulo);

            tareasDeGrupo.forEach(tarea => {
                grupoDiv.appendChild(crearElementoTarjetaTarea(tarea, catClave === 'atrasadas'));
            });

            contenedor.appendChild(grupoDiv);
        }
    });

    completadas.forEach(tarea => {
        contenedorCompletadas.appendChild(crearElementoTarjetaTarea(tarea, false));
    });
}

function crearElementoTarjetaTarea(tarea, esAtrasada) {
    const card = document.createElement('div');
    card.classList.add('tarjeta-tarea', `prioridad-${tarea.importancia}`);
    if (tarea.completada) card.classList.add('completada');
    if (esAtrasada) card.classList.add('tarjeta-atrasada');

    const info = document.createElement('div');
    info.classList.add('info-tarea');

    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.checked = tarea.completada;
    
    checkbox.addEventListener('change', () => {
        if (checkbox.checked) {
            const rect = checkbox.getBoundingClientRect();
            if (typeof lanzarConfeti === 'function') lanzarConfeti(rect.left + 10, rect.top + 10);
            card.classList.add('completando-animacion');

            setTimeout(() => {
                tarea.completada = true;
                guardarYRenderizarTareas();
                if (typeof cargarVistaHoy === 'function') cargarVistaHoy();
                if (typeof renderizarVistaSemana === 'function') renderizarVistaSemana();
            }, 500);
        } else {
            tarea.completada = false;
            guardarYRenderizarTareas();
            if (typeof cargarVistaHoy === 'function') cargarVistaHoy();
            if (typeof renderizarVistaSemana === 'function') renderizarVistaSemana();
        }
    });

    const textoSpan = document.createElement('span');
    textoSpan.classList.add('texto-tarea');
    textoSpan.textContent = esAtrasada ? `⚠️ ${tarea.texto}` : tarea.texto;

    info.appendChild(checkbox);
    info.appendChild(textoSpan);
    card.appendChild(info);

    if (!tarea.completada) {
        const acciones = document.createElement('div');
        acciones.classList.add('acciones-tarea');

        if (tarea.categoria === 'hoy' && !esAtrasada) {
            const btnHoyNo = document.createElement('button');
            btnHoyNo.classList.add('btn-hoy-no');
            btnHoyNo.textContent = '⏸️ Hoy no';
            btnHoyNo.addEventListener('click', () => {
                actualizarSelloFechaTarea(tarea, 'manana');
                guardarYRenderizarTareas();
                if (typeof cargarVistaHoy === 'function') cargarVistaHoy();
                if (typeof renderizarVistaSemana === 'function') renderizarVistaSemana();
            });
            acciones.appendChild(btnHoyNo);
        }

        const btnAplazar = document.createElement('button');
        btnAplazar.classList.add('btn-aplazar');
        btnAplazar.textContent = esAtrasada ? '🔄 Reagendar' : '➡ Mover';
        btnAplazar.addEventListener('click', () => abrirModalAplazar(tarea));
        acciones.appendChild(btnAplazar);

        const btnBorrar = document.createElement('button');
        btnBorrar.classList.add('btn-borrar-tarea');
        btnBorrar.innerHTML = '&times;';
        btnBorrar.addEventListener('click', () => {
            listaTareas = listaTareas.filter(t => t.id !== tarea.id);
            guardarYRenderizarTareas();
            if (typeof cargarVistaHoy === 'function') cargarVistaHoy();
            if (typeof renderizarVistaSemana === 'function') renderizarVistaSemana();
        });
        acciones.appendChild(btnBorrar);

        card.appendChild(acciones);
    } else {
        const btnBorrar = document.createElement('button');
        btnBorrar.classList.add('btn-borrar-tarea');
        btnBorrar.innerHTML = '&times;';
        btnBorrar.addEventListener('click', () => {
            listaTareas = listaTareas.filter(t => t.id !== tarea.id);
            guardarYRenderizarTareas();
            if (typeof cargarVistaHoy === 'function') cargarVistaHoy();
            if (typeof renderizarVistaSemana === 'function') renderizarVistaSemana();
        });
        card.appendChild(btnBorrar);
    }

    return card;
}

const modalAplazar = document.getElementById('modal-aplazar-tarea');
const cerrarModalAplazar = document.getElementById('cerrar-modal-aplazar');
const btnConfirmarAplazar = document.getElementById('btn-confirmar-aplazar');

function abrirModalAplazar(tarea) {
    tareaEnEdicionId = tarea.id;
    const txt = document.getElementById('texto-tarea-a-mover');
    const select = document.getElementById('select-nueva-categoria-tarea');
    if (txt) txt.textContent = `"${tarea.texto}"`;
    if (select) select.value = tarea.categoria === 'atrasadas' ? 'hoy' : tarea.categoria;
    if (modalAplazar) modalAplazar.classList.remove('oculto');
}

if (cerrarModalAplazar && modalAplazar) {
    cerrarModalAplazar.addEventListener('click', () => modalAplazar.classList.add('oculto'));
}

if (btnConfirmarAplazar) {
    btnConfirmarAplazar.addEventListener('click', () => {
        const select = document.getElementById('select-nueva-categoria-tarea');
        const t = listaTareas.find(item => item.id === tareaEnEdicionId);
        if (t && select) {
            actualizarSelloFechaTarea(t, select.value);
            guardarYRenderizarTareas();
            if (typeof cargarVistaHoy === 'function') cargarVistaHoy();
            if (typeof renderizarVistaSemana === 'function') renderizarVistaSemana();
        }
        if (modalAplazar) modalAplazar.classList.add('oculto');
    });
}

const btnToggleCompletadas = document.getElementById('btn-toggle-completadas');
if (btnToggleCompletadas) {
    btnToggleCompletadas.addEventListener('click', () => {
        document.getElementById('lista-completadas').classList.toggle('oculto');
    });
}

// ==========================================
// 8. LÓGICA DE NOTAS (FORMATO RICO)
// ==========================================
let listaNotas = JSON.parse(localStorage.getItem('mis_notas_agenda')) || [];

const btnNuevaNota = document.getElementById('btn-nueva-nota');
if (btnNuevaNota) {
    btnNuevaNota.addEventListener('click', () => {
        const nuevaNota = { id: Date.now(), titulo: "", contenido: "", color: "amarillo" };
        listaNotas.unshift(nuevaNota);
        guardarYRenderizarNotas();
    });
}

function guardarYRenderizarNotas() {
    localStorage.setItem('mis_notas_agenda', JSON.stringify(listaNotas));
    renderizarNotas();
}

function renderizarNotas() {
    const contenedor = document.getElementById('contenedor-notas');
    if (!contenedor) return;
    contenedor.innerHTML = "";

    listaNotas.forEach(nota => {
        const postit = document.createElement('div');
        postit.classList.add('postit', `color-${nota.color}`);

        const inputTitulo = document.createElement('input');
        inputTitulo.type = 'text';
        inputTitulo.classList.add('postit-titulo');
        inputTitulo.placeholder = 'Título...';
        inputTitulo.value = nota.titulo;
        inputTitulo.addEventListener('input', () => {
            nota.titulo = inputTitulo.value;
            localStorage.setItem('mis_notas_agenda', JSON.stringify(listaNotas));
        });

        const toolbar = document.createElement('div');
        toolbar.classList.add('postit-toolbar');

        const btnBold = document.createElement('button');
        btnBold.type = 'button';
        btnBold.classList.add('btn-format-postit');
        btnBold.innerHTML = '<b>B</b>';
        btnBold.title = 'Negrita';
        btnBold.addEventListener('click', (e) => {
            e.preventDefault();
            document.execCommand('bold', false, null);
        });

        const btnItalic = document.createElement('button');
        btnItalic.type = 'button';
        btnItalic.classList.add('btn-format-postit');
        btnItalic.innerHTML = '<i>I</i>';
        btnItalic.title = 'Cursiva';
        btnItalic.addEventListener('click', (e) => {
            e.preventDefault();
            document.execCommand('italic', false, null);
        });

        const btnList = document.createElement('button');
        btnList.type = 'button';
        btnList.classList.add('btn-format-postit');
        btnList.innerHTML = '• Lista';
        btnList.title = 'Lista con viñetas';
        btnList.addEventListener('click', (e) => {
            e.preventDefault();
            document.execCommand('insertUnorderedList', false, null);
        });

        toolbar.appendChild(btnBold);
        toolbar.appendChild(btnItalic);
        toolbar.appendChild(btnList);

        const divContenido = document.createElement('div');
        divContenido.contentEditable = "true";
        divContenido.classList.add('postit-contenido');
        divContenido.innerHTML = nota.contenido || "";
        
        divContenido.addEventListener('input', () => {
            nota.contenido = divContenido.innerHTML;
            localStorage.setItem('mis_notas_agenda', JSON.stringify(listaNotas));
        });

        const pie = document.createElement('div');
        pie.classList.add('postit-pie');

        const selectorColores = document.createElement('div');
        selectorColores.classList.add('postit-colores');

        const colores = ['amarillo', 'rosa', 'menta', 'celeste', 'durazno', 'lavanda'];
        const hex = { amarillo: '#fff59d', rosa: '#f8bbd0', menta: '#c8e6c9', celeste: '#b3e5fc', durazno: '#ffe0b2', lavanda: '#e1bee7' };

        colores.forEach(c => {
            const dot = document.createElement('span');
            dot.classList.add('dot-color');
            dot.style.backgroundColor = hex[c];
            dot.addEventListener('click', () => {
                nota.color = c;
                guardarYRenderizarNotas();
            });
            selectorColores.appendChild(dot);
        });

        const btnBorrar = document.createElement('button');
        btnBorrar.classList.add('btn-borrar-tarea');
        btnBorrar.innerHTML = '&times;';
        btnBorrar.addEventListener('click', () => {
            listaNotas = listaNotas.filter(n => n.id !== nota.id);
            guardarYRenderizarNotas();
        });

        pie.appendChild(selectorColores);
        pie.appendChild(btnBorrar);

        postit.appendChild(inputTitulo);
        postit.appendChild(toolbar);
        postit.appendChild(divContenido);
        postit.appendChild(pie);

        contenedor.appendChild(postit);
    });
}

// ==========================================
// 9. LÓGICA HÁBITOS & PIXEL ART POTENCIADOS
// ==========================================
let listaHabitos = JSON.parse(localStorage.getItem('mis_habitos_agenda')) || [];
let indiceDibujoActual = parseInt(localStorage.getItem('indice_pixel_art_agenda')) || 0;

const ILUSTRACIONES_PIXEL = [
    {
        nombre: "Ranita",
        paleta: { 1: "#86efac", 2: "#15803d", 3: "#000000", 4: "#fef08a" },
        matriz: [
            0,1,1,0,0,0,0,1,1,0,
            1,3,1,1,0,0,1,1,3,1,
            1,1,1,1,1,1,1,1,1,1,
            1,1,1,1,1,1,1,1,1,1,
            1,3,1,1,1,1,1,1,3,1,
            0,1,1,3,3,3,3,1,1,0,
            0,0,1,4,4,4,4,1,0,0,
            0,1,1,4,4,4,4,1,1,0,
            1,1,1,1,1,1,1,1,1,1,
            2,2,0,0,0,0,0,0,2,2
        ]
    },
    {
        nombre: "Corazón",
        paleta: { 1: "#f43f5e", 2: "#fda4af" },
        matriz: [
            0,1,1,0,0,0,0,1,1,0,
            1,2,2,1,0,0,1,2,2,1,
            1,2,2,2,1,1,2,2,2,1,
            1,2,2,2,2,2,2,2,2,1,
            1,2,2,2,2,2,2,2,2,1,
            1,2,2,2,2,2,2,2,2,1,
            0,1,2,2,2,2,2,2,1,0,
            0,0,1,2,2,2,2,1,0,0,
            0,0,0,1,2,2,1,0,0,0,
            0,0,0,0,1,1,0,0,0,0
        ]
    },
    {
        nombre: "Honguito",
        paleta: { 1: "#ef4444", 2: "#ffffff", 3: "#fef08a", 4: "#78350f" },
        matriz: [
            0,0,0,1,1,1,1,0,0,0,
            0,0,1,1,2,2,1,1,0,0,
            0,1,1,2,2,2,2,1,1,0,
            0,1,2,2,1,1,2,2,1,0,
            1,1,1,1,1,1,1,1,1,1,
            0,0,3,3,3,3,3,3,0,0,
            0,0,3,4,3,3,4,3,0,0,
            0,0,3,3,3,3,3,0,0,0,
            0,0,3,3,3,3,3,0,0,0,
            0,0,0,3,3,3,0,0,0,0
        ]
    },
    {
        nombre: "Espada",
        paleta: { 1: "#38bdf8", 2: "#0284c7", 3: "#78350f", 4: "#f59e0b" },
        matriz: [
            0,0,0,0,0,0,0,2,1,2,
            0,0,0,0,0,0,2,1,1,2,
            0,0,0,0,0,2,1,1,2,0,
            0,0,0,0,2,1,1,2,0,0,
            0,0,0,2,1,1,2,0,0,0,
            0,4,4,1,1,2,0,0,0,0,
            0,4,1,4,2,0,0,0,0,0,
            0,0,3,4,4,0,0,0,0,0,
            0,3,3,0,0,0,0,0,0,0,
            3,3,0,0,0,0,0,0,0,0
        ]
    },
    {
        nombre: "Fantasmita",
        paleta: { 1: "#ffffff", 2: "#3b82f6", 3: "#000000" },
        matriz: [
            0,0,0,1,1,1,1,0,0,0,
            0,0,1,1,1,1,1,1,0,0,
            0,1,1,3,1,1,3,1,1,0,
            0,1,1,2,1,1,2,1,1,0,
            0,1,1,1,1,1,1,1,1,0,
            0,1,1,1,1,1,1,1,1,0,
            0,1,1,1,1,1,1,1,1,0,
            0,1,1,1,1,1,1,1,1,0,
            0,1,0,1,1,1,1,0,1,0,
            0,1,0,0,1,1,0,0,1,0
        ]
    },
    {
        nombre: "Pócima",
        paleta: { 1: "#9333ea", 2: "#c084fc", 3: "#abc9ce", 4: "#78350f" },
        matriz: [
            0,0,0,0,4,4,0,0,0,0,
            0,0,0,3,3,3,3,0,0,0,
            0,0,0,0,3,3,0,0,0,0,
            0,0,0,0,3,3,0,0,0,0,
            0,0,3,3,3,3,3,3,0,0,
            0,3,3,2,1,1,1,3,3,0,
            0,3,2,1,1,1,1,1,3,0,
            0,3,1,1,1,1,1,1,3,0,
            0,3,1,1,1,1,1,1,3,0,
            0,0,3,3,3,3,3,3,0,0
        ]
    },
    {
        nombre: "Estrella",
        paleta: { 1: "#eab308", 2: "#fef08a", 3: "#000000" },
        matriz: [
            0,0,0,0,1,1,0,0,0,0,
            0,0,0,1,2,2,1,0,0,0,
            0,0,1,1,2,2,1,1,0,0,
            1,1,1,1,2,2,1,1,1,1,
            1,2,3,1,2,2,1,3,2,1,
            0,1,3,1,1,1,1,3,1,0,
            0,0,1,1,1,1,1,1,0,0,
            0,1,1,1,0,0,1,1,1,0,
            1,1,1,0,0,0,0,1,1,1,
            1,1,0,0,0,0,0,0,1,1
        ]
    },
    {
        nombre: "Manzana",
        paleta: { 1: "#dc2626", 2: "#ef4444", 3: "#15803d", 4: "#78350f" },
        matriz: [
            0,0,0,0,4,4,3,3,0,0,
            0,0,0,0,4,3,3,3,3,0,
            0,0,1,1,1,0,3,3,0,0,
            0,1,2,2,1,1,1,1,1,0,
            1,2,2,1,1,1,1,1,1,1,
            1,2,1,1,1,1,1,1,1,1,
            1,1,1,1,1,1,1,1,1,1,
            0,1,1,1,1,1,1,1,1,0,
            0,1,1,1,1,1,1,1,1,0,
            0,0,1,1,0,0,1,1,0,0
        ]
    },
    {
        nombre: "Patito",
        paleta: { 1: "#facc15", 2: "#f97316", 3: "#000000" },
        matriz: [
            0,0,0,1,1,1,1,0,0,0,
            0,0,1,1,3,1,1,0,0,0,
            0,2,2,1,1,1,1,0,0,0,
            0,0,2,2,1,1,0,0,0,0,
            0,0,1,1,1,1,1,1,0,0,
            0,1,1,1,1,1,1,1,1,0,
            0,1,1,1,1,1,1,1,1,0,
            0,0,1,1,1,1,1,1,0,0,
            0,0,0,1,1,1,1,0,0,0,
            0,0,0,2,0,0,2,0,0,0
        ]
    },
    {
        nombre: "Gatito",
        paleta: { 1: "#f97316", 2: "#ffffff", 3: "#000000", 4: "#f43f5e" },
        matriz: [
            0,1,1,0,0,0,0,1,1,0,
            0,1,4,1,0,0,1,4,1,0,
            1,1,1,1,1,1,1,1,1,1,
            1,1,1,1,1,1,1,1,1,1,
            1,3,1,1,1,1,1,1,3,1,
            1,1,1,1,3,3,1,1,1,1,
            1,2,2,1,3,3,1,2,2,1,
            0,1,2,2,2,2,2,2,1,0,
            0,0,1,1,1,1,1,1,0,0,
            0,0,0,0,0,0,0,0,0,0
        ]
    },
    {
        nombre: "Flor",
        paleta: { 1: "#f43f5e", 2: "#facc15", 3: "#22c55e" },
        matriz: [
            0,0,0,1,1,1,1,0,0,0,
            0,0,1,1,1,1,1,1,0,0,
            0,1,1,2,2,2,2,1,1,0,
            1,1,2,2,2,2,2,2,1,1,
            1,1,2,2,2,2,2,2,1,1,
            0,1,1,2,2,2,2,1,1,0,
            0,0,1,1,3,3,1,1,0,0,
            0,0,0,3,3,3,3,0,0,0,
            0,0,0,0,3,3,0,0,0,0,
            0,0,0,0,3,3,0,0,0,0
        ]
    },
    {
        nombre: "Sol",
        paleta: { 1: "#f59e0b", 2: "#fde047", 3: "#000000" },
        matriz: [
            0,0,0,0,1,1,0,0,0,0,
            1,0,0,2,2,2,2,0,0,1,
            0,1,2,2,2,2,2,2,1,0,
            0,2,2,3,2,2,3,2,2,0,
            1,2,2,2,2,2,2,2,2,1,
            1,2,2,3,2,2,3,2,2,1,
            0,2,2,2,3,3,2,2,2,0,
            0,1,2,2,2,2,2,2,1,0,
            1,0,0,2,2,2,2,0,0,1,
            0,0,0,0,1,1,0,0,0,0
        ]
    },
    {
        nombre: "Ancla",
        paleta: { 1: "#3b4149" },
        matriz: [
            0,0,0,0,1,1,0,0,0,0,
            0,0,0,1,0,0,1,0,0,0,
            0,0,0,0,1,1,0,0,0,0,
            0,1,1,1,1,1,1,1,1,0,
            0,0,0,0,1,1,0,0,0,0,
            0,0,0,0,1,1,0,0,0,0,
            1,0,0,0,1,1,0,0,0,1,
            1,1,0,0,1,1,0,0,1,1,
            0,1,1,1,1,1,1,1,1,0,
            0,0,1,1,1,1,1,1,0,0
        ]
    }
];

const btnCambiarPixelArt = document.getElementById('btn-cambiar-pixel-art');
if (btnCambiarPixelArt) {
    btnCambiarPixelArt.addEventListener('click', () => {
        indiceDibujoActual = (indiceDibujoActual + 1) % ILUSTRACIONES_PIXEL.length;
        localStorage.setItem('indice_pixel_art_agenda', indiceDibujoActual);
        renderizarModuloHabitos();
    });
}

function renderizarPixelArtCanvas(porcentaje) {
    const canvasModulo = document.getElementById('contenedor-pixel-canvas-modulo');
    const canvasHoy = document.getElementById('contenedor-pixel-canvas-hoy');
    
    const barraModulo = document.getElementById('barra-progreso-pixel-modulo');
    const textoModulo = document.getElementById('texto-progreso-pixel-modulo');
    const textoHoy = document.getElementById('texto-progreso-pixel-hoy');

    const dibujo = ILUSTRACIONES_PIXEL[indiceDibujoActual] || ILUSTRACIONES_PIXEL[0];
    const pixelesAColorear = Math.floor((porcentaje / 100) * dibujo.matriz.length);

    [canvasModulo, canvasHoy].forEach(canvas => {
        if (canvas) {
            canvas.innerHTML = "";
            dibujo.matriz.forEach((valColor, i) => {
                const px = document.createElement('div');
                px.classList.add('pixel-cuadro');
                if (i < pixelesAColorear && valColor !== 0) {
                    px.style.backgroundColor = dibujo.paleta[valColor] || "#86efac";
                }
                canvas.appendChild(px);
            });
        }
    });

    if (barraModulo) barraModulo.style.width = `${porcentaje}%`;
    if (textoModulo) textoModulo.textContent = `Progreso Mensual: ${porcentaje}%`;
    if (textoHoy) textoHoy.textContent = `${porcentaje}%`;
}

function calcularRachaHabito(habito) {
    const diasProgramados = Array.isArray(habito.diasProgramados) ? habito.diasProgramados : [0, 1, 2, 3, 4, 5, 6];
    if (diasProgramados.length === 0) return 0;

    let racha = 0;
    const hoyObj = new Date();
    const hoyTemp = new Date(hoyObj.getFullYear(), hoyObj.getMonth(), hoyObj.getDate());
    let curr = new Date(hoyTemp);

    for (let i = 0; i < 365; i++) {
        const diaSem = curr.getDay();
        const yyyy = curr.getFullYear();
        const mm = String(curr.getMonth() + 1).padStart(2, '0');
        const dd = String(curr.getDate()).padStart(2, '0');
        const clave = `${yyyy}-${mm}-${dd}`;

        const esProgramado = diasProgramados.includes(diaSem);

        if (esProgramado) {
            const marcado = habito.historial && habito.historial[clave];
            if (marcado) {
                racha++;
            } else {
                if (curr.getTime() === hoyTemp.getTime()) {
                    // Si es hoy y aún no lo marca, continúa evaluando días anteriores
                } else {
                    break;
                }
            }
        }
        curr.setDate(curr.getDate() - 1);
    }

    return racha;
}

function obtenerResumenDias(dias) {
    if (!Array.isArray(dias) || dias.length === 7) return "Diario";
    if (dias.length === 5 && [1,2,3,4,5].every(d => dias.includes(d))) return "Lun-Vie";
    if (dias.length === 2 && [6,0].every(d => dias.includes(d))) return "Fin de semana";
    
    const nombresMap = { 1: "L", 2: "M", 3: "X", 4: "J", 5: "V", 6: "S", 0: "D" };
    const orden = [1, 2, 3, 4, 5, 6, 0];
    return orden.filter(d => dias.includes(d)).map(d => nombresMap[d]).join('-');
}

const btnAddHabitoModulo = document.getElementById('btn-add-habito-modulo');
const inputHabitoModulo = document.getElementById('input-habito-modulo');

function agregarHabitoDesdeModulo() {
    if (!inputHabitoModulo) return;
    const nombre = inputHabitoModulo.value.trim();
    if (nombre === "") return;

    const checks = Array.from(document.querySelectorAll('.chk-dia-modulo:checked')).map(c => parseInt(c.value));
    const diasProgramados = checks.length > 0 ? checks : [0, 1, 2, 3, 4, 5, 6];

    const nuevoHabito = { 
        id: Date.now(), 
        nombre: nombre, 
        diasProgramados: diasProgramados, 
        historial: {} 
    };

    listaHabitos.push(nuevoHabito);
    localStorage.setItem('mis_habitos_agenda', JSON.stringify(listaHabitos));
    inputHabitoModulo.value = "";
    
    renderizarModuloHabitos();
    renderizarHabitosHoy();
}

if (btnAddHabitoModulo) btnAddHabitoModulo.addEventListener('click', agregarHabitoDesdeModulo);
if (inputHabitoModulo) {
    inputHabitoModulo.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            agregarHabitoDesdeModulo();
        }
    });
}

function renderizarModuloHabitos() {
    const contenedorTabla = document.getElementById('tabla-habitos-contenedor');
    if (!contenedorTabla) return;

    contenedorTabla.innerHTML = "";
    const hoy = new Date();
    const mes = hoy.getMonth();
    const año = hoy.getFullYear();
    const totalDiasMes = new Date(año, mes + 1, 0).getDate();

    if (listaHabitos.length === 0) {
        contenedorTabla.innerHTML = "<p style='font-size:12px; color:#888; text-align:center; padding:20px;'>No tienes hábitos registrados. ¡Crea el primero arriba!</p>";
        renderizarPixelArtCanvas(0);
        return;
    }

    const grid = document.createElement('div');
    grid.classList.add('tabla-habitos-grid');

    const filaHeader = document.createElement('div');
    filaHeader.classList.add('fila-habito-header');

    const celdaNombreEmpty = document.createElement('div');
    celdaNombreEmpty.classList.add('nombre-habito-celda');
    celdaNombreEmpty.innerHTML = "<span class='nombre-habito-texto'>HÁBITO</span>";
    filaHeader.appendChild(celdaNombreEmpty);

    const scrollDiasHeader = document.createElement('div');
    scrollDiasHeader.classList.add('dias-habito-scroll');

    for (let d = 1; d <= totalDiasMes; d++) {
        const celdaD = document.createElement('div');
        celdaD.classList.add('celda-dia-habito', 'header');
        celdaD.textContent = d;
        scrollDiasHeader.appendChild(celdaD);
    }
    filaHeader.appendChild(scrollDiasHeader);
    grid.appendChild(filaHeader);

    let totalCasillasPosibles = 0;
    let totalCasillasCompletadas = 0;

    listaHabitos.forEach(habito => {
        const fila = document.createElement('div');
        fila.classList.add('fila-habito-item');

        const celdaNombre = document.createElement('div');
        celdaNombre.classList.add('nombre-habito-celda');

        const racha = calcularRachaHabito(habito);
        const resumenDias = obtenerResumenDias(habito.diasProgramados);

        const divInfo = document.createElement('div');
        divInfo.style.display = 'flex';
        divInfo.style.flexDirection = 'column';
        divInfo.style.gap = '2px';

        const spanTexto = document.createElement('span');
        spanTexto.classList.add('nombre-habito-texto');
        spanTexto.textContent = habito.nombre;

        const divSubBadges = document.createElement('div');
        divSubBadges.style.display = 'flex';
        divSubBadges.style.gap = '4px';
        divSubBadges.style.alignItems = 'center';

        const badgeDias = document.createElement('span');
        badgeDias.classList.add('badge-dias-resumen');
        badgeDias.textContent = resumenDias;
        divSubBadges.appendChild(badgeDias);

        if (racha > 0) {
            const badgeRacha = document.createElement('span');
            badgeRacha.classList.add('badge-racha');
            badgeRacha.textContent = `🔥 ${racha}`;
            divSubBadges.appendChild(badgeRacha);
        }

        divInfo.appendChild(spanTexto);
        divInfo.appendChild(divSubBadges);

        const btnBorrar = document.createElement('button');
        btnBorrar.classList.add('btn-del-mini');
        btnBorrar.innerHTML = '&times;';
        btnBorrar.addEventListener('click', () => {
            listaHabitos = listaHabitos.filter(h => h.id !== habito.id);
            localStorage.setItem('mis_habitos_agenda', JSON.stringify(listaHabitos));
            renderizarModuloHabitos();
            renderizarHabitosHoy();
        });

        celdaNombre.appendChild(divInfo);
        celdaNombre.appendChild(btnBorrar);

        const scrollDias = document.createElement('div');
        scrollDias.classList.add('dias-habito-scroll');

        const diasProgramados = Array.isArray(habito.diasProgramados) ? habito.diasProgramados : [0,1,2,3,4,5,6];

        for (let d = 1; d <= totalDiasMes; d++) {
            const fechaDiaObj = new Date(año, mes, d);
            const diaSemana = fechaDiaObj.getDay();
            const claveFecha = `${año}-${String(mes + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
            const aplica = diasProgramados.includes(diaSemana);

            const celdaCheck = document.createElement('div');
            celdaCheck.classList.add('celda-dia-habito');

            if (!aplica) {
                celdaCheck.classList.add('no-aplica');
                celdaCheck.textContent = "•";
                celdaCheck.title = "Día no programado";
            } else {
                totalCasillasPosibles++;
                const estaMarcado = habito.historial && habito.historial[claveFecha];
                if (estaMarcado) {
                    totalCasillasCompletadas++;
                    celdaCheck.classList.add('marcado');
                    celdaCheck.textContent = "✓";
                }

                celdaCheck.addEventListener('click', () => {
                    if (!habito.historial) habito.historial = {};
                    habito.historial[claveFecha] = !estaMarcado;
                    localStorage.setItem('mis_habitos_agenda', JSON.stringify(listaHabitos));
                    renderizarModuloHabitos();
                    renderizarHabitosHoy();
                });
            }

            scrollDias.appendChild(celdaCheck);
        }

        fila.appendChild(celdaNombre);
        fila.appendChild(scrollDias);
        grid.appendChild(fila);
    });

    contenedorTabla.appendChild(grid);

    const META_FLEXIBLE = 80;
    const porcentajeReal = totalCasillasPosibles > 0 ? (totalCasillasCompletadas / totalCasillasPosibles) * 100 : 0;
    const porcentajeAjustado = Math.min(100, Math.round((porcentajeReal / META_FLEXIBLE) * 100));

    renderizarPixelArtCanvas(porcentajeAjustado);
}

// ==========================================
// 10. LÓGICA VISTA HOY
// ==========================================
function obtenerClaveHoy() {
    const hoy = new Date();
    return `${hoy.getFullYear()}-${String(hoy.getMonth() + 1).padStart(2, '0')}-${String(hoy.getDate()).padStart(2, '0')}`;
}

const btnCrearHabito = document.getElementById('btn-crear-habito');
const inputNuevoHabito = document.getElementById('input-nuevo-habito');

function agregarHabitoDesdeHoy() {
    if (!inputNuevoHabito) return;
    const nombre = inputNuevoHabito.value.trim();
    if (nombre === "") return;

    const checks = Array.from(document.querySelectorAll('.chk-dia-hoy:checked')).map(c => parseInt(c.value));
    const diasProgramados = checks.length > 0 ? checks : [0, 1, 2, 3, 4, 5, 6];

    const nuevoHabito = { 
        id: Date.now(), 
        nombre: nombre, 
        diasProgramados: diasProgramados, 
        historial: {} 
    };

    listaHabitos.push(nuevoHabito);
    localStorage.setItem('mis_habitos_agenda', JSON.stringify(listaHabitos));
    inputNuevoHabito.value = "";
    
    renderizarHabitosHoy();
    renderizarModuloHabitos();
}

if (btnCrearHabito) btnCrearHabito.addEventListener('click', agregarHabitoDesdeHoy);
if (inputNuevoHabito) {
    inputNuevoHabito.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            agregarHabitoDesdeHoy();
        }
    });
}

function renderizarHabitosHoy() {
    const contenedor = document.getElementById('contenedor-habitos-hoy');
    const badgeTexto = document.getElementById('progreso-habitos-texto');
    if (!contenedor) return;

    contenedor.innerHTML = "";
    const claveHoy = obtenerClaveHoy();
    const hoyReal = new Date();
    const diaSemanaHoy = hoyReal.getDay();

    if (listaHabitos.length === 0) {
        contenedor.innerHTML = "<span style='font-size:12px; color:#888;'>No has creado hábitos aún. ¡Agrega el primero arriba!</span>";
        if (badgeTexto) badgeTexto.textContent = "0/0 completados";
        return;
    }

    let habitosProgramadosHoy = 0;
    let completadosHoy = 0;

    listaHabitos.forEach(habito => {
        const dias = Array.isArray(habito.diasProgramados) ? habito.diasProgramados : [0,1,2,3,4,5,6];
        const tocaHoy = dias.includes(diaSemanaHoy);
        const estaHecho = habito.historial && habito.historial[claveHoy];
        const racha = calcularRachaHabito(habito);

        if (tocaHoy) {
            habitosProgramadosHoy++;
            if (estaHecho) completadosHoy++;
        }

        const div = document.createElement('div');
        div.classList.add('item-habito-hoy');
        if (estaHecho) div.classList.add('hecho');
        if (!tocaHoy) div.classList.add('descanso');

        const divIzq = document.createElement('div');
        divIzq.style.display = 'flex';
        divIzq.style.alignItems = 'center';
        divIzq.style.gap = '8px';

        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.checked = !!estaHecho;
        checkbox.addEventListener('change', () => {
            if (!habito.historial) habito.historial = {};
            habito.historial[claveHoy] = checkbox.checked;
            localStorage.setItem('mis_habitos_agenda', JSON.stringify(listaHabitos));
            
            renderizarHabitosHoy();
            renderizarModuloHabitos();
        });

        const spanNombre = document.createElement('span');
        spanNombre.textContent = habito.nombre;

        divIzq.appendChild(checkbox);
        divIzq.appendChild(spanNombre);

        if (!tocaHoy) {
            const tagDescanso = document.createElement('span');
            tagDescanso.classList.add('badge-dias-resumen');
            tagDescanso.textContent = '⏸️ Descanso';
            divIzq.appendChild(tagDescanso);
        } else if (racha > 0) {
            const tagRacha = document.createElement('span');
            tagRacha.classList.add('badge-racha');
            tagRacha.textContent = `🔥 ${racha}`;
            divIzq.appendChild(tagRacha);
        }

        const btnBorrar = document.createElement('button');
        btnBorrar.classList.add('btn-del-mini');
        btnBorrar.innerHTML = '&times;';
        btnBorrar.addEventListener('click', () => {
            listaHabitos = listaHabitos.filter(h => h.id !== habito.id);
            localStorage.setItem('mis_habitos_agenda', JSON.stringify(listaHabitos));
            
            renderizarHabitosHoy();
            renderizarModuloHabitos();
        });

        div.appendChild(divIzq);
        div.appendChild(btnBorrar);
        contenedor.appendChild(div);
    });

    if (badgeTexto) {
        if (habitosProgramadosHoy > 0 && completadosHoy >= habitosProgramadosHoy) {
            // Si recién se activa el Día Perfecto, ¡lanzamos ráfagas de confeti festivo! 🎉
            if (!badgeTexto.classList.contains('perfecto')) {
                const centroX = window.innerWidth / 2;
                lanzarConfeti(centroX, 180);
                setTimeout(() => lanzarConfeti(centroX - 120, 220), 180);
                setTimeout(() => lanzarConfeti(centroX + 120, 220), 360);
            }
            badgeTexto.textContent = `🌟 ¡Día Perfecto! (${completadosHoy}/${habitosProgramadosHoy})`;
            badgeTexto.classList.add('perfecto');
        } else {
            badgeTexto.textContent = `${completadosHoy}/${habitosProgramadosHoy} completados`;
            badgeTexto.classList.remove('perfecto');
        }
    }
}

const btnAddEventoHoy = document.getElementById('btn-add-evento-hoy');
const inputEventoHoy = document.getElementById('input-evento-hoy');
const selectTipoEventoHoy = document.getElementById('select-tipo-evento-hoy');

if (btnAddEventoHoy && inputEventoHoy) {
    btnAddEventoHoy.addEventListener('click', () => {
        const texto = inputEventoHoy.value.trim();
        if (texto === "") return;

        const tipo = selectTipoEventoHoy ? selectTipoEventoHoy.value : '🎈 Cumpleaños';
        const claveHoy = obtenerClaveHoy();
        const datos = JSON.parse(localStorage.getItem(claveHoy)) || {};
        const eventosActuales = datos.eventos || [];

        eventosActuales.push({ tipo: tipo, texto: texto });
        datos.eventos = eventosActuales;

        localStorage.setItem(claveHoy, JSON.stringify(datos));
        inputEventoHoy.value = "";

        cargarVistaHoy();
        renderizarCalendario();
        if (typeof renderizarVistaSemana === 'function') renderizarVistaSemana();
        if (typeof renderizarVistaAno === 'function') renderizarVistaAno();
    });
}

const btnAddTareaHoy = document.getElementById('btn-add-tarea-hoy');
const inputTareaHoy = document.getElementById('input-tarea-hoy');

if (btnAddTareaHoy && inputTareaHoy) {
    btnAddTareaHoy.addEventListener('click', () => {
        const texto = inputTareaHoy.value.trim();
        if (texto === "") return;

        const nuevaTarea = {
            id: Date.now(),
            texto: texto,
            importancia: 'media',
            categoria: 'hoy',
            completada: false
        };

        listaTareas.push(nuevaTarea);
        guardarYRenderizarTareas();
        inputTareaHoy.value = "";
        cargarVistaHoy();
    });
}

function cargarVistaHoy() {
    actualizarSelectCategorias();
    const claveHoy = obtenerClaveHoy();
    const datos = JSON.parse(localStorage.getItem(claveHoy)) || {};

    const hoyLuna = document.getElementById('hoy-fase-lunar');
    if (hoyLuna) hoyLuna.textContent = obtenerInfoLuna(new Date());

    const animoHoy = datos.animo || "";
    document.querySelectorAll('.btn-animo-hoy').forEach(btn => {
        btn.classList.toggle('seleccionado', btn.getAttribute('data-animo') === animoHoy);
    });

    const comidas = datos.comidasDetalle || {};
    if (document.getElementById('hoy-desayuno')) document.getElementById('hoy-desayuno').value = comidas.desayuno || "";
    if (document.getElementById('hoy-almuerzo')) document.getElementById('hoy-almuerzo').value = comidas.almuerzo || "";
    if (document.getElementById('hoy-cena')) document.getElementById('hoy-cena').value = comidas.cena || "";
    if (document.getElementById('hoy-snacks')) document.getElementById('hoy-snacks').value = comidas.snacks || "";

    if (document.getElementById('hoy-resumen')) document.getElementById('hoy-resumen').value = datos.resumen || "";
    if (document.getElementById('hoy-casa')) document.getElementById('hoy-casa').value = datos.casa || "";
    if (document.getElementById('hoy-hobbies')) document.getElementById('hoy-hobbies').value = datos.hobbies || "";

    imagenesBase64Actuales = datos.imagenesBase64 || [];
    renderizarGaleriaHoy();

    const miniTareasUl = document.getElementById('mini-tareas-hoy');
    if (miniTareasUl) {
        miniTareasUl.innerHTML = "";
        
        const hoyReal = new Date();
        const diaSemanaHoy = hoyReal.getDay();
        const esFinDeSemanaHoy = (diaSemanaHoy === 0 || diaSemanaHoy === 6);

        const tareasHoy = listaTareas.filter(t => {
            if (t.completada) return false;
            if (esTareaAtrasada(t)) return true;
            if (t.categoria === 'hoy') return true;
            if (t.categoria === 'esta_semana') return true;
            if (t.categoria === 'fin_semana' && esFinDeSemanaHoy) return true;
            return false;
        });

        tareasHoy.sort((a, b) => esTareaAtrasada(b) - esTareaAtrasada(a));

        if (tareasHoy.length === 0) {
            miniTareasUl.innerHTML = "<li><i style='font-size:11px; color:#aaa;'>Sin tareas activas para hoy</i></li>";
        } else {
            tareasHoy.forEach(t => {
                const esAtrasada = esTareaAtrasada(t);
                const li = document.createElement('li');
                li.classList.add('mini-item-hoy');
                if (esAtrasada) li.classList.add('atrasada-mini');

                const span = document.createElement('span');
                if (esAtrasada) {
                    span.textContent = `⚠️ ${t.texto}`;
                    span.style.fontWeight = "700";
                } else if (t.categoria === 'esta_semana') {
                    span.textContent = `📅 ${t.texto}`;
                } else {
                    span.textContent = t.texto;
                }

                const checkbox = document.createElement('input');
                checkbox.type = 'checkbox';
                checkbox.checked = t.completada;
                checkbox.addEventListener('change', () => {
                    t.completada = checkbox.checked;
                    guardarYRenderizarTareas();
                    cargarVistaHoy();
                    renderizarVistaSemana();
                });

                const btnBorrar = document.createElement('button');
                btnBorrar.classList.add('btn-del-mini');
                btnBorrar.innerHTML = '&times;';
                btnBorrar.addEventListener('click', () => {
                    listaTareas = listaTareas.filter(x => x.id !== t.id);
                    guardarYRenderizarTareas();
                    cargarVistaHoy();
                    renderizarVistaSemana();
                });

                const divIzq = document.createElement('div');
                divIzq.style.display = 'flex';
                divIzq.style.gap = '6px';
                divIzq.appendChild(checkbox);
                divIzq.appendChild(span);

                li.appendChild(divIzq);
                li.appendChild(btnBorrar);
                miniTareasUl.appendChild(li);
            });
        }
    }

    const miniEventosUl = document.getElementById('mini-eventos-hoy');
    if (miniEventosUl) {
        miniEventosUl.innerHTML = "";
        const eventosHoy = datos.eventos || [];
        if (eventosHoy.length === 0) {
            miniEventosUl.innerHTML = "<li><i style='font-size:11px; color:#aaa;'>Sin eventos para hoy</i></li>";
        } else {
            eventosHoy.forEach((ev, index) => {
                let tipo = typeof ev === 'string' ? "🙃 Otros" : (ev.tipo || "📌 Evento");
                let texto = typeof ev === 'string' ? ev : (ev.texto || "");
                const estilo = buscarEstiloCategoria(tipo);

                const li = document.createElement('li');
                li.classList.add('mini-item-hoy');
                li.style.backgroundColor = estilo.bg;
                li.style.color = estilo.color;

                const span = document.createElement('span');
                span.textContent = `${tipo} - ${texto}`;

                const btnBorrar = document.createElement('button');
                btnBorrar.classList.add('btn-del-mini');
                btnBorrar.innerHTML = '&times;';
                btnBorrar.style.color = estilo.color;
                btnBorrar.addEventListener('click', () => {
                    eventosHoy.splice(index, 1);
                    datos.eventos = eventosHoy;
                    localStorage.setItem(claveHoy, JSON.stringify(datos));
                    cargarVistaHoy();
                    renderizarCalendario();
                    renderizarVistaSemana();
                    if (typeof renderizarVistaAno === 'function') renderizarVistaAno();
                });

                li.appendChild(span);
                li.appendChild(btnBorrar);
                miniEventosUl.appendChild(li);
            });
        }
    }

    renderizarHabitosHoy();
    actualizarMedidorAnimoMes();
}

function guardarDatosHoy() {
    const claveHoy = obtenerClaveHoy();
    const datosAnteriores = JSON.parse(localStorage.getItem(claveHoy)) || {};
    const animoSel = document.querySelector('.btn-animo-hoy.seleccionado');

    const datosHoy = {
        ...datosAnteriores,
        animo: animoSel ? animoSel.getAttribute('data-animo') : "",
        comidasDetalle: {
            desayuno: document.getElementById('hoy-desayuno') ? document.getElementById('hoy-desayuno').value : "",
            almuerzo: document.getElementById('hoy-almuerzo') ? document.getElementById('hoy-almuerzo').value : "",
            cena: document.getElementById('hoy-cena') ? document.getElementById('hoy-cena').value : "",
            snacks: document.getElementById('hoy-snacks') ? document.getElementById('hoy-snacks').value : ""
        },
        resumen: document.getElementById('hoy-resumen') ? document.getElementById('hoy-resumen').value : "",
        casa: document.getElementById('hoy-casa') ? document.getElementById('hoy-casa').value : "",
        hobbies: document.getElementById('hoy-hobbies') ? document.getElementById('hoy-hobbies').value : "",
        imagenesBase64: imagenesBase64Actuales
    };

    localStorage.setItem(claveHoy, JSON.stringify(datosHoy));
    renderizarCalendario();
    actualizarMedidorAnimoMes();
}

function actualizarMedidorAnimoMes() {
    const hoy = new Date();
    const mes = hoy.getMonth();
    const año = hoy.getFullYear();
    const totalDiasMes = new Date(año, mes + 1, 0).getDate();

    let sumaPuntos = 0;
    let diasRegistrados = 0;
    const valoresAnimo = { "😄": 100, "🙂": 75, "😐": 50, "😔": 25, "😡": 0 };

    for (let d = 1; d <= totalDiasMes; d++) {
        const clave = `${año}-${String(mes + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
        const data = JSON.parse(localStorage.getItem(clave));
        if (data && data.animo && valoresAnimo[data.animo] !== undefined) {
            sumaPuntos += valoresAnimo[data.animo];
            diasRegistrados++;
        }
    }

    const porcentaje = diasRegistrados > 0 ? Math.round(sumaPuntos / diasRegistrados) : 50;
    const marcador = document.getElementById('marcador-animo-mes');
    const textoPorcentaje = document.getElementById('texto-porcentaje-animo');
    
    if (marcador && textoPorcentaje) {
        marcador.style.left = `${porcentaje}%`;
        textoPorcentaje.textContent = `${porcentaje}% Positivo`;
    }
}

document.querySelectorAll('.btn-animo-hoy').forEach(btn => {
    btn.addEventListener('click', () => {
        document.querySelectorAll('.btn-animo-hoy').forEach(b => b.classList.remove('seleccionado'));
        btn.classList.add('seleccionado');
        guardarDatosHoy();
    });
});

['hoy-desayuno', 'hoy-almuerzo', 'hoy-cena', 'hoy-snacks', 'hoy-resumen', 'hoy-casa', 'hoy-hobbies'].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.addEventListener('input', guardarDatosHoy);
});

// ==========================================
// 11. GALERÍAS Y LIGHTBOX
// ==========================================
function renderizarGaleriaModal() {
    const contenedor = document.getElementById('contenedor-galeria');
    if (!contenedor) return;
    contenedor.innerHTML = "";

    imagenesBase64Actuales.forEach((imgBase64, index) => {
        const item = document.createElement('div');
        item.classList.add('item-galeria');

        const img = document.createElement('img');
        img.src = imgBase64;
        img.addEventListener('click', () => {
            const modalLB = document.getElementById('modal-lightbox');
            const imgAmp = document.getElementById('imagen-ampliada');
            if (imgAmp && modalLB) {
                imgAmp.src = imgBase64;
                modalLB.classList.remove('oculto');
            }
        });

        const btnBorrar = document.createElement('button');
        btnBorrar.type = 'button';
        btnBorrar.classList.add('btn-eliminar-foto');
        btnBorrar.innerHTML = '&times;';
        btnBorrar.addEventListener('click', (e) => {
            e.stopPropagation();
            imagenesBase64Actuales.splice(index, 1);
            renderizarGaleriaModal();
            const datosPrevios = JSON.parse(localStorage.getItem(diaSeleccionadoClave)) || {};
            datosPrevios.imagenesBase64 = imagenesBase64Actuales;
            localStorage.setItem(diaSeleccionadoClave, JSON.stringify(datosPrevios));
        });

        item.appendChild(img);
        item.appendChild(btnBorrar);
        contenedor.appendChild(item);
    });
}

function renderizarGaleriaHoy() {
    const contenedor = document.getElementById('hoy-contenedor-galeria');
    if (!contenedor) return;
    contenedor.innerHTML = "";

    imagenesBase64Actuales.forEach((imgBase64, index) => {
        const item = document.createElement('div');
        item.classList.add('item-galeria');

        const img = document.createElement('img');
        img.src = imgBase64;
        img.addEventListener('click', () => {
            const modalLB = document.getElementById('modal-lightbox');
            const imgAmp = document.getElementById('imagen-ampliada');
            if (imgAmp && modalLB) {
                imgAmp.src = imgBase64;
                modalLB.classList.remove('oculto');
            }
        });

        const btnBorrar = document.createElement('button');
        btnBorrar.type = 'button';
        btnBorrar.classList.add('btn-eliminar-foto');
        btnBorrar.innerHTML = '&times;';
        btnBorrar.addEventListener('click', (e) => {
            e.stopPropagation();
            imagenesBase64Actuales.splice(index, 1);
            renderizarGaleriaHoy();
            guardarDatosHoy();
        });

        item.appendChild(img);
        item.appendChild(btnBorrar);
        contenedor.appendChild(item);
    });
}

const hoyInputImg = document.getElementById('hoy-input-imagen');
const hoyBtnSubirImg = document.getElementById('hoy-btn-subir-imagen');

if (hoyBtnSubirImg && hoyInputImg) {
    hoyBtnSubirImg.addEventListener('click', () => hoyInputImg.click());
    hoyInputImg.addEventListener('change', (e) => {
        const archivos = Array.from(e.target.files);
        if (archivos.length === 0) return;

        let leidos = 0;
        archivos.forEach(archivo => {
            const lector = new FileReader();
            lector.onload = function(evento) {
                imagenesBase64Actuales.push(evento.target.result);
                leidos++;
                if (leidos === archivos.length) {
                    renderizarGaleriaHoy();
                    guardarDatosHoy();
                    hoyInputImg.value = "";
                }
            };
            lector.readAsDataURL(archivo);
        });
    });
}

const modalInputImg = document.getElementById('input-imagen');
const modalBtnSubirImg = document.getElementById('btn-subir-imagen');

if (modalBtnSubirImg && modalInputImg) {
    modalBtnSubirImg.addEventListener('click', () => modalInputImg.click());
    modalInputImg.addEventListener('change', (e) => {
        const archivos = Array.from(e.target.files);
        if (archivos.length === 0) return;

        let leidos = 0;
        archivos.forEach(archivo => {
            const lector = new FileReader();
            lector.onload = function(evento) {
                imagenesBase64Actuales.push(evento.target.result);
                leidos++;
                if (leidos === archivos.length) {
                    renderizarGaleriaModal();
                    modalInputImg.value = "";
                }
            };
            lector.readAsDataURL(archivo);
        });
    });
}

const cerrarLB = document.getElementById('cerrar-lightbox');
const modalLB = document.getElementById('modal-lightbox');
if (cerrarLB && modalLB) {
    cerrarLB.addEventListener('click', () => modalLB.classList.add('oculto'));
    modalLB.addEventListener('click', (e) => {
        if (e.target === modalLB) modalLB.classList.add('oculto');
    });
}

// ==========================================
// 12. LÓGICA MÓDULO SEMANA
// ==========================================
let offsetSemanas = 0;
let filtroSemanaActual = "todos";

function obtenerLunesDeSemana(fechaBase) {
    const d = new Date(fechaBase);
    const day = d.getDay();
    const diff = d.getDate() - day + (day === 0 ? -6 : 1);
    return new Date(d.setDate(diff));
}

const btnEditarEnfoque = document.getElementById('btn-editar-enfoque-semana');
if (btnEditarEnfoque) {
    btnEditarEnfoque.addEventListener('click', () => {
        const vLectura = document.getElementById('vista-lectura-enfoque');
        const vEdicion = document.getElementById('vista-edicion-enfoque');
        if (!vLectura || !vEdicion) return;
        
        if (vEdicion.classList.contains('oculto')) {
            vLectura.classList.add('oculto');
            vEdicion.classList.remove('oculto');
            btnEditarEnfoque.textContent = "💾 Guardar";
        } else {
            guardarDatosSemana();
            vEdicion.classList.add('oculto');
            vLectura.classList.remove('oculto');
            btnEditarEnfoque.textContent = "✏️ Editar";
            renderizarVistaSemana();
        }
    });
}

const btnEditarPrioridades = document.getElementById('btn-editar-prioridades-semana');
if (btnEditarPrioridades) {
    btnEditarPrioridades.addEventListener('click', () => {
        const vLectura = document.getElementById('vista-lectura-prioridades');
        const vEdicion = document.getElementById('vista-edicion-prioridades');
        if (!vLectura || !vEdicion) return;
        
        if (vEdicion.classList.contains('oculto')) {
            vLectura.classList.add('oculto');
            vEdicion.classList.remove('oculto');
            btnEditarPrioridades.textContent = "💾 Guardar";
        } else {
            guardarDatosSemana();
            vEdicion.classList.add('oculto');
            vLectura.classList.remove('oculto');
            btnEditarPrioridades.textContent = "✏️ Editar";
            renderizarVistaSemana();
        }
    });
}

document.querySelectorAll('.btn-filtro-semana').forEach(btn => {
    btn.addEventListener('click', () => {
        document.querySelectorAll('.btn-filtro-semana').forEach(b => b.classList.remove('activo'));
        btn.classList.add('activo');
        filtroSemanaActual = btn.getAttribute('data-filtro');
        renderizarVistaSemana();
    });
});

function renderizarVistaSemana() {
    const contenedorParrilla = document.getElementById('parrilla-semana-dias');
    const labelRango = document.getElementById('label-rango-semana');
    if (!contenedorParrilla) return;

    contenedorParrilla.innerHTML = "";
    const hoyReal = new Date();
    hoyReal.setHours(0,0,0,0);

    const fechaLunes = obtenerLunesDeSemana(new Date(hoyReal.getTime() + (offsetSemanas * 7 * 24 * 60 * 60 * 1000)));
    const fechaDomingo = new Date(fechaLunes);
    fechaDomingo.setDate(fechaLunes.getDate() + 6);

    const opcionesMes = { month: 'short', day: 'numeric' };
    if (labelRango) {
        labelRango.textContent = `${fechaLunes.toLocaleDateString('es-ES', opcionesMes)} - ${fechaDomingo.toLocaleDateString('es-ES', opcionesMes)}`;
    }

    const claveSemana = `semana_${fechaLunes.getFullYear()}_${fechaLunes.getMonth() + 1}_${fechaLunes.getDate()}`;
    const datosSemana = JSON.parse(localStorage.getItem(claveSemana)) || {};

    const txtEnfoque = datosSemana.enfoque || "";
    const elDisplayEnfoque = document.getElementById('texto-display-enfoque');
    const inputEnfoque = document.getElementById('texto-enfoque-semana');
    if (elDisplayEnfoque) elDisplayEnfoque.textContent = txtEnfoque.trim() !== "" ? txtEnfoque : "Ninguno";
    if (inputEnfoque) inputEnfoque.value = txtEnfoque;

    const prios = datosSemana.prioridades || ["", "", "", ""];
    const olDisplayPrios = document.getElementById('lista-display-prioridades');
    if (olDisplayPrios) {
        olDisplayPrios.innerHTML = "";
        prios.forEach((p, i) => {
            const li = document.createElement('li');
            li.innerHTML = `${i + 1}. ${p.trim() !== "" ? `<strong>${p}</strong>` : `<span class="vacio">...</span>`}`;
            olDisplayPrios.appendChild(li);
        });
    }

    ['prio-semana-1', 'prio-semana-2', 'prio-semana-3', 'prio-semana-4'].forEach((id, idx) => {
        const inputPrio = document.getElementById(id);
        if (inputPrio) inputPrio.value = prios[idx] || "";
    });

    const nombresDias = ["lunes", "martes", "miércoles", "jueves", "viernes", "sábado", "domingo"];
    const nombresMeses = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"];

    for (let i = 0; i < 7; i++) {
        const diaColumna = new Date(fechaLunes);
        diaColumna.setDate(fechaLunes.getDate() + i);
        diaColumna.setHours(0,0,0,0);

        const claveFecha = `${diaColumna.getFullYear()}-${String(diaColumna.getMonth() + 1).padStart(2, '0')}-${String(diaColumna.getDate()).padStart(2, '0')}`;
        const datosDia = JSON.parse(localStorage.getItem(claveFecha)) || {};

        const col = document.createElement('div');
        col.classList.add('columna-dia-semana');

        const esHoy = diaColumna.getTime() === hoyReal.getTime();
        if (esHoy) col.classList.add('es-hoy');

        const header = document.createElement('div');
        header.classList.add('cabecera-col-dia');
        header.innerHTML = `<span class="nombre-dia-semana">${nombresDias[i]}</span><span class="num-dia-semana">${diaColumna.getDate()}</span>`;
        col.appendChild(header);

        const ulContenido = document.createElement('ul');
        ulContenido.classList.add('lista-items-semana');

        let tieneItems = false;

        if (filtroSemanaActual === "todos" || filtroSemanaActual === "eventos") {
            if (datosDia.eventos && datosDia.eventos.length > 0) {
                datosDia.eventos.forEach(ev => {
                    if (!ev) return;
                    let tipo = typeof ev === 'string' ? "🙃 Otros" : (ev.tipo || "📌 Evento");
                    let texto = typeof ev === 'string' ? ev : (ev.texto || "");
                    const estilo = buscarEstiloCategoria(tipo);

                    const li = document.createElement('li');
                    li.classList.add('item-semana-tag');
                    li.style.backgroundColor = estilo.bg;
                    li.style.color = estilo.color;
                    const emoji = tipo ? tipo.split(' ')[0] : '📌';
                    li.innerHTML = `${emoji} ${texto}`;
                    ulContenido.appendChild(li);
                    tieneItems = true;
                });
            }
        }

        if (filtroSemanaActual === "todos" || filtroSemanaActual === "tareas") {
            listaTareas.filter(t => !t.completada && !esTareaAtrasada(t)).forEach(t => {
                let correspondeADia = false;

                if (t.categoria === 'hoy') {
                    if (esHoy && offsetSemanas === 0) correspondeADia = true;
                } else if (t.categoria === 'manana') {
                    const mananaReal = new Date(hoyReal);
                    mananaReal.setDate(hoyReal.getDate() + 1);
                    if (diaColumna.getTime() === mananaReal.getTime()) correspondeADia = true;
                } else if (t.categoria === 'esta_semana') {
                    if (offsetSemanas === 0) correspondeADia = true;
                } else if (t.categoria === 'fin_semana') {
                    if ((i === 5 || i === 6) && offsetSemanas === 0) correspondeADia = true;
                } else if (t.categoria === 'prox_semana') {
                    if (offsetSemanas === 1) correspondeADia = true;
                }

                if (correspondeADia) {
                    const li = document.createElement('li');
                    li.classList.add('item-semana-tag');
                    li.innerHTML = `☑️ ${t.texto}`;
                    ulContenido.appendChild(li);
                    tieneItems = true;
                }
            });
        }

        if (!tieneItems) {
            ulContenido.innerHTML = `<li style="color:#aaa; font-style:italic; font-size:10px;">Sin registros</li>`;
        }

        col.appendChild(ulContenido);

        col.addEventListener('click', () => {
            abrirModalDia(claveFecha, diaColumna.getDate(), nombresMeses[diaColumna.getMonth()]);
        });

        contenedorParrilla.appendChild(col);
    }
}

function guardarDatosSemana() {
    const hoy = new Date();
    const fechaLunes = obtenerLunesDeSemana(new Date(hoy.setDate(hoy.getDate() + (offsetSemanas * 7))));
    const claveSemana = `semana_${fechaLunes.getFullYear()}_${fechaLunes.getMonth() + 1}_${fechaLunes.getDate()}`;

    const datosSemana = {
        enfoque: document.getElementById('texto-enfoque-semana') ? document.getElementById('texto-enfoque-semana').value : "",
        prioridades: [
            document.getElementById('prio-semana-1') ? document.getElementById('prio-semana-1').value : "",
            document.getElementById('prio-semana-2') ? document.getElementById('prio-semana-2').value : "",
            document.getElementById('prio-semana-3') ? document.getElementById('prio-semana-3').value : "",
            document.getElementById('prio-semana-4') ? document.getElementById('prio-semana-4').value : ""
        ]
    };

    localStorage.setItem(claveSemana, JSON.stringify(datosSemana));
}

const btnSemAnt = document.getElementById('btn-semana-ant');
const btnSemSig = document.getElementById('btn-semana-sig');

if (btnSemAnt) btnSemAnt.addEventListener('click', () => { offsetSemanas--; renderizarVistaSemana(); });
if (btnSemSig) btnSemSig.addEventListener('click', () => { offsetSemanas++; renderizarVistaSemana(); });

// ==========================================
// 13. LÓGICA MÓDULO AÑO
// ==========================================
let anoSeleccionado = new Date().getFullYear();

const btnAnoAnt = document.getElementById('btn-ano-ant');
const btnAnoSig = document.getElementById('btn-ano-sig');

if (btnAnoAnt) btnAnoAnt.addEventListener('click', () => { anoSeleccionado--; renderizarVistaAno(); });
if (btnAnoSig) btnAnoSig.addEventListener('click', () => { anoSeleccionado++; renderizarVistaAno(); });

const btnEditarEnfoqueAno = document.getElementById('btn-editar-enfoque-ano');
if (btnEditarEnfoqueAno) {
    btnEditarEnfoqueAno.addEventListener('click', () => {
        const vLectura = document.getElementById('vista-lectura-enfoque-ano');
        const vEdicion = document.getElementById('vista-edicion-enfoque-ano');
        if (!vLectura || !vEdicion) return;
        
        if (vEdicion.classList.contains('oculto')) {
            vLectura.classList.add('oculto');
            vEdicion.classList.remove('oculto');
            btnEditarEnfoqueAno.textContent = "💾 Guardar";
        } else {
            guardarDatosAno();
            vEdicion.classList.add('oculto');
            vLectura.classList.remove('oculto');
            btnEditarEnfoqueAno.textContent = "✏️ Editar";
            renderizarVistaAno();
        }
    });
}

const btnEditarMetasAno = document.getElementById('btn-editar-metas-ano');
if (btnEditarMetasAno) {
    btnEditarMetasAno.addEventListener('click', () => {
        const vLectura = document.getElementById('vista-lectura-metas-ano');
        const vEdicion = document.getElementById('vista-edicion-metas-ano');
        if (!vLectura || !vEdicion) return;
        
        if (vEdicion.classList.contains('oculto')) {
            vLectura.classList.add('oculto');
            vEdicion.classList.remove('oculto');
            btnEditarMetasAno.textContent = "💾 Guardar";
        } else {
            guardarDatosAno();
            vEdicion.classList.add('oculto');
            vLectura.classList.remove('oculto');
            btnEditarMetasAno.textContent = "✏️ Editar";
            renderizarVistaAno();
        }
    });
}

function guardarDatosAno() {
    const claveAno = `ano_${anoSeleccionado}`;
    const datosAno = {
        enfoque: document.getElementById('texto-enfoque-ano') ? document.getElementById('texto-enfoque-ano').value : "",
        metas: [
            document.getElementById('meta-ano-1') ? document.getElementById('meta-ano-1').value : "",
            document.getElementById('meta-ano-2') ? document.getElementById('meta-ano-2').value : "",
            document.getElementById('meta-ano-3') ? document.getElementById('meta-ano-3').value : "",
            document.getElementById('meta-ano-4') ? document.getElementById('meta-ano-4').value : "",
            document.getElementById('meta-ano-5') ? document.getElementById('meta-ano-5').value : ""
        ]
    };
    localStorage.setItem(claveAno, JSON.stringify(datosAno));
}

function renderizarVistaAno() {
    const labelAno = document.getElementById('label-ano-actual');
    const gridMeses = document.getElementById('grid-12-meses');
    if (labelAno) labelAno.textContent = anoSeleccionado;

    const claveAno = `ano_${anoSeleccionado}`;
    const datosAno = JSON.parse(localStorage.getItem(claveAno)) || {};

    const txtEnfoque = datosAno.enfoque || "";
    const elDisplayEnfoque = document.getElementById('texto-display-enfoque-ano');
    const inputEnfoque = document.getElementById('texto-enfoque-ano');
    if (elDisplayEnfoque) elDisplayEnfoque.textContent = txtEnfoque.trim() !== "" ? txtEnfoque : "Ninguno";
    if (inputEnfoque) inputEnfoque.value = txtEnfoque;

    const metas = datosAno.metas || ["", "", "", "", ""];
    const olDisplayMetas = document.getElementById('lista-display-metas-ano');
    if (olDisplayMetas) {
        olDisplayMetas.innerHTML = "";
        metas.forEach((m, i) => {
            const li = document.createElement('li');
            li.innerHTML = `${i + 1}. ${m.trim() !== "" ? `<strong>${m}</strong>` : `<span class="vacio">...</span>`}`;
            olDisplayMetas.appendChild(li);
        });
    }

    ['meta-ano-1', 'meta-ano-2', 'meta-ano-3', 'meta-ano-4', 'meta-ano-5'].forEach((id, idx) => {
        const input = document.getElementById(id);
        if (input) input.value = metas[idx] || "";
    });

    if (!gridMeses) return;
    gridMeses.innerHTML = "";

    const nombresMeses = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"];
    const hoyReal = new Date();

    for (let m = 0; m < 12; m++) {
        const card = document.createElement('div');
        card.classList.add('mini-mes-card');

        const titulo = document.createElement('div');
        titulo.classList.add('mini-mes-titulo');
        titulo.textContent = nombresMeses[m];
        card.appendChild(titulo);

        const grilla = document.createElement('div');
        grilla.classList.add('mini-grilla-dias');

        ["L", "M", "X", "J", "V", "S", "D"].forEach(d => {
            const h = document.createElement('div');
            h.classList.add('mini-dia-header');
            h.textContent = d;
            grilla.appendChild(h);
        });

        let primerDia = new Date(anoSeleccionado, m, 1).getDay();
        primerDia = primerDia === 0 ? 6 : primerDia - 1;
        const totalDias = new Date(anoSeleccionado, m + 1, 0).getDate();

        for (let i = 0; i < primerDia; i++) {
            grilla.appendChild(document.createElement('div'));
        }

        for (let d = 1; d <= totalDias; d++) {
            const celda = document.createElement('div');
            celda.classList.add('mini-dia-celda');
            celda.textContent = d;

            const claveFecha = `${anoSeleccionado}-${String(m + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
            const datosDia = JSON.parse(localStorage.getItem(claveFecha));

            if (datosDia && Array.isArray(datosDia.eventos) && datosDia.eventos.length > 0) {
                const primerEvento = datosDia.eventos[0];
                const tipo = typeof primerEvento === 'string' ? "🙃 Otros" : (primerEvento.tipo || "📌 Evento");
                const estilo = buscarEstiloCategoria(tipo);
                
                celda.style.backgroundColor = estilo.bg;
                celda.style.color = estilo.color;
                celda.style.fontWeight = "bold";
            }

            if (d === hoyReal.getDate() && m === hoyReal.getMonth() && anoSeleccionado === hoyReal.getFullYear()) {
                celda.classList.add('es-hoy-mini');
            }

            grilla.appendChild(celda);
        }

        card.appendChild(grilla);

        card.addEventListener('click', () => {
            fechaActual = new Date(anoSeleccionado, m, 1);
            if (typeof renderizarCalendario === 'function') renderizarCalendario();

            document.querySelectorAll('.btn-pestana').forEach(btn => btn.classList.remove('activa'));
            document.querySelectorAll('.pagina').forEach(pag => pag.classList.remove('activa'));

            const btnMes = document.querySelector('.btn-pestana[data-destino="calendario"]');
            const pagMes = document.getElementById('calendario');
            if (btnMes) btnMes.classList.add('activa');
            if (pagMes) pagMes.classList.add('activa');
        });

        gridMeses.appendChild(card);
    }
}

// ==========================================
// 14. INICIALIZACIÓN GENERAL
// ==========================================
cargarFraseAleatoria();
actualizarSelectCategorias();
renderizarCalendario();
renderizarVistaSemana();
renderizarVistaAno();
renderizarTareas();
renderizarNotas();
renderizarModuloHabitos();
cargarVistaHoy();