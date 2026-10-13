package com.foodrescue.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;

public class CompletePickupRequest {

    @NotNull(message = "Actual people served is required")
    @Min(value = 1, message = "Actual people served must be at least 1")
    private Integer peopleServedActual;

    public CompletePickupRequest() {
    }

    public CompletePickupRequest(Integer peopleServedActual) {
        this.peopleServedActual = peopleServedActual;
    }

    public Integer getPeopleServedActual() {
        return peopleServedActual;
    }

    public void setPeopleServedActual(Integer peopleServedActual) {
        this.peopleServedActual = peopleServedActual;
    }
}
