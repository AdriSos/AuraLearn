const btnOjo = document.getElementById('btnOjo');
const inputContrasena = document.getElementById('contrasena');
const iconoOjo = document.getElementById('iconoOjo'); 

btnOjo.addEventListener('click', function() {
    if (inputContrasena.type === 'password') {
        inputContrasena.type = 'text';
        
        iconoOjo.classList.remove('fa-eye');
        iconoOjo.classList.add('fa-eye-slash');
    } else {
        inputContrasena.type = 'password';
        
        iconoOjo.classList.remove('fa-eye-slash');
        iconoOjo.classList.add('fa-eye');
    }
});

// ==========================================
// 2. Lógica para Iniciar Sesión (Conexión al Backend)
// ==========================================
document.getElementById('loginForm').addEventListener('submit', async function(event) {
    event.preventDefault(); // Evitamos que la página se recargue de golpe
    
    // Obtenemos los valores de los inputs
    const correo = document.getElementById('correo').value;
    const contrasena = document.getElementById('contrasena').value;
    const btnLogin = document.getElementById('btnLogin');
    const mensajeDiv = document.getElementById('mensaje');

    // Estado de carga visual
    btnLogin.textContent = "Ingresando...";
    btnLogin.disabled = true;
    mensajeDiv.className = "mensaje"; // Limpiamos mensajes anteriores

    // Preparamos los datos para enviarlos al servidor
    const credenciales = {
        correo: correo,
        contrasena: contrasena
    };

    try {
        // Hacemos la petición a nuestra "puerta" de login en Render
        const respuesta = await fetch('https://auralearn-pfxs.onrender.com/api/usuarios/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(credenciales)
        });

        if (respuesta.ok) {
            const datosUsuario = await respuesta.json();
            localStorage.setItem('usuarioAuraLearn', JSON.stringify(datosUsuario));
            
            mensajeDiv.textContent = "¡Bienvenido a AuraLearn!";
            mensajeDiv.classList.add("exito");
            
            // LA MAGIA DE LA REDIRECCIÓN
            setTimeout(() => {
                if (datosUsuario.rol === 'ADMINISTRADOR') {
                    window.location.href = 'admin.html'; // Lo mandamos al panel
                } else {
                    window.location.href = 'alumno.html'; // Lo mandamos a sus clases
                }
            }, 1500);
            
        } else {
            // Si la contraseña está mal o no existe el correo
            const errorData = await respuesta.text();
            mensajeDiv.textContent = errorData || "Correo o contraseña incorrectos.";
            mensajeDiv.classList.add("error");
        }
    } catch (error) {
        console.error("Error:", error);
        mensajeDiv.textContent = "Error de conexión con el servidor. Intenta de nuevo.";
        mensajeDiv.classList.add("error");
    } finally {
        // Restauramos el botón a la normalidad
        btnLogin.textContent = "Ingresar";
        btnLogin.disabled = false;
    }
});