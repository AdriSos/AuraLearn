package com.auralearn.backend.repository;

import com.auralearn.backend.model.Leccion;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface LeccionRepository extends JpaRepository<Leccion, Long> {
    // Este método nos devolverá los videos de un curso ordenados por su secuencia (1, 2, 3...)
    List<Leccion> findByCursoIdOrderByOrdenSecuenciaAsc(Long cursoId);
}