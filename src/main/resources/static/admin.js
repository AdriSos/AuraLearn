const URL_API_USUARIOS = 'https://auralearn-pfxs.onrender.com/api/usuarios';
const URL_API_CURSOS = 'https://auralearn-pfxs.onrender.com/api/cursos';
const URL_API_LECCIONES = 'https://auralearn-pfxs.onrender.com/api/lecciones';

let adminActual = null;
let cursosGlobales = [];
let profesoresGlobales = []; // NUEVO: Para poder editar profesores
let idProfesorEditando = null; // NUEVO: Para saber si estamos creando o editando
let idCursoEditando = null; // NUEVO: Para saber si estamos creando o editando

// ==========================================
// 1. INICIALIZACIÓN
// ==========================================
document.addEventListener('DOMContentLoaded', () => {
    const adminString = localStorage.getItem('usuarioAuraLearn');
    if (!adminString) { window.location.href = 'login.html'; return; }

    adminActual = JSON.parse(adminString);
    if (adminActual.rol !== 'ADMINISTRADOR') {
        alert("Acceso denegado."); window.location.href = 'alumno.html'; return;
    }

    cargarEstadisticasDashboard();
    cargarProfesores();
    cargarCursos();
    cargarAlumnos();
    configurarFormularioProfesor();
    configurarFormularioCurso();
});

// ==========================================
// 2. NAVEGACIÓN (CON ESCUDO ANTI-ERRORES)
// ==========================================
function ocultarTodasLasSecciones() {
    ['sec-dashboard', 'sec-profesores', 'sec-cursos', 'sec-alumnos'].forEach(id => {
        const sec = document.getElementById(id);
        if (sec) sec.style.display = 'none'; // El if(sec) evita el error rojo de la consola
    });
}

document.querySelectorAll('.nav-links a').forEach(enlace => {
    enlace.addEventListener('click', (e) => {
        e.preventDefault();
        document.querySelectorAll('.nav-links li').forEach(li => li.classList.remove('active'));
        e.target.closest('li').classList.add('active');
        ocultarTodasLasSecciones();

        const texto = e.target.textContent.toLowerCase();
        // Usamos variables y verificamos antes de aplicar style.display para evitar caídas
        if (texto.includes('dashboard')) { const s = document.getElementById('sec-dashboard'); if(s) s.style.display = 'block'; cargarEstadisticasDashboard(); }
        else if (texto.includes('profesores')) { const s = document.getElementById('sec-profesores'); if(s) s.style.display = 'block'; cargarProfesores(); }
        else if (texto.includes('cursos')) { const s = document.getElementById('sec-cursos'); if(s) s.style.display = 'block'; cargarCursos(); }
        else if (texto.includes('alumnos')) { const s = document.getElementById('sec-alumnos'); if(s) s.style.display = 'block'; cargarAlumnos(); }
    });
});

// ==========================================
// 3. DASHBOARD
// ==========================================
window.cargarEstadisticasDashboard = async function() {
    try {
        const resUsuarios = await fetch(URL_API_USUARIOS);
        if (resUsuarios.ok) {
            const usuarios = await resUsuarios.json();
            const alumnos = usuarios.filter(u => u.rol === 'ALUMNO' || u.rol === 'CLIENTE');
            if(document.getElementById('totalAlumnos')) document.getElementById('totalAlumnos').textContent = alumnos.length;
        }

        const resCursos = await fetch(URL_API_CURSOS);
        if (resCursos.ok) {
            const cursos = await resCursos.json();
            if(document.getElementById('totalCursos')) document.getElementById('totalCursos').textContent = cursos.length;
            if(document.getElementById('cursoPopular')) document.getElementById('cursoPopular').textContent = cursos.length > 0 ? cursos[0].titulo : "Aún no hay cursos";
        }
    } catch (error) { console.error("Error dashboard:", error); }
}

// ==========================================
// 4. TABLAS
// ==========================================
window.cargarProfesores = async function() {
    try {
        const res = await fetch(URL_API_USUARIOS);
        if(res.ok) {
            const usuarios = await res.json();
            profesoresGlobales = usuarios.filter(u => u.rol && u.rol.toUpperCase() === 'PROFESOR');
            const tabla = document.querySelector('#sec-profesores .admin-table');
            if(tabla) {
                let html = '<tr><th>Nombre</th><th>Correo</th><th>Especialidad</th><th>Acciones</th></tr>';
                if(profesoresGlobales.length === 0) {
                    html += `<tr><td colspan="4" style="text-align:center;">Aún no hay profesores registrados.</td></tr>`;
                } else {
                    profesoresGlobales.forEach(p => {
                        html += `<tr>
                            <td>${p.nombreCompleto}</td>
                            <td>${p.correo}</td>
                            <td>Profesor</td>
                            <td>
                                <button class="btn-editar" onclick="editarProfesor(${p.id})"><i class="fa-solid fa-pen"></i> Editar</button>
                                <button class="btn-eliminar-tabla" onclick="eliminarProfesor(${p.id})" style="margin-left: 5px;"><i class="fa-solid fa-trash"></i> Eliminar</button>
                            </td>
                        </tr>`;
                    });
                }
                tabla.innerHTML = html;
            }

            const selectProfesor = document.querySelector('#sec-cursos select');
            if(selectProfesor) {
                selectProfesor.innerHTML = '<option value="">Selecciona un profesor...</option>';
                profesoresGlobales.forEach(p => { selectProfesor.innerHTML += `<option value="${p.id}">${p.nombreCompleto}</option>`; });
            }
        }
    } catch(e) { console.error("Error profesores:", e); }
}

window.cargarCursos = async function() {
    try {
        const res = await fetch(URL_API_CURSOS);
        if(res.ok) {
            cursosGlobales = await res.json();
            const tabla = document.querySelector('#sec-cursos .admin-table');
            if(tabla) {
                let html = '<tr><th>ID</th><th>Título</th><th>Descripción</th><th>Acciones</th></tr>';
                cursosGlobales.forEach(c => {
                    html += `<tr>
                        <td>${c.id}</td>
                        <td>${c.titulo}</td>
                        <td>${c.descripcion.substring(0,30)}...</td>
                        <td>
                            <button class="btn-editar" onclick="editarCurso(${c.id})"><i class="fa-solid fa-pen"></i> Editar</button>
                            <button class="btn-eliminar-tabla" onclick="eliminarCurso(${c.id})" style="margin-left: 5px;"><i class="fa-solid fa-trash"></i> Eliminar</button>
                            <button class="btn-primary" onclick="gestionarLecciones(${c.id}, '${c.titulo}')" style="margin-left: 5px;"><i class="fa-solid fa-video"></i> Lecciones</button>
                        </td>
                    </tr>`;
                });
                tabla.innerHTML = html;
            }
        }
    } catch(e) { console.error("Error cursos:", e); }
}

window.cargarAlumnos = async function() {
    try {
        const res = await fetch(URL_API_USUARIOS);
        if(res.ok) {
            const usuarios = await res.json();
            const alumnos = usuarios.filter(u => u.rol === 'ALUMNO' || u.rol === 'CLIENTE');
            const tabla = document.querySelector('#sec-alumnos .admin-table');
            if(tabla) {
                let html = '<tr><th>Nombre</th><th>Correo</th><th>Rol</th><th>Acciones</th></tr>';
                alumnos.forEach(a => {
                    html += `<tr>
                        <td>${a.nombreCompleto}</td>
                        <td>${a.correo}</td>
                        <td>Alumno</td>
                        <td>
                            <button class="btn-eliminar-tabla" onclick="eliminarProfesor(${a.id})"><i class="fa-solid fa-trash"></i> Eliminar</button>
                        </td>
                    </tr>`;
                });
                tabla.innerHTML = html;
            }
        }
    } catch(e) { console.error("Error alumnos:", e); }
}

// ==========================================
// 5. FORMULARIOS (CREAR Y ACTUALIZAR)
// ==========================================
window.configurarFormularioProfesor = function() {
    const formProfesor = document.getElementById('formProfesor');
    if(formProfesor) {
        formProfesor.addEventListener('submit', async (e) => {
            e.preventDefault();
            const btn = formProfesor.querySelector('button');
            btn.textContent = "Guardando..."; btn.disabled = true;

            const inputs = formProfesor.querySelectorAll('input');
            const profesorData = { nombreCompleto: inputs[0].value, correo: inputs[1].value, rol: "PROFESOR" };

            // Verificamos si estamos creando o editando
            let urlFetch = URL_API_USUARIOS + '/registro';
            let metodoFetch = 'POST';
            if(idProfesorEditando !== null) {
                urlFetch = `${URL_API_USUARIOS}/${idProfesorEditando}`;
                metodoFetch = 'PUT';
            }

            try {
                const res = await fetch(urlFetch, { method: metodoFetch, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(profesorData) });
                let divMsg = document.getElementById('msgProfesor') || document.createElement('div');
                divMsg.id = 'msgProfesor'; divMsg.style.padding = "10px"; divMsg.style.marginTop = "10px"; formProfesor.appendChild(divMsg);

                if(res.ok) {
                    divMsg.textContent = idProfesorEditando ? "¡Profesor actualizado!" : "¡Profesor registrado!";
                    divMsg.style.color = "green";
                    formProfesor.reset();
                    idProfesorEditando = null; // Reiniciamos el modo edición
                    btn.textContent = "Guardar Profesor"; // Regresamos el texto original
                    cargarProfesores();
                } else { divMsg.textContent = "Error al procesar."; divMsg.style.color = "red"; }
                setTimeout(() => divMsg.textContent = "", 4000);
            } catch(error) { alert("Error."); } finally { btn.disabled = false; }
        });
    }
}

window.configurarFormularioCurso = function() {
    const sec = document.getElementById('sec-cursos');
    if(!sec) return;
    const btn = sec.querySelector('button');
    if(btn) {
        btn.addEventListener('click', async (e) => {
            e.preventDefault();
            const inputs = sec.querySelectorAll('input, select, textarea');
            if(!inputs[0].value || !inputs[2].value) { alert("Llena el título y descripción."); return; }

            const cursoData = { titulo: inputs[0].value, descripcion: inputs[2].value, profesor: inputs[1].value ? { id: parseInt(inputs[1].value) } : null };

            // Verificamos si estamos creando o editando
            let urlFetch = URL_API_CURSOS;
            let metodoFetch = 'POST';
            if(idCursoEditando !== null) {
                urlFetch = `${URL_API_CURSOS}/${idCursoEditando}`;
                metodoFetch = 'PUT';
            }

            btn.textContent = "Guardando...";
            try {
                const res = await fetch(urlFetch, { method: metodoFetch, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(cursoData) });
                if(res.ok) {
                    alert(idCursoEditando ? "¡Curso actualizado!" : "¡Curso guardado!");
                    inputs[0].value=''; inputs[1].value=''; inputs[2].value='';
                    idCursoEditando = null; // Reiniciamos el modo edición
                    btn.textContent = "Guardar Curso";
                    cargarCursos();
                }
                else { alert("Error."); btn.textContent = idCursoEditando ? "Actualizar Curso" : "Guardar Curso"; }
            } catch(err) { alert("Error."); btn.textContent = idCursoEditando ? "Actualizar Curso" : "Guardar Curso"; }
        });
    }
}

// ==========================================
// 6. ACCIONES: ACTIVAR MODO EDICIÓN Y ELIMINAR
// ==========================================
window.editarProfesor = function(id) {
    const prof = profesoresGlobales.find(p => p.id === id);
    if(prof) {
        idProfesorEditando = id;
        const form = document.getElementById('formProfesor');
        const inputs = form.querySelectorAll('input');
        inputs[0].value = prof.nombreCompleto;
        inputs[1].value = prof.correo;
        form.querySelector('button').textContent = "Actualizar Profesor"; // Cambiamos el texto del botón
        window.scrollTo({ top: 0, behavior: 'smooth' }); // Subimos la pantalla suavemente
    }
}

window.editarCurso = function(id) {
    const curso = cursosGlobales.find(c => c.id === id);
    if(curso) {
        idCursoEditando = id;
        const sec = document.getElementById('sec-cursos');
        const inputs = sec.querySelectorAll('input, select, textarea');
        inputs[0].value = curso.titulo;
        inputs[1].value = curso.profesor ? curso.profesor.id : "";
        inputs[2].value = curso.descripcion;
        sec.querySelector('button').textContent = "Actualizar Curso"; // Cambiamos el texto del botón
        window.scrollTo({ top: 0, behavior: 'smooth' }); // Subimos la pantalla suavemente
    }
}

window.eliminarProfesor = async function(id) {
    if(confirm("¿Estás seguro de eliminar a este usuario?")) {
        try {
            const res = await fetch(`${URL_API_USUARIOS}/${id}`, { method: 'DELETE' });
            if(res.ok) { alert("Eliminado."); cargarProfesores(); cargarAlumnos(); }
            else { alert("Error al eliminar."); }
        } catch(e) { alert("Error de conexión."); }
    }
}

window.eliminarCurso = async function(id) {
    if(confirm("¿Seguro que quieres borrar el curso? Esto borrará sus videos también.")) {
        try {
            const res = await fetch(`${URL_API_CURSOS}/${id}`, { method: 'DELETE' });
            if(res.ok) { alert("Curso eliminado."); cargarCursos(); }
            else { alert("Error al eliminar."); }
        } catch(e) { alert("Error de conexión."); }
    }
}

// ==========================================
// 7. CERRAR SESIÓN Y LECCIONES (YOUTUBE)
// ==========================================
document.getElementById('btnSalir').addEventListener('click', () => { localStorage.removeItem('usuarioAuraLearn'); window.location.href = 'login.html'; });

window.gestionarLecciones = function(cursoId, tituloCurso) {
    document.getElementById('tituloModalLecciones').textContent = `Videos: ${tituloCurso}`;
    document.getElementById('leccionCursoId').value = cursoId;
    document.getElementById('modalLecciones').style.display = 'block';
    document.getElementById('reproductorVideo').style.display = 'none';
    cargarLecciones(cursoId);
};

window.cerrarModalLecciones = function() { document.getElementById('modalLecciones').style.display = 'none'; document.getElementById('iframeYouTube').src = ""; };

function transformarUrlYouTube(url) {
    let videoId = "";
    if (url.includes("youtu.be/")) videoId = url.split("youtu.be/")[1].split("?")[0];
    else if (url.includes("watch?v=")) videoId = url.split("watch?v=")[1].split("&")[0];
    return videoId ? `https://www.youtube.com/embed/${videoId}?modestbranding=1&rel=0&iv_load_policy=3` : url;
}

document.getElementById('formLeccion')?.addEventListener('submit', async (e) => {
    e.preventDefault();
    const btn = document.getElementById('btnGuardarLeccion'); btn.disabled = true;
    const cursoId = document.getElementById('leccionCursoId').value;
    const urlEmbed = transformarUrlYouTube(document.getElementById('leccionUrl').value);
    const datos = { titulo: document.getElementById('leccionTitulo').value, urlVideo: urlEmbed, orden: 1, curso: { id: parseInt(cursoId) } };
    try {
        const res = await fetch(URL_API_LECCIONES, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(datos) });
        if(res.ok) { document.getElementById('leccionTitulo').value = ''; document.getElementById('leccionUrl').value = ''; cargarLecciones(cursoId); }
        else alert("Error.");
    } catch(err) { alert("Error."); } finally { btn.disabled = false; }
});

window.cargarLecciones = async function(cursoId) {
    const lista = document.getElementById('listaLecciones'); lista.innerHTML = "<li>Cargando...</li>";
    try {
        const res = await fetch(`${URL_API_LECCIONES}/curso/${cursoId}`);
        if(res.ok) {
            const lecciones = await res.json();
            lista.innerHTML = lecciones.length === 0 ? "<li>Sin videos.</li>" : "";
            lecciones.forEach(lec => {
                lista.innerHTML += `<li><span><strong>${lec.titulo}</strong></span><div><button onclick="reproducirVideo('${lec.urlVideo}')" class="btn-ver-video"><i class="fa-solid fa-play"></i></button> <button onclick="eliminarLeccion(${lec.id}, ${cursoId})" class="btn-eliminar-tabla"><i class="fa-solid fa-trash"></i></button></div></li>`;
            });
        }
    } catch (e) { lista.innerHTML = "<li>Error.</li>"; }
}

window.reproducirVideo = function(url) { document.getElementById('reproductorVideo').style.display = 'block'; document.getElementById('iframeYouTube').src = url; };
window.eliminarLeccion = async function(id, cursoId) {
    if(confirm("¿Borrar video?")) {
        await fetch(`${URL_API_LECCIONES}/${id}`, { method: 'DELETE' });
        cargarLecciones(cursoId); document.getElementById('reproductorVideo').style.display = 'none'; document.getElementById('iframeYouTube').src = '';
    }
};