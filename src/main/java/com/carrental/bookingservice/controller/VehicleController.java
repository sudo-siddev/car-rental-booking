package com.carrental.bookingservice.controller;

import com.carrental.bookingservice.model.Vehicle;
import com.carrental.bookingservice.service.VehicleService;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

/**
 * REST controller for vehicle endpoints.
 */
@RestController
@RequestMapping("/api/v1/vehicles")
@RequiredArgsConstructor
public class VehicleController {

    private static final Logger logger = LoggerFactory.getLogger(VehicleController.class);
    private final VehicleService vehicleService;

    /**
     * Get all available vehicle types.
     *
     * @return List of vehicles
     */
    @GetMapping
    public ResponseEntity<List<Vehicle>> getAllVehicles() {
        try {
            logger.debug("Fetching all vehicles");
            List<Vehicle> vehicles = vehicleService.getAllVehicles();
            logger.info("Successfully retrieved {} vehicles", vehicles.size());
            return ResponseEntity.ok(vehicles);
        } catch (Exception ex) {
            logger.error("Error fetching vehicles: {}", ex.getMessage());
            throw ex;
        }
    }
}

