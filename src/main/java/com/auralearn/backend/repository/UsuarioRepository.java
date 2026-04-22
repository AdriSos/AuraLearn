package com.auralearn.backend.repository;

import com.auralearn.backend.model.Usuario;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface UsuarioRepository extends JpaRepository<Usuario, Long> {
    // Este método extra nos servirá más adelante para el Login
    Optional<Usuario> findByCorreo(String correo);
}