package com.backend_tingeso.demo.service;

import com.backend_tingeso.demo.entity.Kardex;
import com.backend_tingeso.demo.entity.Tools;
import com.backend_tingeso.demo.entity.Users;

public interface KardexService {
    public void createKardex(Tools tool, Users user, String tipoMovimiento);
}
