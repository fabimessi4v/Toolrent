package com.backend_tingeso.demo.repository;

import com.backend_tingeso.demo.entity.Users;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface UsersRepository extends JpaRepository<Users, String> {
    Optional<Users> findByUsername(String username);
    Optional<Users> findByKcSub(String kcSub);
}