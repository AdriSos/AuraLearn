package com.auralearn.backend.repository;

import com.auralearn.backend.model.Inscripcion;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface InscripcionRepository extends JpaRepository<Inscripcion, Long> {
    // Esto nos ayudará a buscar si un cliente ya está inscrito en un curso específico
    Optional<Inscripcion> findByClienteIdAndCursoId(Long clienteId, Long cursoId);
}