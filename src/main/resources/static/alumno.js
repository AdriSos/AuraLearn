/* Variables de Color (Tema Oscuro por defecto) */
:root {
    --bg-color: #121212;
    --text-color: #ffffff;
    --sidebar-bg: #1a1a1a;
    --card-bg: #1e1e1e;
    --border-color: #333333;
    --primary-color: #08606E;
    --primary-hover: #064a55;
}

/* Variables para el Tema Claro */
body.light-mode {
    --bg-color: #f4f6f9;
    --text-color: #2c3e50;
    --sidebar-bg: #ffffff;
    --card-bg: #ffffff;
    --border-color: #e0e0e0;
    --primary-color: #08606E;
}

* { margin: 0; padding: 0; box-sizing: border-box; font-family: 'Segoe UI', sans-serif; }

body { 
    display: flex; min-height: 100vh; 
    background-color: var(--bg-color); color: var(--text-color); 
    transition: background-color 0.3s, color 0.3s;
}

.highlight { color: var(--primary-color); }

/* Menú Lateral */
.sidebar { width: 250px; background-color: var(--sidebar-bg); padding: 20px 0; display: flex; flex-direction: column; border-right: 2px solid var(--primary-color); transition: background-color 0.3s; }
.sidebar-header { text-align: center; margin-bottom: 30px; }
.sidebar-header h2 { font-size: 2rem; }
.sidebar-header p { color: #888; font-size: 0.9rem; margin-top: 5px;}

.nav-links { list-style: none; flex-grow: 1; }
.nav-links a { display: block; padding: 15px 20px; color: var(--text-color); text-decoration: none; transition: 0.3s; }
.nav-links a i { margin-right: 10px; width: 20px; text-align: center; }
.nav-links a:hover, .nav-links li.active a { background-color: var(--primary-color); color: white; border-radius: 0 20px 20px 0; margin-right: 15px;}

.logout { padding: 20px; }
.logout button { width: 100%; padding: 10px; background-color: transparent; border: 1px solid #dc3545; color: #dc3545; border-radius: 5px; cursor: pointer; transition: 0.3s; }
.logout button:hover { background-color: #dc3545; color: white; }

/* Contenido Principal */
.main-content { flex-grow: 1; padding: 40px; overflow-y: auto; }
.alumno-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px; }
.header-izq { display: flex; align-items: center; gap: 15px; }
.subtitle { color: #888; margin-bottom: 30px; }

/* Botones Superiores */
.btn-toggle { background: none; border: none; color: var(--primary-color); font-size: 1.8rem; cursor: pointer; display: none; }
.btn-tema { background-color: var(--card-bg); border: 1px solid var(--border-color); color: var(--text-color); padding: 10px 15px; border-radius: 50%; cursor: pointer; font-size: 1.2rem; transition: 0.3s; }
.btn-tema:hover { border-color: var(--primary-color); color: var(--primary-color); }

/* Grid de Cursos */
.cursos-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); gap: 25px; }
.curso-card { background-color: var(--card-bg); border: 1px solid var(--border-color); border-radius: 10px; padding: 25px; box-shadow: 0 4px 6px rgba(0,0,0,0.1); transition: 0.3s; display: flex; flex-direction: column;}
.curso-card:hover { transform: translateY(-5px); border-color: var(--primary-color); }
.curso-card h3 { font-size: 1.2rem; margin-bottom: 10px; color: var(--primary-color);}
.curso-card .profesor { font-size: 0.85rem; font-weight: bold; color: #888; margin-bottom: 15px; }
.curso-card p { font-size: 0.95rem; margin-bottom: 20px; flex-grow: 1; line-height: 1.5; }
.btn-empezar { width: 100%; padding: 12px; background-color: var(--primary-color); color: white; border: none; border-radius: 5px; cursor: pointer; font-weight: bold; transition: 0.3s; }
.btn-empezar:hover { background-color: var(--primary-hover); }

/* ==========================================
   SALA DE CLASES (SISTEMA DE BLOQUEO)
   ========================================== */
.sala-layout { display: flex; gap: 20px; margin-top: 20px; flex-wrap: wrap; }
.video-container { flex: 2; min-width: 300px; background: #000; border-radius: 10px; overflow: hidden; aspect-ratio: 16/9; box-shadow: 0 4px 15px rgba(0,0,0,0.5);}
.playlist-container { flex: 1; min-width: 250px; background: var(--card-bg); padding: 20px; border-radius: 10px; border: 1px solid var(--border-color); max-height: 500px; overflow-y: auto;}

.playlist { list-style: none; margin-top: 15px; }
.playlist li { padding: 15px; border-bottom: 1px solid var(--border-color); cursor: pointer; display: flex; align-items: center; gap: 10px; transition: 0.3s;}
.playlist li:hover { background-color: var(--primary-hover); color: white; }
.playlist li.activa { background-color: var(--primary-color); color: white; font-weight: bold; border-left: 4px solid #fff;}

.playlist li.bloqueada { opacity: 0.4; cursor: not-allowed; }
.playlist li.bloqueada:hover { background-color: transparent; color: inherit; }
.btn-cancelar { background-color: #6c757d; color: white; border: none; padding: 10px 20px; border-radius: 5px; cursor: pointer; transition: 0.3s;}
.btn-cancelar:hover { background-color: #5a6268; }

/* ==========================================
   PERFIL Y CONFIGURACIÓN
   ========================================== */
.perfil-card { background: var(--card-bg); padding: 30px; border-radius: 10px; border: 1px solid var(--border-color); max-width: 500px; margin-top: 20px; box-shadow: 0 4px 10px rgba(0,0,0,0.2);}
.perfil-info { text-align: center; margin-bottom: 30px; border-bottom: 1px solid var(--border-color); padding-bottom: 20px;}
.avatar { width: 80px; height: 80px; background: var(--primary-color); color: white; border-radius: 50%; display: flex; justify-content: center; align-items: center; font-size: 2.5rem; margin: 0 auto 15px; }

.admin-form .input-group { margin-bottom: 15px; }
.admin-form label { display: block; margin-bottom: 8px; color: #888; font-size: 0.9rem;}
.admin-form input { width: 100%; padding: 10px; background-color: var(--bg-color); border: 1px solid var(--border-color); border-radius: 5px; color: var(--text-color); margin-top: 5px; }
.admin-form input:focus { outline: none; border-color: var(--primary-color); }
.btn-primary { padding: 10px 20px; width: 100%; background-color: var(--primary-color); color: white; border: none; border-radius: 5px; cursor: pointer; transition: 0.3s; font-weight: bold;}
.btn-primary:hover { background-color: var(--primary-hover); }

.mensaje { margin-top: 15px; padding: 10px; border-radius: 5px; display: none; text-align: center;}
.exito { background-color: rgba(40, 167, 69, 0.2); color: #28a745; display: block;}
.error { background-color: rgba(220, 53, 69, 0.2); color: #dc3545; display: block;}

/* Responsivo */
@media (max-width: 768px) {
    .btn-toggle { display: block; }
    .main-content { padding: 20px; }
    .sidebar { position: fixed; left: -250px; top: 0; height: 100vh; z-index: 1000; box-shadow: 2px 0 15px rgba(0,0,0,0.5); }
    .sidebar.mostrar { left: 0; }
}const URL_API_CURSOS = 'https://auralearn-pfxs.onrender.com/api/cursos';
 const URL_API_LECCIONES = 'https://auralearn-pfxs.onrender.com/api/lecciones';

 let usuarioActual = null;
 let player; // El reproductor mágico de YouTube
 let leccionesActuales = [];
 let indiceLeccionActual = 0;

 // 1. INICIALIZACIÓN Y SEGURIDAD
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

     // Cargar preferencia de Tema (Oscuro/Claro)
     if(localStorage.getItem('temaAuraLearn') === 'claro') {
         document.body.classList.add('light-mode');
         document.getElementById('btnTema').innerHTML = '<i class="fa-solid fa-sun"></i>';
     }

     // Llenar datos del perfil
     document.getElementById('perfilNombre').textContent = usuarioActual.nombreCompleto;
     document.getElementById('perfilCorreo').textContent = usuarioActual.correo;

     cargarCursosEstudiante();
 });

 // ==========================================
 // MENÚ, TEMA Y CERRAR SESIÓN
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

 // Navegación del Menú Lateral
 document.getElementById('linkCursos').addEventListener('click', (e) => {
     e.preventDefault();
     document.getElementById('sec-cursos').style.display = 'block';
     document.getElementById('sec-sala-clases').style.display = 'none';
     document.getElementById('sec-perfil').style.display = 'none';
     document.querySelector('.nav-links li.active').classList.remove('active');
     e.target.closest('li').classList.add('active');
     if(player) { player.pauseVideo(); } // Pausa el video si sale de la sala
 });

 document.getElementById('linkPerfil').addEventListener('click', (e) => {
     e.preventDefault();
     document.getElementById('sec-cursos').style.display = 'none';
     document.getElementById('sec-sala-clases').style.display = 'none';
     document.getElementById('sec-perfil').style.display = 'block';
     document.querySelector('.nav-links li.active').classList.remove('active');
     e.target.closest('li').classList.add('active');
     if(player) { player.pauseVideo(); }
 });

 // Simulación de cambio de contraseña
 document.getElementById('formCambiarPassword').addEventListener('submit', (e) => {
     e.preventDefault();
     const mensaje = document.getElementById('mensajePerfil');
     mensaje.textContent = "Contraseña actualizada correctamente.";
     mensaje.className = "mensaje exito";
     document.getElementById('nuevaPassword').value = '';
     setTimeout(() => { mensaje.style.display = 'none'; }, 3000);
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
                         <p>${curso.descripcion.substring(0, 80)}...</p>
                         <button class="btn-empezar" onclick="abrirCurso(${curso.id}, '${curso.titulo}')">Entrar al Curso</button>
                     </div>
                 `;
             });
         }
     } catch (error) { grid.innerHTML = "<p>Error al cargar los cursos.</p>"; }
 }

 // ==========================================
 // LA SALA DE CLASES (API YOUTUBE & BLOQUEO)
 // ==========================================

 // Inyectamos el cable espía de YouTube
 const tag = document.createElement('script');
 tag.src = "https://www.youtube.com/iframe_api";
 const firstScriptTag = document.getElementsByTagName('script')[0];
 firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

 function onYouTubeIframeAPIReady() { console.log("API de YouTube lista."); }

 window.abrirCurso = async function(idCurso, titulo) {
     document.getElementById('sec-cursos').style.display = 'none';
     document.getElementById('sec-perfil').style.display = 'none';
     document.getElementById('sec-sala-clases').style.display = 'block';
     document.getElementById('tituloCursoActual').textContent = titulo;

     const lista = document.getElementById('listaLeccionesAlumno');
     lista.innerHTML = "<li>Cargando lecciones...</li>";

     try {
         const respuesta = await fetch(`${URL_API_LECCIONES}/curso/${idCurso}`);
         if(respuesta.ok) {
             leccionesActuales = await respuesta.json();
             renderizarPlaylist();

             if(leccionesActuales.length > 0) {
                 cargarVideo(0);
             } else {
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
         let estadoClass = index === 0 ? "libre" : "bloqueada";
         let icono = index === 0 ? "fa-play" : "fa-lock";

         lista.innerHTML += `
             <li id="lec-${index}" class="${estadoClass}" onclick="intentarVerVideo(${index})">
                 <i class="fa-solid ${icono}"></i> ${index + 1}. ${lec.titulo}
             </li>
         `;
     });
 }

 window.intentarVerVideo = function(index) {
     const item = document.getElementById(`lec-${index}`);
     if (item.classList.contains('bloqueada')) {
         alert("🔒 No puedes saltarte lecciones. Debes terminar el video anterior.");
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
     } else {
         player.loadVideoById(videoId);
     }
 }

 function vigilanteVideos(event) {
     if (event.data === 0) {
         const siguienteIndex = indiceLeccionActual + 1;

         if (siguienteIndex < leccionesActuales.length) {
             const sigItem = document.getElementById(`lec-${siguienteIndex}`);
             sigItem.classList.remove('bloqueada');
             sigItem.innerHTML = `<i class="fa-solid fa-unlock"></i> ${siguienteIndex + 1}. ${leccionesActuales[siguienteIndex].titulo}`;

             setTimeout(() => { cargarVideo(siguienteIndex); }, 2000);
         } else {
             alert("🎓 ¡Felicidades! Has terminado el curso.");
         }
     }
 }

 document.getElementById('btnVolverCursos').addEventListener('click', () => {
     document.getElementById('sec-sala-clases').style.display = 'none';
     document.getElementById('sec-cursos').style.display = 'block';
     if(player) { player.pauseVideo(); }
 });