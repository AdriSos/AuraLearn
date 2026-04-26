document.getElementById('registroForm').addEventListener('submit', async function(event) {
    event.preventDefault();

    const nombre = document.getElementById('nombre').value;
    const correo = document.getElementById('correo').value;
    const btnRegistro = document.getElementById('btnRegistro');
    const mensajeDiv = document.getElementById('mensaje');

    btnRegistro.textContent = "Registrando...";
    btnRegistro.disabled = true;
    mensajeDiv.className = "mensaje"; 

    // Solo enviamos nombre y correo, el backend hará el resto
    const datosUsuario = {
        nombreCompleto: nombre,
        correo: correo,
        rol: "CLIENTE"
    };

    try {
        const respuesta = await fetch('https://auralearn-pfxs.onrender.com/api/usuarios/registro', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(datosUsuario)
        });

        if (respuesta.ok) {
            mensajeDiv.textContent = "¡Registro exitoso! Revisa tu correo electrónico para obtener tu contraseña temporal.";
            mensajeDiv.classList.add("exito");
            document.getElementById('registroForm').reset();
        } else {
            const errorData = await respuesta.text(); 
            mensajeDiv.textContent = errorData || "Error al registrar.";
            mensajeDiv.classList.add("error");
        }
    } catch (error) {
        mensajeDiv.textContent = "Error de conexión con el servidor.";
        mensajeDiv.classList.add("error");
    } finally {
        btnRegistro.textContent = "Registrarse";
        btnRegistro.disabled = false;
    }
});