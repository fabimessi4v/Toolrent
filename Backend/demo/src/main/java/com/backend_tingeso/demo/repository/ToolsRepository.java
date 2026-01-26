package com.backend_tingeso.demo.repository;


import com.backend_tingeso.demo.entity.Tools;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * Interfaz extiende JpaRepository, que ya trae implementados todos los métodos básicos de acceso a datos (CRUD).
 * El primer parámetro es la entidad que maneja.
 * El segundo es el tipo de la clave primaria (id) de esa entidad.
 */
@Repository
public interface ToolsRepository extends JpaRepository<Tools, String> {
    @Query(
            value = "SELECT " +
                    "t.id, t.name, t.category, " +
                    "COUNT(l.id) AS totalLoans, " +
                    "SUM(CASE WHEN l.status = 'ACTIVE' THEN 1 ELSE 0 END) AS activeLoans, " +
                    "SUM(t.rental_price * DATEDIFF(l.due_date, l.delivery_date)) AS totalRevenue, " +
                    "SUM(l.fine) AS totalFines " +
                    "FROM tools t " +
                    "LEFT JOIN loans l ON l.tool_id = t.id " +
                    "GROUP BY t.id, t.name, t.category " +
                    "ORDER BY totalLoans DESC",
            nativeQuery = true
    )
    List<Object[]> findToolRankingNative();

    // Añadido: permite chequear si ya existe una herramienta por nombre (usado en ToolsServiceImpl)
    boolean existsByNameIgnoreCase(String name);
}
