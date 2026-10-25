package com.abes.VenueVista.repository;

import com.abes.VenueVista.entity.Payment;
import org.springframework.data.jpa.repository.JpaRepository;

public interface PaymentRepository extends JpaRepository<Payment, Long> {
}
