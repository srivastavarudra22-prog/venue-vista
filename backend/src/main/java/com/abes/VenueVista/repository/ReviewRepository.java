package com.abes.VenueVista.repository;

import com.abes.VenueVista.entity.Review;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ReviewRepository extends JpaRepository<Review, Long> {
}
