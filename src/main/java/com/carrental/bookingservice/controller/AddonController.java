package com.carrental.bookingservice.controller;

import com.carrental.bookingservice.model.Addon;
import com.carrental.bookingservice.service.AddonService;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

/**
 * REST controller for addon endpoints.
 */
@RestController
@RequestMapping("/api/v1/addons")
@RequiredArgsConstructor
public class AddonController {

    private static final Logger logger = LoggerFactory.getLogger(AddonController.class);
    private final AddonService addonService;

    /**
     * Get add-ons available for a specific vehicle.
     * If vehicleId is not provided, returns basic addons.
     *
     * @param vehicleId Optional vehicle ID to get vehicle-specific addons
     * @return List of add-ons for the specified vehicle
     */
    @GetMapping
    public ResponseEntity<List<Addon>> getAddons(@RequestParam(required = false) Long vehicleId) {
        try {
            if (vehicleId != null) {
                logger.debug("Fetching addons for vehicle ID: {}", vehicleId);
                List<Addon> addons = addonService.getAddonsByVehicleId(vehicleId);
                logger.info("Successfully retrieved {} addons for vehicle ID {}", addons.size(), vehicleId);
                return ResponseEntity.ok(addons);
            } else {
                logger.debug("Fetching basic addons (no vehicle ID specified)");
                List<Addon> addons = addonService.getAddonsByVehicleId(null);
                logger.info("Successfully retrieved {} basic addons", addons.size());
                return ResponseEntity.ok(addons);
            }
        } catch (Exception ex) {
            logger.error("Error fetching addons: {}", ex.getMessage());
            throw ex;
        }
    }
}

