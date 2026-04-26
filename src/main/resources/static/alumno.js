const URL_API_CURSOS = 'https://auralearn-pfxs.onrender.com/api/cursos';
let usuarioActual = null;

document.addEventListener('DOMContentLoaded', () => {
    // 1. Seguridad: Verificar que sea Alumno
    const usuarioString = localStorage.getItem('usuarioAuraLearn');
    if (!usuarioString) { window.location.href = 'login.html'; return; }

    usuarioActual = JSON.parse(usuarioString);
    if (usuarioActual.rol !== 'ALUMNO' && usuarioActual.rol !== 'ESTUDIANTE') {
        alert("Acceso solo para estudiantes.");
        window.location.href = 'login.html';
        return;
    }

    document.getElementById('saludoAlumno').textContent = `¡Hola, ${usuarioActual.nombreCompleto.split(' ')[0]}!`;

    // 2. Cargar preferencia de Tema (Oscuro/Claro)
    if(localStorage.getItem('temaAuraLearn') === 'claro') {
        document.body.classList.add('light-mode');
        document.getElementById('btnTema').innerHTML = '<i class="fa-solid fa-sun"></i>';
    }

    cargarCursosEstudiante();
});

// ==========================================
// CAMBIO DE TEMA (OSCURO/CLARO)
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

// ==========================================
// CERRAR SESIÓN Y MENÚ MÓVIL
// ==========================================
document.getElementById('btnSalir').addEventListener('click', () => {
    localStorage.removeItem('usuarioAuraLearn');
    window.location.href = 'login.html';
});

document.getElementById('btn-menu').addEventListener('click', () => {
    document.querySelector('.sidebar').classList.toggle('mostrar');
});

// Navegación simple
document.getElementById('linkCursos').addEventListener('click', (e) => {
    e.preventDefault();
    document.getElementById('sec-cursos').style.display = 'block';
    document.getElementById('sec-perfil').style.display = 'none';
    document.querySelector('.nav-links li.active').classList.remove('active');
    e.target.closest('li').classList.add('active');
});

document.getElementById('linkPerfil').addEventListener('click', (e) => {
    e.preventDefault();
    document.getElementById('sec-cursos').style.display = 'none';
    document.getElementById('sec-perfil').style.display = 'block';
    document.querySelector('.nav-links li.active').classList.remove('active');
    e.target.closest('li').classList.add('active');
});

// ==========================================
// CARGAR CURSOS DESDE EL SERVIDOR
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
                grid.innerHTML += `
                    <div class="curso-card">
                        <h3>${curso.titulo}</h3>
                        <div class="profesor"><i class="fa-solid fa-chalkboard-user"></i> ${nombreProf}</div>
                        <p>${curso.descripcion}</p>
                        <button class="btn-empezar" onclick="abrirCurso(${curso.id}, '${curso.titulo}')">Entrar al Curso</button>
                    </div>
                `;
            });
        }
    } catch (error) { grid.innerHTML = "<p>Error al cargar los cursos.</p>"; }
}

window.abrirCurso = function(idCurso, titulo) {
    alert(`En el próximo paso abriremos el curso: ${titulo} para ver los videos en orden.`);
};