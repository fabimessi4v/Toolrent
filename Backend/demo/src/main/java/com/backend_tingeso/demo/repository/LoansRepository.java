package com.backend_tingeso.demo.repository;


import com.backend_tingeso.demo.entity.Loans;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface LoansRepository extends JpaRepository<Loans, String> {

    List<Loans> findByCustomer_Id(String id);
    @Query("SELECT COUNT(l) FROM Loans l WHERE l.customer.id = :customerId AND l.status = 'ACTIVE'")
    int countActiveLoansByCustomerId(@Param("customerId") String customerId);
    // valida si el cliente ya tiene esa herramienta activa
    @Query("""
SELECT COUNT(l) > 0
FROM Loans l
WHERE l.customer.id = :customerId
AND l.tool.id = :toolId
AND l.status = 'ACTIVE'
""") boolean existsActiveLoanForTool(String customerId, String toolId);
}
