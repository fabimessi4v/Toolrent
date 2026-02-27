package com.backend_tingeso.demo.controller;

import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@CrossOrigin(origins = "http://localhost:5173")
@RestController
@RequestMapping("/api/v1/login")
public class UsersController {
    private static final String PREFERRED_USERNAME = "preferred_username";
    /**
     * Endpoint accesible por cualquier usuario autenticado
     */
    @GetMapping("/me")
    public Map<String, Object> getCurrentUser(@AuthenticationPrincipal Jwt jwt) {
        return Map.of(
                "username", jwt.getClaim(PREFERRED_USERNAME),
                "email", jwt.getClaim("email"),
                "roles", jwt.getClaim("realm_access") // roles dentro de realm_access
        );
    }

    /**
     * Endpoint accesible solo por usuarios con rol USER
     */
    @GetMapping("/user")
    public String userAccess(@AuthenticationPrincipal Jwt jwt) {
        return "Hola " + jwt.getClaim(PREFERRED_USERNAME) + ", tienes acceso como USER!";
    }

    /**
     * Endpoint accesible solo por usuarios con rol ADMIN
     */
    @GetMapping("/admin")
    public String adminAccess(@AuthenticationPrincipal Jwt jwt) {
        return "Hola " + jwt.getClaim(PREFERRED_USERNAME) + ", tienes acceso como ADMIN!";
    }

    /**
     * Endpoint público, no requiere autenticación
     */
    @GetMapping("/public")
    public String publicAccess() {
        return "Hola, este endpoint es público!";
    }
}