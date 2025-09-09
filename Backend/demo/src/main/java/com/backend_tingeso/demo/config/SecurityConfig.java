package com.backend_tingeso.demo.config;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.http.HttpStatus;
import org.springframework.security.authentication.AbstractAuthenticationToken;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.security.oauth2.jwt.JwtDecoder;
import org.springframework.security.oauth2.jwt.NimbusJwtDecoder;
import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationToken;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.HttpStatusEntryPoint;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.*;
import java.util.stream.Collectors;

@Configuration
public class SecurityConfig {

    private static final Logger log = LoggerFactory.getLogger(SecurityConfig.class);
    private final String jwkSetUri = "http://localhost:8080/realms/toolrent/protocol/openid-connect/certs";

    @Bean
    public JwtDecoder jwtDecoder() {
        return NimbusJwtDecoder.withJwkSetUri(jwkSetUri).build();
    }

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                .csrf(csrf -> csrf.disable())
                .cors(cors -> cors.configurationSource(corsConfigurationSource()))
                .authorizeHttpRequests(auth -> auth
                        // Endpoints que requieren rol específico
                        .requestMatchers("/api/v1/admin/**").hasRole("ADMIN")
                        .requestMatchers("/api/v1/empleado/**").hasRole("EMPLEADO")
                        .requestMatchers("/api/v1/tools", "/api/v1/tools/**").authenticated()
                        .requestMatchers("/api/v1/loans", "/api/v1/loans/**").authenticated()
                        .requestMatchers("/api/v1/customers", "/api/v1/customers/**").authenticated()
                        .requestMatchers(HttpMethod.OPTIONS, "/**").permitAll()
                        .anyRequest().authenticated()
                )
                .oauth2ResourceServer(oauth2 -> oauth2
                        .jwt(jwt -> jwt.jwtAuthenticationConverter(this::convertRoles))
                )
                .exceptionHandling(ex -> ex
                        .authenticationEntryPoint(new HttpStatusEntryPoint(HttpStatus.UNAUTHORIZED))
                );

        return http.build();
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        configuration.setAllowedOrigins(List.of("http://localhost:5173"));
        configuration.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE", "OPTIONS"));
        configuration.setAllowedHeaders(List.of("*"));
        configuration.setAllowCredentials(true);
        configuration.setMaxAge(3600L);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }

    private AbstractAuthenticationToken convertRoles(Jwt jwt) {
        try {
            log.debug("Converting JWT roles. Subject: {}", jwt.getSubject());
            Collection<GrantedAuthority> authorities = extractAuthorities(jwt);
            log.debug("Extracted authorities: {}", authorities);
            return new JwtAuthenticationToken(jwt, authorities);
        } catch (Exception e) {
            log.error("Error converting roles: ", e);
            return new JwtAuthenticationToken(jwt, Collections.emptyList());
        }
    }

    private Collection<GrantedAuthority> extractAuthorities(Jwt jwt) {
        Collection<GrantedAuthority> authorities = new ArrayList<>();

        try {
            log.info("=== EXTRACTING AUTHORITIES ===");

            // Log todos los claims disponibles
            jwt.getClaims().forEach((key, value) -> {
                log.info("Claim '{}': {}", key, value);
            });

            // Roles de realm (estructura estándar de Keycloak)
            Map<String, Object> realmAccess = jwt.getClaimAsMap("realm_access");
            if (realmAccess != null) {
                log.info("realm_access found: {}", realmAccess);
                if (realmAccess.containsKey("roles")) {
                    List<String> realmRoles = (List<String>) realmAccess.get("roles");
                    log.info("Realm roles: {}", realmRoles);
                    authorities.addAll(realmRoles.stream()
                            .filter(role -> !role.startsWith("default-roles-") && !role.equals("offline_access") && !role.equals("uma_authorization"))
                            .map(role -> {
                                String authority = "ROLE_" + role.toUpperCase();
                                log.info("Adding authority: {}", authority);
                                return new SimpleGrantedAuthority(authority);
                            })
                            .collect(Collectors.toList()));
                }
            } else {
                log.info("No realm_access found");
            }

            // También verificar si hay roles directos
            List<String> directRoles = jwt.getClaimAsStringList("roles");
            if (directRoles != null) {
                log.info("Direct roles: {}", directRoles);
                authorities.addAll(directRoles.stream()
                        .map(role -> {
                            String authority = "ROLE_" + role.toUpperCase();
                            log.info("Adding direct authority: {}", authority);
                            return new SimpleGrantedAuthority(authority);
                        })
                        .collect(Collectors.toList()));
            } else {
                log.info("No direct roles found");
            }

            // Verificar roles en resource_access - AQUÍ ESTABA EL ERROR
            Map<String, Object> resourceAccess = jwt.getClaimAsMap("resource_access");
            if (resourceAccess != null) {
                log.info("resource_access found: {}", resourceAccess);
                resourceAccess.forEach((client, clientData) -> {
                    log.info("Client '{}': {}", client, clientData);
                    if (clientData instanceof Map) {
                        Map<String, Object> clientMap = (Map<String, Object>) clientData;
                        if (clientMap.containsKey("roles")) {
                            List<String> clientRoles = (List<String>) clientMap.get("roles");
                            log.info("Client '{}' roles: {}", client, clientRoles);

                            // AQUÍ ESTABA EL PROBLEMA - FALTABA AGREGAR LOS ROLES A AUTHORITIES
                            authorities.addAll(clientRoles.stream()
                                    .map(role -> {
                                        String authority = "ROLE_" + role.toUpperCase();
                                        log.info("Adding client authority: {}", authority);
                                        return new SimpleGrantedAuthority(authority);
                                    })
                                    .collect(Collectors.toList()));
                        }
                    }
                });
            } else {
                log.info("No resource_access found");
            }

            log.info("Final extracted authorities: {}", authorities);

        } catch (Exception e) {
            log.error("Error extracting authorities from JWT", e);
        }

        return authorities;
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }
}