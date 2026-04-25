package com.auralearn.backend.model;

import jakarta.persistence.*;

@Entity
@Table(name = "al_lecciones")
public class Leccion {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String titulo;
    private String urlVideo; // Aquí guardaremos el link transformado de YouTube
    private Integer orden;   // Para saber qué video va primero (1, 2, 3...)

    @ManyToOne
    @JoinColumn(name = "curso_id")
    private Curso curso;

    public Leccion() {}

    // Getters y Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getTitulo() { return titulo; }
    public void setTitulo(String titulo) { this.titulo = titulo; }

    public String getUrlVideo() { return urlVideo; }
    public void setUrlVideo(String urlVideo) { this.urlVideo = urlVideo; }

    public Integer getOrden() { return orden; }
    public void setOrden(Integer orden) { this.orden = orden; }

    public Curso getCurso() { return curso; }
    public void setCurso(Curso curso) { this.curso = curso; }
}