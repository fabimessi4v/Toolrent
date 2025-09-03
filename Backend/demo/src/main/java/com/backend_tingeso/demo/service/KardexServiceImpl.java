package com.backend_tingeso.demo.service;


import com.backend_tingeso.demo.entity.Kardex;
import com.backend_tingeso.demo.entity.Tools;
import com.backend_tingeso.demo.entity.Users;
import com.backend_tingeso.demo.repository.KardexRepository;
import org.springframework.stereotype.Service;

import java.util.Date;
import java.util.UUID;


@Service
public class KardexServiceImpl implements KardexService {
    private final KardexRepository kardexRepository;


    public KardexServiceImpl(KardexRepository kardexRepository) {
        this.kardexRepository = kardexRepository;
    }
    //Metodo para crear kardex
    @Override
    public void createKardex(Tools tool, Users user, String tipoMovimiento) {
        Kardex kardex = new Kardex();
        kardex.setId(UUID.randomUUID());
        kardex.setTool(tool);
        kardex.setUsers(user);
        kardex.setType(tipoMovimiento);
        kardex.setQuantity(1); // Asumiendo que se registra una unidad
        kardex.setMovementDate(new Date());
        kardex.setLoans(null); // No hay préstamo en este caso

        kardexRepository.save(kardex);
    }
}
