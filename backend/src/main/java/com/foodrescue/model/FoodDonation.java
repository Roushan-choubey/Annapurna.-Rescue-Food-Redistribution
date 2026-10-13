package com.foodrescue.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "food_donations")
public class FoodDonation {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "donor_id", nullable = false)
    private User donor;

    @Column(name = "food_name", nullable = false, length = 200)
    private String foodName;

    @Column(nullable = false)
    private Double quantity; // in kg

    @Column(name = "people_served", nullable = false)
    private Integer peopleServed;

    @Column(name = "preparation_time", nullable = false)
    private LocalDateTime preparationTime;

    @Column(name = "expiry_time", nullable = false)
    private LocalDateTime expiryTime;

    @Enumerated(EnumType.STRING)
    @Column(name = "food_type", nullable = false, length = 20)
    private FoodType foodType;

    @Column(nullable = false, length = 255)
    private String location;

    private Double latitude;

    private Double longitude;

    @Column(name = "image_url", length = 500)
    private String imageUrl;

    @Column(name = "contact_phone", length = 20)
    private String contactPhone;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private DonationStatus status = DonationStatus.AVAILABLE;

    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt = LocalDateTime.now();

    public FoodDonation() {
    }

    public FoodDonation(User donor, String foodName, Double quantity, Integer peopleServed, 
                        LocalDateTime preparationTime, LocalDateTime expiryTime, FoodType foodType, 
                        String location, Double latitude, Double longitude, String imageUrl, 
                        String contactPhone) {
        this.donor = donor;
        this.foodName = foodName;
        this.quantity = quantity;
        this.peopleServed = peopleServed;
        this.preparationTime = preparationTime;
        this.expiryTime = expiryTime;
        this.foodType = foodType;
        this.location = location;
        this.latitude = latitude;
        this.longitude = longitude;
        this.imageUrl = imageUrl;
        this.contactPhone = contactPhone;
        this.status = DonationStatus.AVAILABLE;
        this.createdAt = LocalDateTime.now();
    }

    // Getters and Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public User getDonor() {
        return donor;
    }

    public void setDonor(User donor) {
        this.donor = donor;
    }

    public String getFoodName() {
        return foodName;
    }

    public void setFoodName(String foodName) {
        this.foodName = foodName;
    }

    public Double getQuantity() {
        return quantity;
    }

    public void setQuantity(Double quantity) {
        this.quantity = quantity;
    }

    public Integer getPeopleServed() {
        return peopleServed;
    }

    public void setPeopleServed(Integer peopleServed) {
        this.peopleServed = peopleServed;
    }

    public LocalDateTime getPreparationTime() {
        return preparationTime;
    }

    public void setPreparationTime(LocalDateTime preparationTime) {
        this.preparationTime = preparationTime;
    }

    public LocalDateTime getExpiryTime() {
        return expiryTime;
    }

    public void setExpiryTime(LocalDateTime expiryTime) {
        this.expiryTime = expiryTime;
    }

    public FoodType getFoodType() {
        return foodType;
    }

    public void setFoodType(FoodType foodType) {
        this.foodType = foodType;
    }

    public String getLocation() {
        return location;
    }

    public void setLocation(String location) {
        this.location = location;
    }

    public Double getLatitude() {
        return latitude;
    }

    public void setLatitude(Double latitude) {
        this.latitude = latitude;
    }

    public Double getLongitude() {
        return longitude;
    }

    public void setLongitude(Double longitude) {
        this.longitude = longitude;
    }

    public String getImageUrl() {
        return imageUrl;
    }

    public void setImageUrl(String imageUrl) {
        this.imageUrl = imageUrl;
    }

    public String getContactPhone() {
        return contactPhone;
    }

    public void setContactPhone(String contactPhone) {
        this.contactPhone = contactPhone;
    }

    public DonationStatus getStatus() {
        return status;
    }

    public void setStatus(DonationStatus status) {
        this.status = status;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
}
