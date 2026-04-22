package com.auralearn.backend.config;

import com.auralearn.backend.model.Usuario;
import com.auralearn.backend.repository.UsuarioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

@Component
public class DataInitializer implements CommandLineRunner {

    @Autowired
    private UsuarioRepository usuarioRepository;

    @Override
    public void run(String... args) throws Exception {
        // Verificamos si el administrador ya existe
        if (usuarioRepository.findByCorreo("aura.learn.ad@gmail.com").isEmpty()) {
            Usuario admin = new Usuario();
            admin.setNombreCompleto("Administrador AuraLearn");
            admin.setCorreo("aura.learn.ad@gmail.com");
            // Le ponemos una contraseña segura por defecto que tú conoces
            admin.setContrasena("AdminAura2026$");
            admin.setRol("ADMINISTRADOR");

            usuarioRepository.save(admin);
            System.out.println("Cuenta de administrador creada automáticamente.");
        }
    }
}