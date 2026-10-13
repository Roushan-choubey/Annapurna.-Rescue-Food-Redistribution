package com.foodrescue.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "pickups")
public class Pickup {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "donation_id", nullable = false, unique = true)
    private FoodDonation donation;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "ngo_id", nullable = false)
    private Ngo ngo;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "volunteer_id")
    private User volunteer;

    @Column(name = "pickup_time")
    private LocalDateTime pickupTime;

    @Column(name = "delivery_time")
    private LocalDateTime deliveryTime;

    @Column(name = "people_served_actual")
    private Integer peopleServedActual;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private PickupStatus status = PickupStatus.PENDING;

    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt = LocalDateTime.now();

    public Pickup() {
    }

    public Pickup(FoodDonation donation, Ngo ngo) {
        this.donation = donation;
        this.ngo = ngo;
        this.status = PickupStatus.PENDING;
        this.createdAt = LocalDateTime.now();
    }

    // Getters and Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public FoodDonation getDonation() {
        return donation;
    }

    public void setDonation(FoodDonation donation) {
        this.donation = donation;
    }

    public Ngo getNgo() {
        return ngo;
    }

    public void setNgo(Ngo ngo) {
        this.ngo = ngo;
    }

    public User getVolunteer() {
        return volunteer;
    }

    public void setVolunteer(User volunteer) {
        this.volunteer = volunteer;
    }

    public LocalDateTime getPickupTime() {
        return pickupTime;
    }

    public void setPickupTime(LocalDateTime pickupTime) {
        this.pickupTime = pickupTime;
    }

    public LocalDateTime getDeliveryTime() {
        return deliveryTime;
    }

    public void setDeliveryTime(LocalDateTime deliveryTime) {
        this.deliveryTime = deliveryTime;
    }

    public Integer getPeopleServedActual() {
        return peopleServedActual;
    }

    public void setPeopleServedActual(Integer peopleServedActual) {
        this.peopleServedActual = peopleServedActual;
    }

    public PickupStatus getStatus() {
        return status;
    }

    public void setStatus(PickupStatus status) {
        this.status = status;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
}
