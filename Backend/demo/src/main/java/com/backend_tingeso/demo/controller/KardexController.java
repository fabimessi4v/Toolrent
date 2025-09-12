package com.backend_tingeso.demo.controller;

import com.backend_tingeso.demo.service.KardexServiceImpl;
import com.backend_tingeso.demo.service.KardexService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import java.util.List;

@RestController
@RequestMapping("/api/v1/kardex")
public class KardexController {
    private final KardexService kardexService;

    public KardexController(KardexService kardexService) {
        this.kardexService = kardexService;
    }

    @GetMapping
    public List<KardexServiceImpl.KardexDTO> getAllKardex() {
        return kardexService.getAllKardex();
    }
}