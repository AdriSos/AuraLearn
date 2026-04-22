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
}