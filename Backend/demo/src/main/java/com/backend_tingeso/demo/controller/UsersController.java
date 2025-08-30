package com.backend_tingeso.demo.controller;

import com.backend_tingeso.demo.entity.Users;
import com.backend_tingeso.demo.repository.UsersRepository;
import com.backend_tingeso.demo.service.AuthService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.Map;
import java.util.Optional;

@CrossOrigin(origins = "http://localhost:5173")
@RestController
@RequestMapping("/api/v1/login")
public class UsersController {

    private final AuthService authService;
    private final UsersRepository usersRepository;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;

    public UsersController(AuthService authService,
                           UsersRepository usersRepository,
                           PasswordEncoder passwordEncoder,
                           AuthenticationManager authenticationManager) {
        this.authService = authService;
        this.usersRepository = usersRepository;
        this.passwordEncoder = passwordEncoder;
        this.authenticationManager = authenticationManager;
    }

    @PostMapping
    public ResponseEntity<Map<String, String>> login(@RequestBody Users user) {
        try {
            // Buscar usuario en la BD
            Optional<Users> userOpt = usersRepository.findByUsername(user.getUsername());

            if (userOpt.isPresent()) {
                Users userFromDb = userOpt.get();
                String storedPassword = userFromDb.getPassword();

                // Debug
                System.out.println("Usuario encontrado: " + userFromDb.getUsername());
                System.out.println("Contraseña almacenada inicia con: " +
                        (storedPassword.length() > 10 ? storedPassword.substring(0, 10) + "..." : "VACÍA"));
                System.out.println("¿Es BCrypt?: " + storedPassword.startsWith("$2"));

                // Verificar manualmente contraseña
                boolean passwordMatches = passwordEncoder.matches(user.getPassword(), storedPassword);
                System.out.println("¿Contraseña coincide manualmente?: " + passwordMatches);

                if (!passwordMatches) {
                    return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                            .body(Map.of("error", "Credenciales inválidas"));
                }

                // Autenticación Spring Security
                authenticationManager.authenticate(
                        new UsernamePasswordAuthenticationToken(
                                user.getUsername(),
                                user.getPassword()
                        )
                );

                // Generar JWT usando AuthService
                String jwtToken = authService.login(user);

                // Devolver JSON con token
                return ResponseEntity.ok(Map.of("token", jwtToken));

            } else {
                System.out.println("Usuario NO encontrado: " + user.getUsername());
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body(Map.of("error", "Usuario no encontrado"));
            }

        } catch (BadCredentialsException e) {
            System.out.println("Error de credenciales: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("error", "Credenciales inválidas"));
        } catch (Exception e) {
            System.out.println("Error inesperado: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "Error interno"));
        }
    }   }