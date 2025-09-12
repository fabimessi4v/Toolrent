package com.backend_tingeso.demo.service;

import com.backend_tingeso.demo.entity.Kardex;
import com.backend_tingeso.demo.entity.Loans;
import com.backend_tingeso.demo.entity.Tools;
import com.backend_tingeso.demo.entity.Users;
import com.backend_tingeso.demo.repository.KardexRepository;
import com.backend_tingeso.demo.repository.UsersRepository;
import org.springframework.stereotype.Service;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import java.util.Date;
import java.util.List;
import java.util.UUID;
import java.time.LocalDate;
import java.util.stream.Collectors;

@Service
public class KardexServiceImpl implements KardexService {
    private static final Logger log = LoggerFactory.getLogger(KardexServiceImpl.class);
    private final KardexRepository kardexRepository;
    private final UsersRepository usersRepository;

    public KardexServiceImpl(KardexRepository kardexRepository, UsersRepository usersRepository) {
        this.kardexRepository = kardexRepository;
        this.usersRepository = usersRepository;
    }

    // DTO interno
    public static class KardexDTO {
        public String id;
        public String toolName;
        public String userName;
        public String type;
        public Integer quantity;
        public LocalDate movementDate;
        public String comments;

        public KardexDTO(String id, String toolName, String userName, String type, Integer quantity, LocalDate movementDate, String comments) {
            this.id = id;
            this.toolName = toolName;
            this.userName = userName;
            this.type = type;
            this.quantity = quantity;
            this.movementDate = movementDate;
            this.comments = comments;
        }
    }

    // Método privado para mapear entidad a DTO
    private KardexDTO toDTO(Kardex kardex) {
        return new KardexDTO(
                kardex.getId(),
                kardex.getTool() != null ? kardex.getTool().getName() : null,
                kardex.getUsers() != null ? kardex.getUsers().getUsername() : null,
                kardex.getType(),
                kardex.getQuantity(),
                kardex.getMovementDate(),
                kardex.getComments()
        );
    }

    // Método para crear kardex
    @Override
    public void createKardex(Tools tool, Users user, Loans loan, String type, Integer quantity, String comments) {
        if (tool == null || user == null || type == null || type.isEmpty() || quantity == null || quantity <= 0) {
            throw new IllegalArgumentException("Tool, User, type y quantity no pueden ser nulos o vacíos, y quantity debe ser mayor que 0");
        }
        // Verificar que el usuario existe en BD y tiene ID
        if (user.getId() == null) {
            log.warn("Usuario sin ID, guardando: {}", user.getUsername());
            user = usersRepository.save(user);
        }
        if (user.getId() == null) {
            throw new IllegalStateException("No se pudo obtener ID del usuario después de guardarlo");
        }
        log.info("Creando kardex para usuario ID: {}, username: {}", user.getId(), user.getUsername());

        Kardex kardex = new Kardex();
        kardex.setId(UUID.randomUUID().toString());
        kardex.setTool(tool);
        kardex.setUsers(user);
        kardex.setLoans(loan);
        kardex.setType(type);
        kardex.setQuantity(quantity);
        kardex.setMovementDate(LocalDate.now());
        kardex.setComments(comments);

        kardexRepository.save(kardex);
    }

    @Override
    public List<KardexDTO> getAllKardex() {
        List<Kardex> kardexList = kardexRepository.findAll();
        log.info("Obtenidos {} registros de Kardex", kardexList.size());
        return kardexList.stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }
}