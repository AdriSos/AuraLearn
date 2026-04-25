package com.auralearn.backend.repository;

import com.auralearn.backend.model.Leccion;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface LeccionRepository extends JpaRepository<Leccion, Long> {
    // Esta función mágica nos traerá los videos ordenados (1, 2, 3...)
    List<Leccion> findByCursoIdOrderByOrdenAsc(Long cursoId);
}