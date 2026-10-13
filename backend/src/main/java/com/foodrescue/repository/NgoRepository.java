package com.foodrescue.repository;

import com.foodrescue.model.Ngo;
import com.foodrescue.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface NgoRepository extends JpaRepository<Ngo, Long> {
    Optional<Ngo> findByUser(User user);
    Optional<Ngo> findByUserId(Long userId);
    List<Ngo> findByVerifiedFalse();
    List<Ngo> findByVerifiedTrue();
    Boolean existsByRegistrationNumber(String registrationNumber);
}
