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
                // 1. Permite las conexiones desde tu frontend
                .cors(Customizer.withDefaults())
                // 2. Desactiva la protección CSRF
                .csrf(csrf -> csrf.disable())
                // 3. LA LLAVE MAESTRA: /** significa "permite esta ruta y cualquier acción dentro de ella"
                .authorizeHttpRequests(auth -> auth
                        .requestMatchers("/api/usuarios/**", "/api/profesores/**", "/api/cursos/**", "/api/lecciones/**").permitAll()
                        .anyRequest().authenticated()
                );

        return http.build();
    }
}