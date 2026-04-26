package com.auralearn.backend.controller;

import com.auralearn.backend.model.Usuario;
import com.auralearn.backend.repository.UsuarioRepository;
import com.auralearn.backend.service.EmailService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.security.SecureRandom;

@RestController
@RequestMapping("/api/usuarios")
@CrossOrigin(origins = "*")
public class UsuarioController {

    @Autowired
    private UsuarioRepository usuarioRepository;

    @Autowired
    private EmailService emailService; // Traemos a nuestro cartero

    @PostMapping("/registro")
    public ResponseEntity<?> registrarUsuario(@RequestBody Usuario nuevoUsuario) {

        if(usuarioRepository.findByCorreo(nuevoUsuario.getCorreo()).isPresent()) {
            return ResponseEntity.badRequest().body("Error: El correo ya está registrado en AuraLearn.");
        }

        // Respetar el rol si ya viene (como PROFESOR), si no, poner ALUMNO
        if (nuevoUsuario.getRol() == null || nuevoUsuario.getRol().isEmpty()) {
            nuevoUsuario.setRol("ALUMNO");
        }

        String contrasenaTemporal = generarContrasenaTemporal();
        nuevoUsuario.setContrasena(contrasenaTemporal);

        // Guardamos al usuario SIEMPRE, sin importar si el correo falla
        Usuario usuarioGuardado = usuarioRepository.save(nuevoUsuario);

        // ESCUDO ANTI-ERRORES PARA EL CORREO
        try {
            String asunto = "¡Bienvenido a AuraLearn! Tu contraseña temporal";
            String mensaje = "Hola " + usuarioGuardado.getNombreCompleto() + ",\n\n"
                    + "Te damos esta contraseña temporalmente. Una vez iniciando sesión, cambia tu contraseña en configuración.\n\n"
                    + "Tu contraseña temporal es: " + contrasenaTemporal + "\n\n"
                    + "¡Gracias por unirte a la mejor plataforma de educación!";

            emailService.enviarCorreo(usuarioGuardado.getCorreo(), asunto, mensaje);
        } catch (Exception e) {
            System.out.println("El usuario se guardó, pero hubo un error enviando el correo: " + e.getMessage());
        }

        return ResponseEntity.ok("Usuario registrado exitosamente.");
    }

    @PostMapping("/login")
    public ResponseEntity<?> loginUsuario(@RequestBody Usuario credenciales) {
        // Buscamos si el correo existe
        var usuarioOpt = usuarioRepository.findByCorreo(credenciales.getCorreo());

        if (usuarioOpt.isPresent()) {
            Usuario usuario = usuarioOpt.get();
            // Verificamos si la contraseña coincide
            if (usuario.getContrasena().equals(credenciales.getContrasena())) {
                return ResponseEntity.ok(usuario); // ¡Éxito! Devolvemos los datos del usuario
            }
        }
        // Si falla, enviamos un error 401 (No autorizado)
        return ResponseEntity.status(401).body("Correo o contraseña incorrectos");
    }


    private String generarContrasenaTemporal() {
        final String chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*";
        SecureRandom random = new SecureRandom();
        StringBuilder sb = new StringBuilder();
        // Genera una contraseña de 10 caracteres
        for (int i = 0; i < 10; i++) {
            int randomIndex = random.nextInt(chars.length());
            sb.append(chars.charAt(randomIndex));
        }

        return "A1@" + sb.toString();
    }


    // NUEVA PUERTA PARA ACTUALIZAR USUARIOS (CONTRASEÑA Y FOTO)
    @PutMapping("/{id}")
    public org.springframework.http.ResponseEntity<Usuario> actualizarUsuario(@PathVariable Long id, @RequestBody Usuario usuarioActualizado) {
        return usuarioRepository.findById(id)
                .map(usuario -> {
                    // Actualizamos la contraseña con la nueva que mandó la página web
                    usuario.setContrasena(usuarioActualizado.getContrasena());

                    // Guardamos los cambios en la base de datos
                    return org.springframework.http.ResponseEntity.ok(usuarioRepository.save(usuario));
                })
                .orElse(org.springframework.http.ResponseEntity.notFound().build());
    }

    // Puerta para obtener a TODOS los usuarios (Profesores y Alumnos)
    @GetMapping
    public java.util.List<Usuario> obtenerTodosLosUsuarios() {
        return usuarioRepository.findAll();
    }

    // PUERTA PARA ELIMINAR USUARIOS
    @DeleteMapping("/{id}")
    public org.springframework.http.ResponseEntity<?> eliminarUsuario(@PathVariable Long id) {
        return usuarioRepository.findById(id).map(usuario -> {
            usuarioRepository.delete(usuario);
            return org.springframework.http.ResponseEntity.ok().build();
        }).orElse(org.springframework.http.ResponseEntity.notFound().build());
    }
}