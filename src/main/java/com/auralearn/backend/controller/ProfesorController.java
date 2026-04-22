package com.auralearn.backend.controller;

import com.auralearn.backend.model.Profesor;
import com.auralearn.backend.repository.ProfesorRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/profesores")
@CrossOrigin(origins = "*")
public class ProfesorController {

    @Autowired
    private ProfesorRepository profesorRepository;

    // 1. Guardar un nuevo profesor
    @PostMapping
    public ResponseEntity<?> registrarProfesor(@RequestBody Profesor profesor) {
        Profesor profesorGuardado = profesorRepository.save(profesor);
        return ResponseEntity.ok(profesorGuardado);
    }

    // 2. Obtener la lista de todos los profesores (para verlos en la tabla)
    @GetMapping
    public ResponseEntity<List<Profesor>> obtenerTodos() {
        return ResponseEntity.ok(profesorRepository.findAll());
    }

    // 3. Actualizar un profesor (PUT)
    @PutMapping("/{id}")
    public ResponseEntity<?> actualizarProfesor(@PathVariable Long id, @RequestBody Profesor detallesProfesor) {
        return profesorRepository.findById(id).map(profesor -> {
            profesor.setNombre(detallesProfesor.getNombre());
            profesor.setCorreo(detallesProfesor.getCorreo());
            profesor.setEspecialidad(detallesProfesor.getEspecialidad());
            Profesor profesorActualizado = profesorRepository.save(profesor);
            return ResponseEntity.ok(profesorActualizado);
        }).orElse(ResponseEntity.notFound().build());
    }

    // 4. Eliminar un profesor (DELETE)
    @DeleteMapping("/{id}")
    public ResponseEntity<?> eliminarProfesor(@PathVariable Long id) {
        return profesorRepository.findById(id).map(profesor -> {
            profesorRepository.delete(profesor);
            return ResponseEntity.ok().build();
        }).orElse(ResponseEntity.notFound().build());
    }
}