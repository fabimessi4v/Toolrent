package com.backend_tingeso.demo.repository;

import com.backend_tingeso.demo.entity.Fee;
import org.springframework.stereotype.Repository;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;


@Repository
public interface FeeRepository extends JpaRepository<Fee, Long> {
    static Optional<Fee> findByType(String type) {
        return null;
    }
}
