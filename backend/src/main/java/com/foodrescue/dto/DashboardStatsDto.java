package com.foodrescue.dto;

public class DashboardStatsDto {

    private long totalDonations;
    private double totalFoodRescuedKg;
    private int totalPeopleServed;
    private long activeDonors;
    private long activeNgos;
    private long activeVolunteers;
    private long completedDonations;
    private long expiredDonations;
    private long availableDonations;
    private long inProgressDonations;
    private long pendingNgoVerifications;

    public DashboardStatsDto() {
    }

    public long getTotalDonations() {
        return totalDonations;
    }

    public void setTotalDonations(long totalDonations) {
        this.totalDonations = totalDonations;
    }

    public double getTotalFoodRescuedKg() {
        return totalFoodRescuedKg;
    }

    public void setTotalFoodRescuedKg(double totalFoodRescuedKg) {
        this.totalFoodRescuedKg = totalFoodRescuedKg;
    }

    public int getTotalPeopleServed() {
        return totalPeopleServed;
    }

    public void setTotalPeopleServed(int totalPeopleServed) {
        this.totalPeopleServed = totalPeopleServed;
    }

    public long getActiveDonors() {
        return activeDonors;
    }

    public void setActiveDonors(long activeDonors) {
        this.activeDonors = activeDonors;
    }

    public long getActiveNgos() {
        return activeNgos;
    }

    public void setActiveNgos(long activeNgos) {
        this.activeNgos = activeNgos;
    }

    public long getActiveVolunteers() {
        return activeVolunteers;
    }

    public void setActiveVolunteers(long activeVolunteers) {
        this.activeVolunteers = activeVolunteers;
    }

    public long getCompletedDonations() {
        return completedDonations;
    }

    public void setCompletedDonations(long completedDonations) {
        this.completedDonations = completedDonations;
    }

    public long getExpiredDonations() {
        return expiredDonations;
    }

    public void setExpiredDonations(long expiredDonations) {
        this.expiredDonations = expiredDonations;
    }

    public long getAvailableDonations() {
        return availableDonations;
    }

    public void setAvailableDonations(long availableDonations) {
        this.availableDonations = availableDonations;
    }

    public long getInProgressDonations() {
        return inProgressDonations;
    }

    public void setInProgressDonations(long inProgressDonations) {
        this.inProgressDonations = inProgressDonations;
    }

    public long getPendingNgoVerifications() {
        return pendingNgoVerifications;
    }

    public void setPendingNgoVerifications(long pendingNgoVerifications) {
        this.pendingNgoVerifications = pendingNgoVerifications;
    }
}
