package com.backend_tingeso.demo.config;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.core.annotation.Order;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.Collections;

@Component
@Order(1)
public class DebugSecurityFilter extends OncePerRequestFilter {

    private static final Logger log = LoggerFactory.getLogger(DebugSecurityFilter.class);

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response,
                                    FilterChain filterChain) throws ServletException, IOException {

        log.info("=== REQUEST DEBUG START ===");
        log.info("Method: {} {}", request.getMethod(), request.getRequestURI());
        log.info("Headers:");
        Collections.list(request.getHeaderNames()).forEach(headerName -> {
            log.info("  {}: {}", headerName, request.getHeader(headerName));
        });

        String authHeader = request.getHeader("Authorization");
        if (authHeader != null) {
            log.info("Authorization header present: {}", authHeader.substring(0, Math.min(50, authHeader.length())) + "...");
        } else {
            log.info("No Authorization header found");
        }

        // Ejecutar el filtro
        filterChain.doFilter(request, response);

        // Verificar el contexto de seguridad después del filtro
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        log.info("=== RESPONSE DEBUG ===");
        log.info("Response Status: {}", response.getStatus());
        log.info("Authentication after filter: {}", auth);
        if (auth != null) {
            log.info("Authentication principal: {}", auth.getPrincipal());
            log.info("Authentication authorities: {}", auth.getAuthorities());
            log.info("Authentication details: {}", auth.getDetails());
        }
        log.info("=== REQUEST DEBUG END ===");
    }
}