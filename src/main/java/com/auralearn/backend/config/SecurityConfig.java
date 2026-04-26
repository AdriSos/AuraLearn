package com.auralearn.backend.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
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
                .cors(Customizer.withDefaults())
                .csrf(csrf -> csrf.disable())
                .authorizeHttpRequests(auth -> auth
                        // 1. Evita que el navegador bloquee el envío de datos (CORS)
                        .requestMatchers(HttpMethod.OPTIONS, "/**").permitAll()
                        // 2. Evita la trampa del error oculto
                        .requestMatchers("/error").permitAll()
                        // 3. Abre TODA la API temporalmente para tu entrega de hoy
                        .requestMatchers("/api/**").permitAll()
                        .anyRequest().authenticated()
                );

        return http.build();
    }
}