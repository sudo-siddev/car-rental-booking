package com.carrental.bookingservice.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Vehicle model representing a vehicle type available for rental.
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Vehicle {
    private Long id;
    private String name;
    private String emoji;
    private Double costPerDay;
}

