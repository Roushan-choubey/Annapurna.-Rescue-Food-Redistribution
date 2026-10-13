package com.foodrescue.dto;

import com.foodrescue.model.PickupStatus;
import java.time.LocalDateTime;

public class PickupResponse {

    private Long id;
    private DonationResponse donation;

    private Long ngoId;
    private String ngoName;
    private String ngoPhone;
    private String ngoAddress;

    private Long volunteerId;
    private String volunteerName;
    private String volunteerPhone;

    private LocalDateTime pickupTime;
    private LocalDateTime deliveryTime;
    private Integer peopleServedActual;
    private PickupStatus status;
    private LocalDateTime createdAt;

    private String pickupNavigationUrl;
    private String dropNavigationUrl;

    public PickupResponse() {
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public DonationResponse getDonation() {
        return donation;
    }

    public void setDonation(DonationResponse donation) {
        this.donation = donation;
    }

    public Long getNgoId() {
        return ngoId;
    }

    public void setNgoId(Long ngoId) {
        this.ngoId = ngoId;
    }

    public String getNgoName() {
        return ngoName;
    }

    public void setNgoName(String ngoName) {
        this.ngoName = ngoName;
    }

    public String getNgoPhone() {
        return ngoPhone;
    }

    public void setNgoPhone(String ngoPhone) {
        this.ngoPhone = ngoPhone;
    }

    public String getNgoAddress() {
        return ngoAddress;
    }

    public void setNgoAddress(String ngoAddress) {
        this.ngoAddress = ngoAddress;
    }

    public Long getVolunteerId() {
        return volunteerId;
    }

    public void setVolunteerId(Long volunteerId) {
        this.volunteerId = volunteerId;
    }

    public String getVolunteerName() {
        return volunteerName;
    }

    public void setVolunteerName(String volunteerName) {
        this.volunteerName = volunteerName;
    }

    public String getVolunteerPhone() {
        return volunteerPhone;
    }

    public void setVolunteerPhone(String volunteerPhone) {
        this.volunteerPhone = volunteerPhone;
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

    public String getPickupNavigationUrl() {
        return pickupNavigationUrl;
    }

    public void setPickupNavigationUrl(String pickupNavigationUrl) {
        this.pickupNavigationUrl = pickupNavigationUrl;
    }

    public String getDropNavigationUrl() {
        return dropNavigationUrl;
    }

    public void setDropNavigationUrl(String dropNavigationUrl) {
        this.dropNavigationUrl = dropNavigationUrl;
    }
}
