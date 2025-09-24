package com.backend_tingeso.demo.repository;


import com.backend_tingeso.demo.entity.Loans;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface LoansRepository extends JpaRepository<Loans, String> {

    List<Loans> findByCustomerId(String id);
    @Query("SELECT COUNT(l) FROM Loans l WHERE l.customer.id = :customerId AND l.status = 'ACTIVE'")
    int countActiveLoansByCustomerId(@Param("customerId") String customerId);
}
