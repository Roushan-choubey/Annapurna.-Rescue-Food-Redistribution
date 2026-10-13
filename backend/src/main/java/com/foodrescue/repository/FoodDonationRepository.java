package com.foodrescue.repository;

import com.foodrescue.model.DonationStatus;
import com.foodrescue.model.FoodDonation;
import com.foodrescue.model.FoodType;
import com.foodrescue.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface FoodDonationRepository extends JpaRepository<FoodDonation, Long> {
    List<FoodDonation> findByDonorOrderByCreatedAtDesc(User donor);

    List<FoodDonation> findByStatusOrderByCreatedAtDesc(DonationStatus status);

    List<FoodDonation> findByStatusAndExpiryTimeBefore(DonationStatus status, LocalDateTime expiryTime);

    long countByStatus(DonationStatus status);

    @Query("SELECT COALESCE(SUM(d.quantity), 0) FROM FoodDonation d WHERE d.status = 'COMPLETED'")
    Double sumCompletedQuantity();

    @Query("SELECT COALESCE(SUM(d.peopleServed), 0) FROM FoodDonation d WHERE d.status = 'COMPLETED'")
    Integer sumCompletedPeopleServed();

    List<FoodDonation> findByCreatedAtBetweenOrderByCreatedAtDesc(LocalDateTime start, LocalDateTime end);

    @Query("SELECT d FROM FoodDonation d WHERE d.status = :status " +
           "AND (:foodType IS NULL OR d.foodType = :foodType) " +
           "AND (:minQuantity IS NULL OR d.quantity >= :minQuantity) " +
           "ORDER BY d.createdAt DESC")
    List<FoodDonation> searchAvailable(
            @Param("status") DonationStatus status,
            @Param("foodType") FoodType foodType,
            @Param("minQuantity") Double minQuantity
    );
}
