package com.backend_tingeso.demo.service;

import com.backend_tingeso.demo.entity.Kardex;
import com.backend_tingeso.demo.entity.Loans;
import com.backend_tingeso.demo.entity.Tools;
import com.backend_tingeso.demo.entity.Users;

import java.util.List;

public interface KardexService {
    public void createKardex(Tools tool, Users user, Loans loan,  String type, Integer quantity, String comments);
    List<KardexServiceImpl.KardexDTO> getAllKardex();
}
