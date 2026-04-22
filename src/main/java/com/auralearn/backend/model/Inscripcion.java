package com.auralearn.backend.model;

import jakarta.persistence.*;

@Entity
@Table(name = "al_inscripciones")
public class Inscripcion {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "usuario_id")
    private Usuario cliente; // El estudiante

    @ManyToOne
    @JoinColumn(name = "curso_id")
    private Curso curso; // El curso que está tomando

    // Aquí está la magia para que no se salten videos
    @Column(name = "leccion_actual_orden")
    private Integer leccionActualOrden = 1; // Todos empiezan en la lección 1

    private boolean terminado = false; // Cambiará a true cuando vea el último video

    public Inscripcion() {}

    // Getters y Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Usuario getCliente() { return cliente; }
    public void setCliente(Usuario cliente) { this.cliente = cliente; }

    public Curso getCurso() { return curso; }
    public void setCurso(Curso curso) { this.curso = curso; }

    public Integer getLeccionActualOrden() { return leccionActualOrden; }
    public void setLeccionActualOrden(Integer leccionActualOrden) { this.leccionActualOrden = leccionActualOrden; }

    public boolean isTerminado() { return terminado; }
    public void setTerminado(boolean terminado) { this.terminado = terminado; }
}