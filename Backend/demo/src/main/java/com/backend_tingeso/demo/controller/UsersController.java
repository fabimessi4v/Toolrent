package com.backend_tingeso.demo.controller;

import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@CrossOrigin(origins = "http://localhost:5173")
@RestController
@RequestMapping("/api/v1/login")
public class UsersController {

    /**
     * Endpoint accesible por cualquier usuario autenticado
     */
    @GetMapping("/me")
    public Map<String, Object> getCurrentUser(@AuthenticationPrincipal Jwt jwt) {
        return Map.of(
                "username", jwt.getClaim("preferred_username"),
                "email", jwt.getClaim("email"),
                "roles", jwt.getClaim("realm_access") // roles dentro de realm_access
        );
    }

    /**
     * Endpoint accesible solo por usuarios con rol USER
     */
    @GetMapping("/user")
    public String userAccess(@AuthenticationPrincipal Jwt jwt) {
        return "Hola " + jwt.getClaim("preferred_username") + ", tienes acceso como USER!";
    }

    /**
     * Endpoint accesible solo por usuarios con rol ADMIN
     */
    @GetMapping("/admin")
    public String adminAccess(@AuthenticationPrincipal Jwt jwt) {
        return "Hola " + jwt.getClaim("preferred_username") + ", tienes acceso como ADMIN!";
    }

    /**
     * Endpoint público, no requiere autenticación
     */
    @GetMapping("/public")
    public String publicAccess() {
        return "Hola, este endpoint es público!";
    }
}