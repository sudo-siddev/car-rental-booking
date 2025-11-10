package com.carrental.bookingservice.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Addon model representing additional services available for rental.
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Addon {
    private Long id;
    private String name;
    private Double costPerDay;
}

