package com.auralearn.backend.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

@Entity
@Table(name = "al_lecciones")
public class Leccion {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank(message = "El título es obligatorio")
    private String titulo;

    @NotBlank(message = "La URL del video es obligatoria")
    private String videoUrl; // Aquí irá el enlace al video que tú grabes

    @NotNull(message = "El orden es obligatorio")
    private Integer ordenSecuencia; // Este es el número: 1, 2, 3...

    @ManyToOne
    @JoinColumn(name = "curso_id")
    private Curso curso; // A qué curso pertenece este video

    public Leccion() {}

    // Getters y Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getTitulo() { return titulo; }
    public void setTitulo(String titulo) { this.titulo = titulo; }

    public String getVideoUrl() { return videoUrl; }
    public void setVideoUrl(String videoUrl) { this.videoUrl = videoUrl; }

    public Integer getOrdenSecuencia() { return ordenSecuencia; }
    public void setOrdenSecuencia(Integer ordenSecuencia) { this.ordenSecuencia = ordenSecuencia; }

    public Curso getCurso() { return curso; }
    public void setCurso(Curso curso) { this.curso = curso; }
}