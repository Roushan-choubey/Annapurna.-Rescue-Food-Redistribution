package com.foodrescue.dto;

import com.foodrescue.model.FoodType;
import jakarta.validation.constraints.*;
import java.time.LocalDateTime;

public class DonationRequest {

    @NotBlank(message = "Food name/items are required")
    private String foodName;

    @NotNull(message = "Quantity in kg is required")
    @Positive(message = "Quantity must be greater than zero")
    private Double quantity;

    @NotNull(message = "Estimated people served is required")
    @Min(value = 1, message = "Must serve at least 1 person")
    private Integer peopleServed;

    @NotNull(message = "Preparation time is required")
    private LocalDateTime preparationTime;

    @NotNull(message = "Expiry / Best-before time is required")
    @Future(message = "Expiry time must be in the future")
    private LocalDateTime expiryTime;

    @NotNull(message = "Food type (VEG/NON_VEG) is required")
    private FoodType foodType;

    @NotBlank(message = "Pickup location is required")
    private String location;

    private Double latitude;

    private Double longitude;

    private String imageUrl;

    @NotBlank(message = "Contact phone is required")
    private String contactPhone;

    public DonationRequest() {
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
}
