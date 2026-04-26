const URL_API_USUARIOS = 'https://auralearn-pfxs.onrender.com/api/usuarios';
const URL_API_CURSOS = 'https://auralearn-pfxs.onrender.com/api/cursos';
const URL_API_LECCIONES = 'https://auralearn-pfxs.onrender.com/api/lecciones';

let adminActual = null;

// ==========================================
// 1. INICIALIZACIÓN Y SEGURIDAD
// ==========================================
document.addEventListener('DOMContentLoaded', () => {
    const adminString = localStorage.getItem('usuarioAuraLearn');
    if (!adminString) {
        window.location.href = 'login.html';
        return;
    }

    adminActual = JSON.parse(adminString);

    if (adminActual.rol !== 'ADMINISTRADOR') {
        alert("Acceso denegado. No tienes permisos de administrador.");
        window.location.href = 'alumno.html';
        return;
    }

    // Cargamos la información inicial
    cargarEstadisticasDashboard();
    cargarProfesores();
    cargarCursos();
    cargarAlumnos();
    configurarFormularioProfesor(); // Activamos el botón para guardar profesores
});

// ==========================================
// 2. NAVEGACIÓN DEL MENÚ LATERAL
// ==========================================
function ocultarTodasLasSecciones() {
    ['sec-dashboard', 'sec-profesores', 'sec-cursos', 'sec-alumnos'].forEach(id => {
        const sec = document.getElementById(id);
        if (sec) sec.style.display = 'none';
    });
}

document.querySelectorAll('.nav-links a').forEach(enlace => {
    enlace.addEventListener('click', (e) => {
        e.preventDefault();
        document.querySelectorAll('.nav-links li').forEach(li => li.classList.remove('active'));
        e.target.closest('li').classList.add('active');
        ocultarTodasLasSecciones();

        const textoEnlace = e.target.textContent.toLowerCase();

        if (textoEnlace.includes('dashboard')) {
            const sec = document.getElementById('sec-dashboard');
            if(sec) sec.style.display = 'block';
            cargarEstadisticasDashboard();
        }
        else if (textoEnlace.includes('profesores')) {
            const sec = document.getElementById('sec-profesores');
            if(sec) sec.style.display = 'block';
            cargarProfesores();
        }
        else if (textoEnlace.includes('cursos')) {
            const sec = document.getElementById('sec-cursos');
            if(sec) sec.style.display = 'block';
            cargarCursos();
        }
        else if (textoEnlace.includes('alumnos')) {
            const sec = document.getElementById('sec-alumnos');
            if(sec) sec.style.display = 'block';
            cargarAlumnos();
        }
    });
});

// ==========================================
// 3. CARGAR ESTADÍSTICAS DEL DASHBOARD
// ==========================================
async function cargarEstadisticasDashboard() {
    try {
        const resUsuarios = await fetch(URL_API_USUARIOS);
        if (resUsuarios.ok) {
            const usuarios = await resUsuarios.json();
            // Contamos alumnos y a los que se registraron como "CLIENTE"
            const alumnos = usuarios.filter(u => u.rol === 'ALUMNO' || u.rol === 'CLIENTE');
            const totalAlumnosElement = document.getElementById('totalAlumnos');
            if(totalAlumnosElement) totalAlumnosElement.textContent = alumnos.length;
        }

        const resCursos = await fetch(URL_API_CURSOS);
        if (resCursos.ok) {
            const cursos = await resCursos.json();
            const totalCursosElement = document.getElementById('totalCursos');
            const cursoPopularElement = document.getElementById('cursoPopular');

            if(totalCursosElement) totalCursosElement.textContent = cursos.length;
            if(cursoPopularElement) {
                cursoPopularElement.textContent = cursos.length > 0 ? cursos[0].titulo : "Aún no hay cursos";
            }
        }
    } catch (error) { console.error("Error cargando el dashboard:", error); }
}

// ==========================================
// 4. LLENAR LAS TABLAS (PROFESORES, CURSOS, ALUMNOS)
// ==========================================
async function cargarProfesores() {
    try {
        const res = await fetch(URL_API_USUARIOS);
        if(res.ok) {
            const usuarios = await res.json();
            // Filtramos a los que sí tengan el rol correcto
            const profesores = usuarios.filter(u => u.rol && u.rol.toUpperCase() === 'PROFESOR');
            const tabla = document.querySelector('#sec-profesores .admin-table');
            if(tabla) {
                let html = '<tr><th>Nombre</th><th>Correo</th><th>Especialidad</th><th>Acciones</th></tr>';
                if(profesores.length === 0) {
                    html += `<tr><td colspan="4" style="text-align:center;">Aún no hay profesores registrados.</td></tr>`;
                } else {
                    profesores.forEach(p => {
                        html += `<tr><td>${p.nombreCompleto}</td><td>${p.correo}</td><td>Profesor</td><td><button class="btn-secundario">Editar</button></td></tr>`;
                    });
                }
                tabla.innerHTML = html;
            }
        }
    } catch(e) { console.error("Error cargando profesores", e); }
}

async function cargarCursos() {
    try {
        const res = await fetch(URL_API_CURSOS);
        if(res.ok) {
            const cursos = await res.json();
            const tabla = document.querySelector('#sec-cursos .admin-table');
            if(tabla) {
                let html = '<tr><th>ID</th><th>Título</th><th>Descripción</th><th>Acciones</th></tr>';
                cursos.forEach(c => {
                    // AQUÍ ESTÁN TUS BOTONES DE REGRESO
                    html += `<tr>
                        <td>${c.id}</td>
                        <td>${c.titulo}</td>
                        <td>${c.descripcion.substring(0,40)}...</td>
                        <td>
                            <button class="btn-secundario">Editar</button>
                            <button class="btn-primary" onclick="gestionarLecciones(${c.id}, '${c.titulo}')" style="margin-left: 5px;"><i class="fa-solid fa-video"></i> Lecciones</button>
                        </td>
                    </tr>`;
                });
                tabla.innerHTML = html;
            }
        }
    } catch(e) { console.error("Error cargando cursos", e); }
}

async function cargarAlumnos() {
    try {
        const res = await fetch(URL_API_USUARIOS);
        if(res.ok) {
            const usuarios = await res.json();
            const alumnos = usuarios.filter(u => u.rol === 'ALUMNO' || u.rol === 'CLIENTE');
            const tabla = document.querySelector('#sec-alumnos .admin-table');
            if(tabla) {
                let html = '<tr><th>Nombre</th><th>Correo</th><th>Rol</th><th>Acciones</th></tr>';
                alumnos.forEach(a => {
                    html += `<tr><td>${a.nombreCompleto}</td><td>${a.correo}</td><td>Alumno</td><td><button class="btn-secundario">Editar</button></td></tr>`;
                });
                tabla.innerHTML = html;
            }
        }
    } catch(e) { console.error("Error cargando alumnos", e); }
}

// ==========================================
// 5. FORMULARIO PARA REGISTRAR PROFESORES
// ==========================================
function configurarFormularioProfesor() {
    const formProfesor = document.getElementById('formProfesor');
    if(formProfesor) {
        formProfesor.addEventListener('submit', async (e) => {
            e.preventDefault();
            const inputs = formProfesor.querySelectorAll('input');

            // Tomamos los datos del formulario web
            const nuevoProfesor = {
                nombreCompleto: inputs[0].value,
                correo: inputs[1].value,
                rol: "PROFESOR"
            };

            try {
                // Lo mandamos a la puerta de registro de Java
                const respuesta = await fetch(URL_API_USUARIOS + '/registro', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(nuevoProfesor)
                });

                if(respuesta.ok) {
                    alert("¡Profesor registrado con éxito! Su contraseña temporal fue enviada al correo.");
                    formProfesor.reset(); // Limpiamos los campos
                    cargarProfesores(); // Recargamos la tabla al instante
                } else {
                    const error = await respuesta.text();
                    alert("No se pudo registrar: " + error);
                }
            } catch(error) {
                alert("Error de conexión al intentar guardar al profesor.");
            }
        });
    }
}

// ==========================================
// 6. CERRAR SESIÓN Y MÓVILES
// ==========================================
document.getElementById('btnSalir').addEventListener('click', () => {
    localStorage.removeItem('usuarioAuraLearn');
    window.location.href = 'login.html';
});

const btnMenu = document.getElementById('btn-menu');
if(btnMenu) {
    btnMenu.addEventListener('click', () => {
        document.querySelector('.sidebar').classList.toggle('mostrar');
    });
}

// ==========================================
// 7. LÓGICA DE LECCIONES (VIDEOS YOUTUBE)
// ==========================================
window.gestionarLecciones = function(cursoId, tituloCurso) {
    document.getElementById('tituloModalLecciones').textContent = `Videos: ${tituloCurso}`;
    document.getElementById('leccionCursoId').value = cursoId;
    document.getElementById('modalLecciones').style.display = 'block';
    document.getElementById('reproductorVideo').style.display = 'none';
    cargarLecciones(cursoId);
};

window.cerrarModalLecciones = function() {
    document.getElementById('modalLecciones').style.display = 'none';
    document.getElementById('iframeYouTube').src = "";
};

function transformarUrlYouTube(url) {
    let videoId = "";
    if (url.includes("youtu.be/")) {
        videoId = url.split("youtu.be/")[1].split("?")[0];
    } else if (url.includes("watch?v=")) {
        videoId = url.split("watch?v=")[1].split("&")[0];
    }
    if (videoId) {
        return `https://www.youtube.com/embed/${videoId}?modestbranding=1&rel=0&iv_load_policy=3`;
    }
    return url;
}

document.getElementById('formLeccion').addEventListener('submit', async (e) => {
    e.preventDefault();
    const btnGuardar = document.getElementById('btnGuardarLeccion');
    btnGuardar.disabled = true;

    const cursoId = document.getElementById('leccionCursoId').value;
    const urlCruda = document.getElementById('leccionUrl').value;
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
            cargarLecciones(cursoId);
        } else {
            alert("Error al guardar el video.");
        }
    } catch(error) { alert("Error de conexión."); }
    finally { btnGuardar.disabled = false; }
});

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

window.reproducirVideo = function(urlEmbed) {
    document.getElementById('reproductorVideo').style.display = 'block';
    document.getElementById('iframeYouTube').src = urlEmbed;
};

window.eliminarLeccion = async function(idLeccion, cursoId) {
    if(confirm("¿Estás seguro de borrar este video?")) {
        await fetch(`${URL_API_LECCIONES}/${idLeccion}`, { method: 'DELETE' });
        cargarLecciones(cursoId);
        document.getElementById('reproductorVideo').style.display = 'none';
        document.getElementById('iframeYouTube').src = '';
    }
};