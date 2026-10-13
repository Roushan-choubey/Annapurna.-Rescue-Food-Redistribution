package com.foodrescue.repository;

import com.foodrescue.model.FoodDonation;
import com.foodrescue.model.Ngo;
import com.foodrescue.model.Pickup;
import com.foodrescue.model.PickupStatus;
import com.foodrescue.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface PickupRepository extends JpaRepository<Pickup, Long> {
    Optional<Pickup> findByDonation(FoodDonation donation);
    Optional<Pickup> findByDonationId(Long donationId);
    List<Pickup> findByNgoOrderByCreatedAtDesc(Ngo ngo);
    List<Pickup> findByVolunteerOrderByCreatedAtDesc(User volunteer);
    List<Pickup> findByVolunteerIsNullAndStatusOrderByCreatedAtDesc(PickupStatus status);
    List<Pickup> findByStatusOrderByCreatedAtDesc(PickupStatus status);
}
