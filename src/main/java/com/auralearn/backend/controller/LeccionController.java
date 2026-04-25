package com.auralearn.backend.controller;

import com.auralearn.backend.model.Leccion;
import com.auralearn.backend.repository.LeccionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/lecciones")
@CrossOrigin(origins = "*")
public class LeccionController {

    @Autowired
    private LeccionRepository leccionRepository;

    // Traer las lecciones de un curso en específico
    @GetMapping("/curso/{cursoId}")
    public ResponseEntity<List<Leccion>> obtenerLeccionesDelCurso(@PathVariable Long cursoId) {
        return ResponseEntity.ok(leccionRepository.findByCursoIdOrderByOrdenAsc(cursoId));
    }

    // Guardar un nuevo video
    @PostMapping
    public ResponseEntity<?> crearLeccion(@RequestBody Leccion leccion) {
        return ResponseEntity.ok(leccionRepository.save(leccion));
    }

    // Borrar un video
    @DeleteMapping("/{id}")
    public ResponseEntity<?> eliminarLeccion(@PathVariable Long id) {
        leccionRepository.deleteById(id);
        return ResponseEntity.ok().build();
    }
}