package com.backend_tingeso.demo.service;

import com.backend_tingeso.demo.entity.Users;
import com.backend_tingeso.demo.repository.UsersRepository;
import org.junit.jupiter.api.*;
import org.mockito.*;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationToken;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

class AuthServiceTest {

    @Mock
    private UsersRepository userRepository;

    @InjectMocks
    private AuthService authService;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
        authService = new AuthService(userRepository);
    }

    @Test
    void getCurrentUser_returnsExistingUser() {
        // Arrange
        Jwt mockJwt = mock(Jwt.class);
        when(mockJwt.getClaimAsString("preferred_username")).thenReturn("admin");
        when(mockJwt.getSubject()).thenReturn("sub123");

        JwtAuthenticationToken jwtAuth = mock(JwtAuthenticationToken.class);
        when(jwtAuth.getToken()).thenReturn(mockJwt);

        SecurityContextHolder.getContext().setAuthentication(jwtAuth);

        Users existingUser = new Users();
        existingUser.setId("u1");
        existingUser.setUsername("admin");
        when(userRepository.findByUsername("admin")).thenReturn(Optional.of(existingUser));

        // Act
        Users user = authService.getCurrentUser();

        // Assert
        assertEquals("u1", user.getId());
        assertEquals("admin", user.getUsername());
        verify(userRepository, times(1)).findByUsername("admin");
        verify(userRepository, never()).save(any());
    }

    @Test
    void getCurrentUser_createsUserIfNotExist() {
        Jwt mockJwt = mock(Jwt.class);
        when(mockJwt.getClaimAsString("preferred_username")).thenReturn("newuser");
        when(mockJwt.getSubject()).thenReturn("sub456");

        JwtAuthenticationToken jwtAuth = mock(JwtAuthenticationToken.class);
        when(jwtAuth.getToken()).thenReturn(mockJwt);

        SecurityContextHolder.getContext().setAuthentication(jwtAuth);

        when(userRepository.findByUsername("newuser")).thenReturn(Optional.empty());

        Users newUser = new Users();
        newUser.setId("u2");
        newUser.setUsername("newuser");
        newUser.setExternalId("sub456");
        when(userRepository.save(any(Users.class))).thenReturn(newUser);

        Users user = authService.getCurrentUser();

        assertEquals("u2", user.getId());
        assertEquals("newuser", user.getUsername());
        assertEquals("sub456", user.getExternalId());
        verify(userRepository, times(1)).findByUsername("newuser");
        verify(userRepository, times(1)).save(any(Users.class));
    }

    @Test
    void getCurrentUser_throwsIfNoPreferredUsername() {
        Jwt mockJwt = mock(Jwt.class);
        when(mockJwt.getClaimAsString("preferred_username")).thenReturn(null);

        JwtAuthenticationToken jwtAuth = mock(JwtAuthenticationToken.class);
        when(jwtAuth.getToken()).thenReturn(mockJwt);

        SecurityContextHolder.getContext().setAuthentication(jwtAuth);

        assertThrows(UsernameNotFoundException.class, () -> authService.getCurrentUser());
    }

    @Test
    void getCurrentUser_throwsIfAuthenticationTypeInvalid() {
        Authentication mockAuth = mock(Authentication.class); // Not JwtAuthenticationToken
        SecurityContextHolder.getContext().setAuthentication(mockAuth);

        assertThrows(UsernameNotFoundException.class, () -> authService.getCurrentUser());
    }
}