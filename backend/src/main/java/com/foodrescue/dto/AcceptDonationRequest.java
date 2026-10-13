package com.foodrescue.dto;

public class AcceptDonationRequest {

    // "NGO_TRANSPORT" or "VOLUNTEER_REQUEST"
    private String collectionMethod = "VOLUNTEER_REQUEST";

    public AcceptDonationRequest() {
    }

    public AcceptDonationRequest(String collectionMethod) {
        this.collectionMethod = collectionMethod;
    }

    public String getCollectionMethod() {
        return collectionMethod;
    }

    public void setCollectionMethod(String collectionMethod) {
        this.collectionMethod = collectionMethod;
    }
}
