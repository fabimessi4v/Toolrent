package com.backend_tingeso.demo.service;

import com.backend_tingeso.demo.dto.KardexDTO;
import com.backend_tingeso.demo.entity.Kardex;
import com.backend_tingeso.demo.entity.Loans;
import com.backend_tingeso.demo.entity.Tools;
import com.backend_tingeso.demo.entity.Users;
import com.backend_tingeso.demo.entity.enums.MovementType;

import java.util.List;

public interface KardexService {
    void createKardex(Tools tool, Users user, Loans loan, MovementType type, Integer quantity, String comments);
    List<KardexDTO> getAllKardex();
}
