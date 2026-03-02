package com.backend_tingeso.demo.repository;


import com.backend_tingeso.demo.entity.Loans;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Date;
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



    @Query(value = """
        SELECT COALESCE(SUM(
            (DATEDIFF(
                COALESCE(l.return_date, l.due_date),
                l.delivery_date
            ) * t.rental_price) + l.fine
        ),0)
        FROM loans l
        JOIN tools t ON l.tool_id = t.id
        WHERE 
            COALESCE(l.return_date, l.due_date) >= :startDate
            AND COALESCE(l.return_date, l.due_date) < :endDate
            AND l.status = 'RETURNED'
        """, nativeQuery = true)
    Double calculateMonthlyRevenue(
            @Param("startDate") Date startDate,
            @Param("endDate") Date endDate
    );
}
