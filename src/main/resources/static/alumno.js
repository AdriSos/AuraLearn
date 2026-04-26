const URL_API_CURSOS = 'https://auralearn-pfxs.onrender.com/api/cursos';
const URL_API_LECCIONES = 'https://auralearn-pfxs.onrender.com/api/lecciones';
const URL_API_USUARIOS = 'https://auralearn-pfxs.onrender.com/api/usuarios'; // ¡NUEVO! Para la contraseña

let usuarioActual = null;
let player;
let leccionesActuales = [];
let indiceLeccionActual = 0;
let cursoActualId = null;
let progresoActual = 0;

// ==========================================
// 1. INICIALIZACIÓN Y SEGURIDAD
// ==========================================
document.addEventListener('DOMContentLoaded', () => {
    const usuarioString = localStorage.getItem('usuarioAuraLearn');
    if (!usuarioString) { window.location.href = 'login.html'; return; }

    usuarioActual = JSON.parse(usuarioString);

    if (usuarioActual.rol === 'ADMINISTRADOR') {
        alert("Los administradores tienen su propio panel.");
        window.location.href = 'admin.html';
        return;
    }

    document.getElementById('saludoAlumno').textContent = `¡Hola, ${usuarioActual.nombreCompleto.split(' ')[0]}!`;

    if(localStorage.getItem('temaAuraLearn') === 'claro') {
        document.body.classList.add('light-mode');
        document.getElementById('btnTema').innerHTML = '<i class="fa-solid fa-sun"></i>';
    }

    document.getElementById('perfilNombre').textContent = usuarioActual.nombreCompleto;
    document.getElementById('perfilCorreo').textContent = usuarioActual.correo;

    const fotoGuardada = localStorage.getItem(`foto_${usuarioActual.correo}`);
        if (fotoGuardada) {
            document.getElementById('imgAvatar').src = fotoGuardada;
            document.getElementById('imgMenuAvatar').src = fotoGuardada;
        }

    cargarCursosEstudiante();
});

// ==========================================
// 2. MENÚ, TEMA Y CERRAR SESIÓN
// ==========================================
document.getElementById('btnTema').addEventListener('click', () => {
    document.body.classList.toggle('light-mode');
    const icono = document.getElementById('btnTema');

    if (document.body.classList.contains('light-mode')) {
        icono.innerHTML = '<i class="fa-solid fa-sun"></i>';
        localStorage.setItem('temaAuraLearn', 'claro');
    } else {
        icono.innerHTML = '<i class="fa-solid fa-moon"></i>';
        localStorage.setItem('temaAuraLearn', 'oscuro');
    }
});

document.getElementById('btnSalir').addEventListener('click', () => {
    localStorage.removeItem('usuarioAuraLearn');
    window.location.href = 'login.html';
});

document.getElementById('btn-menu').addEventListener('click', () => {
    document.querySelector('.sidebar').classList.toggle('mostrar');
});

function ocultarTodo() {
    document.getElementById('sec-cursos').style.display = 'none';
    document.getElementById('sec-sala-clases').style.display = 'none';
    document.getElementById('sec-perfil').style.display = 'none';
    document.getElementById('sec-fin-curso').style.display = 'none';
    if(player) { player.pauseVideo(); }
}

document.getElementById('linkCursos').addEventListener('click', (e) => {
    e.preventDefault();
    ocultarTodo();
    document.getElementById('sec-cursos').style.display = 'block';
    document.querySelector('.nav-links li.active').classList.remove('active');
    e.target.closest('li').classList.add('active');
});

document.getElementById('linkPerfil').addEventListener('click', (e) => {
    e.preventDefault();
    ocultarTodo();
    document.getElementById('sec-perfil').style.display = 'block';
    document.querySelector('.nav-links li.active').classList.remove('active');
    e.target.closest('li').classList.add('active');
});

// ==========================================
// 3. LÓGICA DE PERFIL Y CONTRASEÑA REAL
// ==========================================

document.getElementById('inputFileAvatar').addEventListener('change', function(e) {
    const archivo = e.target.files[0];
    if (archivo) {
        const lector = new FileReader();
        lector.onload = function(evento) {
            const imagenBase64 = evento.target.result;
            document.getElementById('imgAvatar').src = imagenBase64;
            document.getElementById('imgMenuAvatar').src = imagenBase64;
            localStorage.setItem(`foto_${usuarioActual.correo}`, imagenBase64);
        };
        lector.readAsDataURL(archivo);
    }
});

document.getElementById('btnOjoPerfil').addEventListener('click', function() {
    const inputPass = document.getElementById('nuevaPassword');
    const icono = document.getElementById('iconoOjoPerfil');

    if (inputPass.type === 'password') {
        inputPass.type = 'text';
        icono.classList.remove('fa-eye');
        icono.classList.add('fa-eye-slash');
    } else {
        inputPass.type = 'password';
        icono.classList.remove('fa-eye-slash');
        icono.classList.add('fa-eye');
    }
});

document.getElementById('nuevaPassword').addEventListener('input', (e) => {
    const val = e.target.value;
    let cumplidos = 0;
    const validar = (regex, id) => {
        const elemento = document.getElementById(id);
        if (regex.test(val)) { elemento.classList.add('req-cumplido'); cumplidos++; }
        else { elemento.classList.remove('req-cumplido'); }
    };
    validar(/.{8,}/, 'req1'); validar(/\d/, 'req2'); validar(/[A-Z]/, 'req3'); validar(/[@$!%*?&]/, 'req4');
    document.getElementById('btnActualizarPass').disabled = cumplidos !== 4;
});

// ¡CORRECCIÓN! AHORA SÍ CAMBIA EN LA BASE DE DATOS
document.getElementById('formCambiarPassword').addEventListener('submit', async (e) => {
    e.preventDefault();
    const btn = document.getElementById('btnActualizarPass');
    const mensaje = document.getElementById('mensajePerfil');
    const nuevaPass = document.getElementById('nuevaPassword').value;

    btn.disabled = true;
    btn.textContent = "Actualizando en Servidor...";

    // Cambiamos la contraseña en nuestro objeto
    usuarioActual.contrasena = nuevaPass;

    try {
        const respuesta = await fetch(`${URL_API_USUARIOS}/${usuarioActual.id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(usuarioActual)
    });

        if(respuesta.ok) {
            localStorage.setItem('usuarioAuraLearn', JSON.stringify(usuarioActual)); // Actualizamos el caché
            mensaje.textContent = "¡Éxito! Contraseña actualizada en el sistema.";
            mensaje.className = "mensaje exito";
            document.getElementById('nuevaPassword').value = '';
            document.querySelectorAll('.password-reqs p').forEach(p => p.classList.remove('req-cumplido'));
        } else { throw new Error("Error del servidor"); }
    } catch(error) {
        mensaje.textContent = "Hubo un error de conexión con el servidor.";
        mensaje.className = "mensaje error";
    }

    mensaje.style.display = 'block';
    btn.textContent = "Actualizar Contraseña";
    setTimeout(() => { mensaje.style.display = 'none'; }, 4000);
});

// ==========================================
// 4. CARGAR CURSOS DESDE EL SERVIDOR
// ==========================================
async function cargarCursosEstudiante() {
    const grid = document.getElementById('gridCursos');
    try {
        const respuesta = await fetch(URL_API_CURSOS);
        if(respuesta.ok) {
            const cursos = await respuesta.json();
            grid.innerHTML = "";
            if(cursos.length === 0) { grid.innerHTML = "<p>Aún no hay cursos disponibles.</p>"; return; }

            cursos.forEach(curso => {
                const nombreProf = curso.profesor ? curso.profesor.nombre : "Profesor AuraLearn";

                // --- EL TRUCO DEL DICCIONARIO DE IMÁGENES ---
                let tituloMinusculas = curso.titulo.toLowerCase();
                let urlImagen = `https://picsum.photos/seed/${curso.id + 20}/400/200`; // Imagen aleatoria por defecto

                // Si el título tiene la palabra "java", usa esta imagen de una laptop con código
                if (tituloMinusculas.includes("java")) {
                    urlImagen = "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?q=80&w=400&auto=format&fit=crop";
                }
                // Si el título trata de desarrollo "web" o "html"
                else if (tituloMinusculas.includes("web") || tituloMinusculas.includes("html")) {
                    urlImagen = "https://images.unsplash.com/photo-1498050108023-c5249f4df085?q=80&w=400&auto=format&fit=crop";
                }
                // Si el título trata de "python"
                else if (tituloMinusculas.includes("python")) {
                    urlImagen = "https://images.unsplash.com/photo-1526379095098-d400fd0bfce8?q=80&w=400&auto=format&fit=crop";
                }
                // Si el título trata de "base de datos" o "sql"
                else if (tituloMinusculas.includes("base de datos") || tituloMinusculas.includes("sql") || tituloMinusculas.includes("nube")) {
                    urlImagen = "https://images.unsplash.com/photo-1544383835-bda2bc66a55d?q=80&w=400&auto=format&fit=crop";
                }

                grid.innerHTML += `
                    <div class="curso-card" style="padding: 0; overflow: hidden; display: flex; flex-direction: column;">
                        <div style="overflow: hidden;">
                            <img src="${urlImagen}" alt="Portada" class="curso-portada">
                        </div>
                        <div style="padding: 20px; display: flex; flex-direction: column; flex-grow: 1;">
                            <h3 style="margin-top: 0;">${curso.titulo}</h3>
                            <div class="profesor"><i class="fa-solid fa-chalkboard-user"></i> ${nombreProf}</div>
                            <div style="flex-grow: 1;"></div>
                            <button class="btn-empezar" onclick="abrirCurso(${curso.id}, '${curso.titulo}')">Entrar al Curso</button>
                        </div>
                    </div>
                `;
            });
        }
    } catch (error) { grid.innerHTML = "<p>Error al cargar los cursos.</p>"; }
}
// ==========================================
// 5. LA SALA DE CLASES (API YOUTUBE & PROGRESO)
// ==========================================
const tag = document.createElement('script');
tag.src = "https://www.youtube.com/iframe_api";
const firstScriptTag = document.getElementsByTagName('script')[0];
firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

window.abrirCurso = async function(idCurso, titulo) {
    cursoActualId = idCurso;
    ocultarTodo();
    document.getElementById('sec-sala-clases').style.display = 'block';
    document.getElementById('tituloCursoActual').textContent = titulo;
    document.getElementById('btnSiguienteLeccion').style.display = 'none';

    progresoActual = parseInt(localStorage.getItem(`progreso_${usuarioActual.correo}_curso_${idCurso}`)) || 0;

    const lista = document.getElementById('listaLeccionesAlumno');
    lista.innerHTML = "<li>Cargando lecciones...</li>";

    try {
        const respuesta = await fetch(`${URL_API_LECCIONES}/curso/${idCurso}`);
        if(respuesta.ok) {
            leccionesActuales = await respuesta.json();
            renderizarPlaylist();

            if(leccionesActuales.length > 0) { cargarVideo(progresoActual); }
            else {
                lista.innerHTML = "<li>Este curso aún no tiene videos.</li>";
                if(player) { player.destroy(); player = null; }
            }
        }
    } catch (error) { lista.innerHTML = "<li>Error de conexión.</li>"; }
};

function renderizarPlaylist() {
    const lista = document.getElementById('listaLeccionesAlumno');
    lista.innerHTML = "";
    leccionesActuales.forEach((lec, index) => {
        let estadoClass = index <= progresoActual ? "libre" : "bloqueada";
        let icono = index <= progresoActual ? (index === progresoActual ? "fa-play" : "fa-circle-check") : "fa-lock";
        let colorPalomita = index < progresoActual ? "color: #28a745;" : "";

        lista.innerHTML += `
            <li id="lec-${index}" class="${estadoClass}" onclick="intentarVerVideo(${index})">
                <i class="fa-solid ${icono}" style="${colorPalomita}"></i> ${index + 1}. ${lec.titulo}
            </li>
        `;
    });
}

window.intentarVerVideo = function(index) {
    const item = document.getElementById(`lec-${index}`);
    if (item.classList.contains('bloqueada')) {
        alert("No puedes saltarte lecciones. Debes terminar el video anterior.");
        return;
    }
    cargarVideo(index);
};

function cargarVideo(index) {
    indiceLeccionActual = index;
    const urlCompleta = leccionesActuales[index].urlVideo;
    const videoId = urlCompleta.split('embed/')[1].split('?')[0];

    document.querySelectorAll('.playlist li').forEach(li => li.classList.remove('activa'));
    document.getElementById(`lec-${index}`).classList.add('activa');

    if (!player) {
        player = new YT.Player('reproductorYoutube', {
            height: '100%', width: '100%', videoId: videoId,
            playerVars: { 'rel': 0, 'modestbranding': 1, 'controls': 1 },
            events: { 'onStateChange': vigilanteVideos }
        });
    } else { player.loadVideoById(videoId); }
}

function vigilanteVideos(event) {
    if (event.data === 0) { // Cuando el video termina
        const siguienteIndex = indiceLeccionActual + 1;
        if (siguienteIndex < leccionesActuales.length) {
            document.getElementById('btnSiguienteLeccion').style.display = 'block';
        } else {
            // ¡EL CURSO TERMINÓ! MANDAMOS A LA PANTALLA DE PDF
            ocultarTodo();
            document.getElementById('sec-fin-curso').style.display = 'block';
            document.getElementById('tituloCursoFin').textContent = document.getElementById('tituloCursoActual').textContent;
        }
    }
}

document.getElementById('btnSiguienteLeccion').addEventListener('click', () => {
    const siguienteIndex = indiceLeccionActual + 1;
    document.getElementById('btnSiguienteLeccion').style.display = 'none';

    if (siguienteIndex > progresoActual) {
        progresoActual = siguienteIndex;
        localStorage.setItem(`progreso_${usuarioActual.correo}_curso_${cursoActualId}`, progresoActual);
        renderizarPlaylist();
    }
    cargarVideo(siguienteIndex);
});

document.getElementById('btnVolverCursos').addEventListener('click', () => {
    ocultarTodo();
    document.getElementById('sec-cursos').style.display = 'block';
});

// ==========================================
// 6. LÓGICA DE ESTRELLAS Y DIPLOMA (PDF)
// ==========================================

// Pintar estrellas
const estrellas = document.querySelectorAll('#calificacionEstrellas i');
estrellas.forEach(estrella => {
    estrella.addEventListener('click', (e) => {
        const valor = e.target.getAttribute('data-valor');
        document.getElementById('valorCalificacion').value = valor;
        estrellas.forEach(s => {
            if(s.getAttribute('data-valor') <= valor) { s.classList.add('activa'); }
            else { s.classList.remove('activa'); }
        });
    });
});

// Generar PDF
document.getElementById('formEvaluacion').addEventListener('submit', (e) => {
    e.preventDefault();
    const calificacion = document.getElementById('valorCalificacion').value;

    if(calificacion == 0) {
        alert("Por favor, selecciona una calificación de estrellas antes de continuar.");
        return;
    }

    // Usamos jsPDF para dibujar el Diploma
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF({ orientation: 'landscape', unit: 'mm', format: 'a4' });

    // Fondo y marco
    doc.setFillColor(8, 96, 110); // Azul de AuraLearn
    doc.rect(0, 0, 297, 210, 'F');
    doc.setFillColor(255, 255, 255);
    doc.rect(10, 10, 277, 190, 'F');

    // Textos del Diploma
    doc.setTextColor(8, 96, 110);
    doc.setFontSize(35);
    doc.setFont("helvetica", "bold");
    doc.text("RECONOCIMIENTO DE EXCELENCIA", 148.5, 50, { align: "center" });

    doc.setTextColor(100, 100, 100);
    doc.setFontSize(16);
    doc.setFont("helvetica", "normal");
    doc.text("AuraLearn otorga el presente diploma a:", 148.5, 80, { align: "center" });

    doc.setTextColor(0, 0, 0);
    doc.setFontSize(30);
    doc.setFont("helvetica", "bold");
    doc.text(usuarioActual.nombreCompleto.toUpperCase(), 148.5, 105, { align: "center" });

    doc.setTextColor(100, 100, 100);
    doc.setFontSize(16);
    doc.setFont("helvetica", "normal");
    doc.text("Por haber concluido satisfactoriamente y con mérito el curso:", 148.5, 130, { align: "center" });

    doc.setTextColor(8, 96, 110);
    doc.setFontSize(22);
    doc.setFont("helvetica", "bold");
    const tituloCurso = document.getElementById('tituloCursoFin').textContent;
    doc.text(tituloCurso, 148.5, 150, { align: "center" });

    doc.setTextColor(150, 150, 150);
    doc.setFontSize(12);
    doc.text(`Fecha de emisión: ${new Date().toLocaleDateString('es-ES')}`, 148.5, 180, { align: "center" });

    // Descarga automática al navegador
    doc.save(`Diploma_${tituloCurso.replace(/\s+/g, '_')}.pdf`);

    alert("¡Gracias por tus comentarios! Tu diploma se está descargando.");

    // Regresamos al inicio
    document.getElementById('sec-fin-curso').style.display = 'none';
    document.getElementById('sec-cursos').style.display = 'block';

    // Limpiamos el formulario para el futuro
    document.getElementById('comentarioCurso').value = '';
    document.getElementById('valorCalificacion').value = '0';
    estrellas.forEach(s => s.classList.remove('activa'));
});