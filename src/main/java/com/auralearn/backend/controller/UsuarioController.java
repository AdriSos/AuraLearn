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

        nuevoUsuario.setRol("CLIENTE");

        String contrasenaTemporal = generarContrasenaTemporal();
        nuevoUsuario.setContrasena(contrasenaTemporal);

        Usuario usuarioGuardado = usuarioRepository.save(nuevoUsuario);

        String asunto = "¡Bienvenido a AuraLearn! Tu contraseña temporal";
        String mensaje = "Hola " + usuarioGuardado.getNombreCompleto() + ",\n\n"
                + "Te damos esta contraseña temporalmente. Una vez iniciando sesión, cambia tu contraseña en configuración.\n\n"
                + "Tu contraseña temporal es: " + contrasenaTemporal + "\n\n"
                + "¡Gracias por unirte a la mejor plataforma de educación!";

        emailService.enviarCorreo(usuarioGuardado.getCorreo(), asunto, mensaje);

        return ResponseEntity.ok("Usuario registrado y correo enviado.");
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
}