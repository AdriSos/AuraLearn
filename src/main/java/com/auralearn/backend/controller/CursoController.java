package com.auralearn.backend.controller;

import com.auralearn.backend.model.Curso;
import com.auralearn.backend.repository.CursoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/cursos")
public class CursoController {

    @Autowired
    private CursoRepository cursoRepository;

    @PostMapping
    public ResponseEntity<?> crearCurso(@RequestBody Curso curso) {
        return ResponseEntity.ok(cursoRepository.save(curso));
    }

    @GetMapping
    public ResponseEntity<List<Curso>> obtenerCursos() {
        return ResponseEntity.ok(cursoRepository.findAll());
    }

    // PUERTA PARA ACTUALIZAR CURSOS (CORREGIDA ANTI ERROR 500)
    @PutMapping("/{id}")
    public org.springframework.http.ResponseEntity<?> actualizarCurso(@PathVariable Long id, @RequestBody Curso detalles) {
        return cursoRepository.findById(id).map(curso -> {
            // Actualizamos los datos solo si la página los envía
            if (detalles.getTitulo() != null) curso.setTitulo(detalles.getTitulo());
            if (detalles.getDescripcion() != null) curso.setDescripcion(detalles.getDescripcion());
            if (detalles.getProfesor() != null) curso.setProfesor(detalles.getProfesor());

            // Guardamos en la base de datos
            cursoRepository.save(curso);

            // Devolvemos un OK vacío para evitar que Java entre en un bucle infinito
            return org.springframework.http.ResponseEntity.ok().build();
        }).orElse(org.springframework.http.ResponseEntity.notFound().build());
    }

    // PUERTA PARA ELIMINAR CURSOS
    @DeleteMapping("/{id}")
    public org.springframework.http.ResponseEntity<?> eliminarCurso(@PathVariable Long id) {
        return cursoRepository.findById(id).map(curso -> {
            // Usamos cursoRepository en lugar de usuarioRepository
            cursoRepository.delete(curso);
            return org.springframework.http.ResponseEntity.ok().build();
        }).orElse(org.springframework.http.ResponseEntity.notFound().build());
    }
}