package com.backend_tingeso.demo.service;

import com.backend_tingeso.demo.entity.Users;
import com.backend_tingeso.demo.repository.UsersRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationToken;
import org.springframework.stereotype.Service;
@Service
public class AuthService {
    private static final Logger log = LoggerFactory.getLogger(AuthService.class);
    private final UsersRepository userRepository;

    public AuthService(UsersRepository userRepository) {
        this.userRepository = userRepository;
    }

    public Users getCurrentUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication instanceof JwtAuthenticationToken jwtToken) {
            Jwt jwt = jwtToken.getToken();
            String username = jwt.getClaimAsString("preferred_username");
            String sub = jwt.getSubject();

            if (username == null || username.isBlank()) {
                throw new UsernameNotFoundException("El token no contiene preferred_username");
            }

            log.info("Buscando usuario por preferred_username: {}", username);
            return userRepository.findByUsername(username)
                    .orElseGet(() -> {
                        log.info("Usuario no existe en BD, creando: {}", username);
                        Users newUser = new Users();
                        newUser.setUsername(username);
                        newUser.setExternalId(sub);
                        Users savedUser = userRepository.save(newUser); // ✅ Guardar y retornar
                        log.info("Usuario creado con ID: {}", savedUser.getId());
                        return savedUser;
                    });
        }
        throw new UsernameNotFoundException("Tipo de autenticación no válido");
    }
}