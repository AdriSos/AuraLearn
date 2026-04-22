package com.auralearn.backend.controller;

import com.auralearn.backend.model.Usuario;
import com.auralearn.backend.repository.UsuarioRepository;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/usuarios")
@CrossOrigin(origins = "*")
public class UsuarioController {

    @Autowired
    private UsuarioRepository usuarioRepository;

    // Esta es la "puerta" para el registro
    @PostMapping("/registro")
    public ResponseEntity<?> registrarUsuario(@Valid @RequestBody Usuario nuevoUsuario) {

        // 1. Verificamos si el correo ya existe en la base de datos
        if(usuarioRepository.findByCorreo(nuevoUsuario.getCorreo()).isPresent()) {
            return ResponseEntity.badRequest().body("Error: El correo ya está registrado en AuraLearn.");
        }

        // 2. Por seguridad, si no envían rol, le asignamos "CLIENTE" por defecto
        if(nuevoUsuario.getRol() == null || nuevoUsuario.getRol().isEmpty()){
            nuevoUsuario.setRol("CLIENTE");
        }

        // 3. Guardamos al usuario (¡Aquí Spring Boot automáticamente verifica que la contraseña cumpla con tus reglas de seguridad!)
        Usuario usuarioGuardado = usuarioRepository.save(nuevoUsuario);

        return ResponseEntity.ok(usuarioGuardado);
    }
}