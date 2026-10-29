package com.abes.VenueVista.repository;

import com.abes.VenueVista.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long> {

    Optional<User> findFirstByEmailOrderByIdAsc(String email);

    Optional<User> findByEmail(String email);

    List<User> findAllByEmail(String email);

    List<User> findAllByEmailOrderByIdAsc(String email);
}
