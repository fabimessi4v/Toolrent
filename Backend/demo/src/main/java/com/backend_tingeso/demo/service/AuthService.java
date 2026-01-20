package com.backend_tingeso.demo.service;

import com.backend_tingeso.demo.entity.Users;
import com.backend_tingeso.demo.repository.UsersRepository;
import jakarta.transaction.Transactional;
import org.springframework.security.oauth2.jwt.Jwt;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationToken;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

@Service
public class AuthService {

    private static final Logger log = LoggerFactory.getLogger(AuthService.class);

    private final UsersRepository usersRepository;

    @Autowired
    public AuthService(UsersRepository usersRepository) {
        this.usersRepository = usersRepository;
    }

    /**
     * Obtiene el usuario de la base de datos local basado en el token de Keycloak.
     */
    @Transactional
    public Users getCurrentUser() {
        Object principal = SecurityContextHolder.getContext().getAuthentication().getPrincipal();

        if (!(principal instanceof Jwt)) {
            throw new IllegalStateException("No se encontró un Token JWT válido");
        }

        Jwt jwt = (Jwt) principal;
        String kcSub = jwt.getSubject();
        String username = jwt.getClaimAsString("preferred_username");

        // Extraer roles de forma segura
        Map<String, Object> realmAccess = jwt.getClaimAsMap("realm_access");
        List<String> roles = (realmAccess != null) ? (List<String>) realmAccess.get("roles") : new ArrayList<>();
        String kcRole = (roles != null && roles.contains("admin")) ? "ADMIN" : "USER";

        // ESTA ES LA PARTE CLAVE:
        return usersRepository.findByKcSub(kcSub).orElseGet(() -> {
            // Si llegamos aquí, es que NO existía en la BD local.
            // Entonces lo creamos y lo guardamos antes de que falle el resto del programa.
            System.out.println("!!!! SINCRONIZANDO NUEVO USUARIO: " + username);

            Users newUser = new Users();
            newUser.setId(java.util.UUID.randomUUID().toString());
            newUser.setKcSub(kcSub);
            newUser.setUsername(username);
            newUser.setRole(kcRole);

            return usersRepository.save(newUser); // Se guarda en MySQL
        });
    }

}
