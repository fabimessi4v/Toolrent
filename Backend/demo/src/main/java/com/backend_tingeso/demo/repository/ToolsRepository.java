package com.backend_tingeso.demo.repository;


import com.backend_tingeso.demo.entity.Customer;
import com.backend_tingeso.demo.entity.Tools;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.UUID;

/**
 * Interfaz extiende JpaRepository, que ya trae implementados todos los métodos básicos de acceso a datos (CRUD).
 * El primer parámetro es la entidad que maneja.
 * El segundo es el tipo de la clave primaria (id) de esa entidad.
 */
@Repository
public interface ToolsRepository extends JpaRepository<Tools, UUID> {

}
