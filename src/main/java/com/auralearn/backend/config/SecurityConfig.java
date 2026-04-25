package com.auralearn.backend.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.web.SecurityFilterChain;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                // 1. Permite las conexiones desde tu frontend en Hostinger
                .cors(Customizer.withDefaults())
                // 2. Desactiva la protección CSRF (obligatorio para que funcionen las APIs REST)
                .csrf(csrf -> csrf.disable())
                // 3. Le decimos qué puertas dejar abiertas
                .authorizeHttpRequests(auth -> auth
                        // Agregamos /api/profesores a las puertas libres (por ahora, para facilitar el desarrollo)
                        .requestMatchers("/api/usuarios/registro", "/api/usuarios/login", "/api/profesores", "/api/cursos", "/api/lecciones").permitAll()
                        .anyRequest().authenticated()
                );

        return http.build();
    }
}