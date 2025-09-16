package com.backend_tingeso.demo.repository;


import com.backend_tingeso.demo.entity.Loans;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface LoansRepository extends JpaRepository<Loans, String> {

    List<Loans> findByCustomerId(String id);
}
