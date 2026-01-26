package com.backend_tingeso.demo.service;

import com.backend_tingeso.demo.dto.KardexDTO;
import com.backend_tingeso.demo.entity.Kardex;
import com.backend_tingeso.demo.entity.Loans;
import com.backend_tingeso.demo.entity.Tools;
import com.backend_tingeso.demo.entity.Users;
import com.backend_tingeso.demo.entity.enums.MovementType;
import com.backend_tingeso.demo.repository.KardexRepository;
import com.backend_tingeso.demo.repository.UsersRepository;
import org.springframework.stereotype.Service;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.time.LocalDate;
import java.util.List;
import java.util.UUID;
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

    // Método privado para mapear entidad a DTO
    private KardexDTO toDTO(Kardex kardex) {
        return new KardexDTO(
                kardex.getId(),
                kardex.getTool() != null ? kardex.getTool().getName() : null,
                kardex.getUser() != null ? kardex.getUser().getUsername() : null,
                kardex.getType() != null ? kardex.getType().name() : null,
                kardex.getQuantity(),
                kardex.getMovementDate(),
                kardex.getComments()
        );
    }

    // Método para crear kardex
    @Override
    public void createKardex(Tools tool, Users user, Loans loan, MovementType type, Integer quantity, String comments) {
        if (tool == null || user == null || type == null || quantity == null || quantity <= 0) {
            throw new IllegalArgumentException("Tool, User, type y quantity no pueden ser nulos, y quantity debe ser mayor que 0");
        }

        // Verificar que el usuario existe en BD y tiene ID
        if (user.getId() == null || user.getId().isEmpty()) {
            log.warn("Usuario sin ID, guardando:  {}", user.getUsername());
            user = usersRepository.save(user);
        }

        if (user.getId() == null) {
            throw new IllegalStateException("No se pudo obtener ID del usuario después de guardarlo");
        }

        log.info("Creando kardex para usuario ID: {}, username: {}", user.getId(), user.getUsername());

        Kardex kardex = new Kardex();
        kardex.setId(UUID.randomUUID().toString());
        kardex.setTool(tool);
        kardex.setUser(user);
        kardex.setLoan(loan);
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