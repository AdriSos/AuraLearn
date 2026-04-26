document.addEventListener('DOMContentLoaded', () => {
    const usuarioString = localStorage.getItem('usuarioAuraLearn');
    if (!usuarioString) { window.location.href = 'login.html'; return; }
    
    const usuario = JSON.parse(usuarioString);
    if (usuario.rol !== 'ADMINISTRADOR') { window.location.href = 'login.html'; return; }

    document.getElementById('saludoAdmin').textContent = `Bienvenido, ${usuario.nombreCompleto}`;
});

document.getElementById('btnSalir').addEventListener('click', () => {
    localStorage.removeItem('usuarioAuraLearn');
    window.location.href = 'login.html';
});

// menu lateral
const menuLinks = document.querySelectorAll('.nav-links a');
const secciones = document.querySelectorAll('.vista-admin');

menuLinks.forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        document.querySelectorAll('.nav-links li').forEach(li => li.classList.remove('active'));
        link.parentElement.classList.add('active');
        secciones.forEach(sec => sec.style.display = 'none');

        if(link.textContent.includes('Dashboard')) {
            document.getElementById('sec-dashboard').style.display = 'block';
        } else if(link.textContent.includes('Profesores')) {
            document.getElementById('sec-profesores').style.display = 'block';
            cargarProfesores(); 
        } else if(link.textContent.includes('Cursos')) {
            document.getElementById('sec-cursos').style.display = 'block';
            cargarProfesoresSelect(); 
            cargarCursos(); 
        }
    });
});

// crud (profesor)
const formProfesor = document.getElementById('formProfesor');
const URL_API_PROFESORES = 'https://auralearn-pfxs.onrender.com/api/profesores';
let idProfesorEditando = null;

formProfesor.addEventListener('submit', async (e) => {
    e.preventDefault();
    const btnGuardar = document.getElementById('btnGuardarProf');
    const mensajeDiv = document.getElementById('mensajeProf');
    btnGuardar.disabled = true;
    mensajeDiv.className = "mensaje";

    const datosProfesor = {
        nombre: document.getElementById('profNombre').value,
        correo: document.getElementById('profCorreo').value,
        especialidad: document.getElementById('profEspecialidad').value
    };

    try {
        const metodo = idProfesorEditando ? 'PUT' : 'POST';
        const urlFinal = idProfesorEditando ? `${URL_API_PROFESORES}/${idProfesorEditando}` : URL_API_PROFESORES;

        const respuesta = await fetch(urlFinal, {
            method: metodo,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(datosProfesor)
        });

        if(respuesta.ok) {
            mensajeDiv.textContent = idProfesorEditando ? "¡Profesor actualizado!" : "¡Profesor registrado!";
            mensajeDiv.classList.add('exito');
            cancelarEdicionProf();
            cargarProfesores(); 
        } else {
            mensajeDiv.textContent = "Error al guardar el profesor.";
            mensajeDiv.classList.add('error');
        }
    } catch(error) {
        mensajeDiv.textContent = "Error de conexión.";
        mensajeDiv.classList.add('error');
    } finally {
        btnGuardar.disabled = false;
    }
});

async function cargarProfesores() {
    const tbody = document.getElementById('tablaProfesores');
    tbody.innerHTML = "<tr><td colspan='4'>Cargando profesores...</td></tr>";
    try {
        const respuesta = await fetch(URL_API_PROFESORES);
        if(respuesta.ok) {
            const profesores = await respuesta.json();
            tbody.innerHTML = ""; 
            if(profesores.length === 0) { tbody.innerHTML = "<tr><td colspan='4'>No hay profesores registrados.</td></tr>"; return; }

            profesores.forEach(prof => {
                tbody.innerHTML += `
                    <tr>
                        <td>${prof.nombre}</td>
                        <td>${prof.correo}</td>
                        <td>${prof.especialidad}</td>
                        <td>
                            <button onclick="prepararEdicionProf(${prof.id}, '${prof.nombre}', '${prof.correo}', '${prof.especialidad}')" class="btn-accion btn-editar" title="Editar"><i class="fa-solid fa-pen-to-square"></i></button>
                            <button onclick="eliminarProfesor(${prof.id})" class="btn-accion btn-eliminar" title="Eliminar"><i class="fa-solid fa-trash"></i></button>
                        </td>
                    </tr>`;
            });
        }
    } catch(error) { tbody.innerHTML = "<tr><td colspan='4'>Error al cargar los datos.</td></tr>"; }
}

window.prepararEdicionProf = function(id, nombre, correo, especialidad) {
    idProfesorEditando = id;
    document.getElementById('profNombre').value = nombre;
    document.getElementById('profCorreo').value = correo;
    document.getElementById('profEspecialidad').value = especialidad;
    document.getElementById('btnGuardarProf').textContent = "Actualizar Profesor";
    document.getElementById('btnCancelarProf').style.display = "inline-block";
    window.scrollTo(0, 0); 
};

window.cancelarEdicionProf = function() {
    idProfesorEditando = null;
    formProfesor.reset();
    document.getElementById('btnGuardarProf').textContent = "Guardar Profesor";
    document.getElementById('btnCancelarProf').style.display = "none";
};

window.eliminarProfesor = async function(id) {
    if(confirm("¿Seguro que deseas eliminar a este profesor?")) {
        try {
            const respuesta = await fetch(`${URL_API_PROFESORES}/${id}`, { method: 'DELETE' });
            if(respuesta.ok) cargarProfesores(); else alert("Error al eliminar.");
        } catch(error) { alert("Error de conexión."); }
    }
};

// crud(cursos)
const formCurso = document.getElementById('formCurso');
const URL_API_CURSOS = 'https://auralearn-pfxs.onrender.com/api/cursos';
let idCursoEditando = null;

async function cargarProfesoresSelect() {
    const select = document.getElementById('cursoProfesor');
    try {
        const respuesta = await fetch(URL_API_PROFESORES);
        if(respuesta.ok) {
            const profesores = await respuesta.json();
            select.innerHTML = '<option value="">Selecciona un profesor...</option>';
            profesores.forEach(prof => {
                select.innerHTML += `<option value="${prof.id}">${prof.nombre} (${prof.especialidad})</option>`;
            });
        }
    } catch(error) { console.error("Error al cargar profesores."); }
}

formCurso.addEventListener('submit', async (e) => {
    e.preventDefault();
    const btnGuardar = document.getElementById('btnGuardarCurso');
    const mensajeDiv = document.getElementById('mensajeCurso');
    btnGuardar.disabled = true;
    mensajeDiv.className = "mensaje";

    const datosCurso = {
        titulo: document.getElementById('cursoTitulo').value,
        descripcion: document.getElementById('cursoDescripcion').value,
        profesor: { id: parseInt(document.getElementById('cursoProfesor').value) } 
    };

    try {
        const metodo = idCursoEditando ? 'PUT' : 'POST';
        const urlFinal = idCursoEditando ? `${URL_API_CURSOS}/${idCursoEditando}` : URL_API_CURSOS;

        const respuesta = await fetch(urlFinal, {
            method: metodo,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(datosCurso)
        });

        if(respuesta.ok) {
            mensajeDiv.textContent = idCursoEditando ? "¡Curso actualizado!" : "¡Curso registrado!";
            mensajeDiv.classList.add('exito');
            cancelarEdicionCurso();
            cargarCursos(); 
        } else {
            mensajeDiv.textContent = "Error al guardar el curso.";
            mensajeDiv.classList.add('error');
        }
    } catch(error) {
        mensajeDiv.textContent = "Error de conexión.";
        mensajeDiv.classList.add('error');
    } finally {
        btnGuardar.disabled = false;
    }
});

async function cargarCursos() {
    const tbody = document.getElementById('tablaCursos');
    tbody.innerHTML = "<tr><td colspan='4'>Cargando cursos...</td></tr>";
    try {
        const respuesta = await fetch(URL_API_CURSOS);
        if(respuesta.ok) {
            const cursos = await respuesta.json();
            tbody.innerHTML = ""; 
            if(cursos.length === 0) { tbody.innerHTML = "<tr><td colspan='4'>No hay cursos registrados.</td></tr>"; return; }

            cursos.forEach(curso => {
                const nombreProf = curso.profesor ? curso.profesor.nombre : "Sin asignar"; 
                tbody.innerHTML += `
                    <tr>
                        <td><strong>${curso.titulo}</strong></td>
                        <td>${nombreProf}</td>
                        <td>${curso.descripcion.substring(0, 40)}...</td>
                        <td>
                            <button onclick="gestionarLecciones(${curso.id}, '${curso.titulo}')" class="btn-accion btn-lecciones" title="Añadir Videos de YouTube"><i class="fa-brands fa-youtube"></i></button>
                            <button onclick="prepararEdicionCurso(${curso.id}, '${curso.titulo}', '${curso.descripcion}', ${curso.profesor ? curso.profesor.id : ''})" class="btn-accion btn-editar" title="Editar"><i class="fa-solid fa-pen-to-square"></i></button>
                            <button onclick="eliminarCurso(${curso.id})" class="btn-accion btn-eliminar" title="Eliminar"><i class="fa-solid fa-trash"></i></button>
                        </td>
                    </tr>`;
            });
        }
    } catch(error) { tbody.innerHTML = "<tr><td colspan='4'>Error al cargar los datos.</td></tr>"; }
}

window.prepararEdicionCurso = function(id, titulo, descripcion, profesorId) {
    idCursoEditando = id;
    document.getElementById('cursoTitulo').value = titulo;
    document.getElementById('cursoDescripcion').value = descripcion;
    document.getElementById('cursoProfesor').value = profesorId;
    document.getElementById('btnGuardarCurso').textContent = "Actualizar Curso";
    document.getElementById('btnCancelarCurso').style.display = "inline-block";
    window.scrollTo(0, 0); 
};

window.cancelarEdicionCurso = function() {
    idCursoEditando = null;
    formCurso.reset();
    document.getElementById('btnGuardarCurso').textContent = "Guardar Curso";
    document.getElementById('btnCancelarCurso').style.display = "none";
};

window.eliminarCurso = async function(id) {
    if(confirm("¿Seguro que deseas eliminar este curso?")) {
        try {
            const respuesta = await fetch(`${URL_API_CURSOS}/${id}`, { method: 'DELETE' });
            if(respuesta.ok) cargarCursos(); else alert("Error al eliminar.");
        } catch(error) { alert("Error de conexión."); }
    }
};

// ==========================================
// 5. LÓGICA DE LECCIONES (VIDEOS YOUTUBE)
// ==========================================
const URL_API_LECCIONES = 'https://auralearn-pfxs.onrender.com/api/lecciones';

// 1. Abrir la ventana emergente
window.gestionarLecciones = function(cursoId, tituloCurso) {
    document.getElementById('tituloModalLecciones').textContent = `Videos: ${tituloCurso}`;
    document.getElementById('leccionCursoId').value = cursoId;
    document.getElementById('modalLecciones').style.display = 'block';
    document.getElementById('reproductorVideo').style.display = 'none'; // Ocultar reproductor al inicio
    cargarLecciones(cursoId);
};

// 2. Cerrar la ventana y apagar el video
window.cerrarModalLecciones = function() {
    document.getElementById('modalLecciones').style.display = 'none';
    document.getElementById('iframeYouTube').src = ""; // Esto detiene el video si se estaba reproduciendo
};

// 3. Transformar Link Normal -> Link Incrustable (Embed)
function transformarUrlYouTube(url) {
    let videoId = "";
    if (url.includes("youtu.be/")) {
        videoId = url.split("youtu.be/")[1].split("?")[0];
    } else if (url.includes("watch?v=")) {
        videoId = url.split("watch?v=")[1].split("&")[0];
    }
    return videoId ? `https://www.youtube.com/embed/${videoId}` : url;
}

// 4. Guardar un nuevo video
document.getElementById('formLeccion').addEventListener('submit', async (e) => {
    e.preventDefault();
    const btnGuardar = document.getElementById('btnGuardarLeccion');
    btnGuardar.disabled = true;

    const cursoId = document.getElementById('leccionCursoId').value;
    const urlCruda = document.getElementById('leccionUrl').value;

    // Convertimos el link al formato seguro de Iframe
    const urlEmbed = transformarUrlYouTube(urlCruda);

    const datosLeccion = {
        titulo: document.getElementById('leccionTitulo').value,
        urlVideo: urlEmbed,
        orden: 1,
        curso: { id: parseInt(cursoId) }
    };

    try {
        const respuesta = await fetch(URL_API_LECCIONES, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(datosLeccion)
        });

        if(respuesta.ok) {
            document.getElementById('leccionTitulo').value = '';
            document.getElementById('leccionUrl').value = '';
            cargarLecciones(cursoId); // Recargar la lista
        } else {
            alert("Error al guardar el video.");
        }
    } catch(error) { alert("Error de conexión."); }
    finally { btnGuardar.disabled = false; }
});

// 5. Cargar lista de videos
async function cargarLecciones(cursoId) {
    const lista = document.getElementById('listaLecciones');
    lista.innerHTML = "<li>Cargando videos...</li>";

    try {
        const respuesta = await fetch(`${URL_API_LECCIONES}/curso/${cursoId}`);
        if(respuesta.ok) {
            const lecciones = await respuesta.json();
            lista.innerHTML = "";
            if(lecciones.length === 0) { lista.innerHTML = "<li>Aún no hay videos para este curso.</li>"; return; }

            lecciones.forEach(lec => {
                lista.innerHTML += `
                    <li>
                        <span><strong>${lec.titulo}</strong></span>
                        <div>
                            <button onclick="reproducirVideo('${lec.urlVideo}')" class="btn-ver-video"><i class="fa-solid fa-play"></i> Reproducir</button>
                            <button onclick="eliminarLeccion(${lec.id}, ${cursoId})" class="btn-accion btn-eliminar"><i class="fa-solid fa-trash"></i></button>
                        </div>
                    </li>
                `;
            });
        }
    } catch (error) { lista.innerHTML = "<li>Error al cargar videos.</li>"; }
}

// 6. ¡Reproducir el video dentro de la página!
window.reproducirVideo = function(urlEmbed) {
    document.getElementById('reproductorVideo').style.display = 'block';
    document.getElementById('iframeYouTube').src = urlEmbed;
};

// 7. Eliminar Video
window.eliminarLeccion = async function(idLeccion, cursoId) {
    if(confirm("¿Estás seguro de borrar este video?")) {
        await fetch(`${URL_API_LECCIONES}/${idLeccion}`, { method: 'DELETE' });
        cargarLecciones(cursoId);
        document.getElementById('reproductorVideo').style.display = 'none';
        document.getElementById('iframeYouTube').src = '';
    }
};
};