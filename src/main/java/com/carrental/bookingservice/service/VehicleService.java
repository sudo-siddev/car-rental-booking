package com.carrental.bookingservice.service;

import com.carrental.bookingservice.model.Vehicle;
import org.springframework.stereotype.Service;

import java.util.Arrays;
import java.util.List;

/**
 * Service for managing vehicle data.
 */
@Service
public class VehicleService {

    /**
     * Returns all available vehicle types.
     *
     * @return List of available vehicles
     */
    public List<Vehicle> getAllVehicles() {
        return Arrays.asList(
            new Vehicle(1L, "Sedan", "🚗", 2500.0),
            new Vehicle(2L, "SUV", "🚙", 3500.0),
            new Vehicle(3L, "Luxury", "🏎️", 5000.0),
            new Vehicle(4L, "Van", "🚐", 4000.0)
        );
    }
}

