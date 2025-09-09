package com.backend_tingeso.demo.service;


import com.backend_tingeso.demo.entity.Kardex;
import com.backend_tingeso.demo.entity.Loans;
import com.backend_tingeso.demo.entity.Tools;
import com.backend_tingeso.demo.entity.Users;
import com.backend_tingeso.demo.repository.KardexRepository;
import org.springframework.stereotype.Service;
import com.backend_tingeso.demo.repository.UsersRepository;
import java.util.Date;
import java.util.UUID;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

@Service
public class KardexServiceImpl implements KardexService {
    private static final Logger log = LoggerFactory.getLogger(KardexServiceImpl.class);
    private final KardexRepository kardexRepository;
    private final UsersRepository usersRepository;

    public KardexServiceImpl(KardexRepository kardexRepository, com.backend_tingeso.demo.repository.UsersRepository usersRepository) {
        this.kardexRepository = kardexRepository;
        this.usersRepository = usersRepository;
    }
    //Metodo para crear kardex
    @Override
    public void createKardex(Tools tool, Users user, Loans loan, String type, Integer quantity, String comments) {
        if (tool == null || user == null || type == null || type.isEmpty() || quantity == null || quantity <= 0) {
            throw new IllegalArgumentException("Tool, User, type y quantity no pueden ser nulos o vacíos, y quantity debe ser mayor que 0");
        }
        // ✅ Verificar que el usuario existe en BD y tiene ID
        if (user.getId() == null) {
            log.warn("Usuario sin ID, guardando: {}", user.getUsername());
            user = usersRepository.save(user); // ✅ Usar instancia correcta
        }

        // ✅ Verificar que el ID no sea nulo después de guardar
        if (user.getId() == null) {
            throw new IllegalStateException("No se pudo obtener ID del usuario después de guardarlo");
        }

        log.info("Creando kardex para usuario ID: {}, username: {}", user.getId(), user.getUsername());
        Kardex kardex = new Kardex();
        // Si tu ID es String, convierto el UUID a String
        kardex.setId(UUID.randomUUID().toString());
        kardex.setTool(tool);
        kardex.setUsers(user);
        kardex.setLoans(loan); // loan puede ser nulo
        kardex.setType(type);
        kardex.setQuantity(quantity);
        kardex.setMovementDate(new Date());
        kardex.setComments(comments);

        kardexRepository.save(kardex);
    }
}
