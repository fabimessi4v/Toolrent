package com.backend_tingeso.demo.service;
import com.backend_tingeso.demo.entity.Fee;



public interface FeeService {
    FeeServiceImpl.FeeDto upsert(String type, Integer value);
    FeeServiceImpl.FeeDto getByType(String type);
}