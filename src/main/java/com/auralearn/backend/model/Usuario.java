package com.auralearn.backend.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;

@Entity
@Table(name = "al_usuarios")
public class Usuario {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank(message = "El nombre no puede estar vacío")
    private String nombreCompleto;

    @Email(message = "Debe ser un correo electrónico válido")
    @NotBlank(message = "El correo no puede estar vacío")
    @Column(unique = true)
    private String correo;

    private String contrasena;

    @NotBlank(message = "El rol es obligatorio")
    private String rol; // Guardaremos "ADMINISTRADOR" o "CLIENTE"

    // Constructores vacíos obligatorios para Spring
    public Usuario() {
    }

    // Getters y Setters para que la aplicación pueda leer y escribir los datos
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getNombreCompleto() { return nombreCompleto; }
    public void setNombreCompleto(String nombreCompleto) { this.nombreCompleto = nombreCompleto; }

    public String getCorreo() { return correo; }
    public void setCorreo(String correo) { this.correo = correo; }

    public String getContrasena() { return contrasena; }
    public void setContrasena(String contrasena) { this.contrasena = contrasena; }

    public String getRol() { return rol; }
    public void setRol(String rol) { this.rol = rol; }
}