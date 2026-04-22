package com.auralearn.backend.controller;

import com.auralearn.backend.model.Curso;
import com.auralearn.backend.repository.CursoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/cursos")
@CrossOrigin(origins = "*")
public class CursoController {

    @Autowired
    private CursoRepository cursoRepository;

    // 1. Crear Curso
    @PostMapping
    public ResponseEntity<?> crearCurso(@RequestBody Curso curso) {
        return ResponseEntity.ok(cursoRepository.save(curso));
    }

    // 2. Leer todos los Cursos
    @GetMapping
    public ResponseEntity<List<Curso>> obtenerCursos() {
        return ResponseEntity.ok(cursoRepository.findAll());
    }

    // 3. Actualizar Curso
    @PutMapping("/{id}")
    public ResponseEntity<?> actualizarCurso(@PathVariable Long id, @RequestBody Curso detalles) {
        return cursoRepository.findById(id).map(curso -> {
            // Nota: Asegúrate de que los nombres getTitulo y getDescripcion coincidan con los de tu archivo Curso.java
            curso.setTitulo(detalles.getTitulo());
            curso.setDescripcion(detalles.getDescripcion());
            return ResponseEntity.ok(cursoRepository.save(curso));
        }).orElse(ResponseEntity.notFound().build());
    }

    // 4. Eliminar Curso
    @DeleteMapping("/{id}")
    public ResponseEntity<?> eliminarCurso(@PathVariable Long id) {
        return cursoRepository.findById(id).map(curso -> {
            cursoRepository.delete(curso);
            return ResponseEntity.ok().build();
        }).orElse(ResponseEntity.notFound().build());
    }
}