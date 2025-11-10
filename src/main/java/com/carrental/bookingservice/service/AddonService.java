package com.carrental.bookingservice.service;

import com.carrental.bookingservice.model.Addon;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

/**
 * Service for managing addon data.
 * Returns vehicle-specific addons with premium vehicles having more options.
 */
@Service
public class AddonService {

    // Common addons available for all vehicles
    private static final Addon GPS_NAVIGATION = new Addon(1L, "GPS Navigation", 200.0);
    private static final Addon CHILD_SEAT = new Addon(2L, "Child Seat", 150.0);
    private static final Addon INSURANCE = new Addon(5L, "Insurance", 500.0);
    private static final Addon ROADSIDE_ASSISTANCE = new Addon(6L, "Roadside Assistance", 250.0);
    
    // Mid-tier addons (SUV, Van, Luxury)
    private static final Addon WIFI_HOTSPOT = new Addon(3L, "WiFi Hotspot", 300.0);
    
    // Premium addons (Luxury only)
    private static final Addon DRIVER_SERVICE = new Addon(4L, "Driver Service", 1000.0);
    private static final Addon PREMIUM_INSURANCE = new Addon(7L, "Premium Insurance", 800.0);
    private static final Addon CONCIERGE_SERVICE = new Addon(8L, "Concierge Service", 1200.0);
    private static final Addon CHAUFFEUR_SERVICE = new Addon(9L, "Chauffeur Service", 1500.0);
    private static final Addon PREMIUM_SOUND_SYSTEM = new Addon(10L, "Premium Sound System", 400.0);

    /**
     * Returns add-ons available for a specific vehicle.
     * Premium vehicles (Luxury) have access to all addons.
     * 
     * @param vehicleId The ID of the vehicle
     * @return List of available add-ons for the vehicle
     */
    public List<Addon> getAddonsByVehicleId(Long vehicleId) {
        List<Addon> addons = new ArrayList<>();
        
        // All vehicles get basic addons
        addons.add(GPS_NAVIGATION);
        addons.add(CHILD_SEAT);
        addons.add(INSURANCE);
        addons.add(ROADSIDE_ASSISTANCE);
        
        if (vehicleId == null) {
            return addons;
        }
        
        // Vehicle-specific addons based on vehicle ID
        switch (vehicleId.intValue()) {
            case 1: // Sedan - Basic addons only
                break;
                
            case 2: // SUV - Basic + WiFi
            case 4: // Van - Basic + WiFi
                addons.add(WIFI_HOTSPOT);
                break;
                
            case 3: // Luxury - All addons including premium options
                addons.add(WIFI_HOTSPOT);
                addons.add(DRIVER_SERVICE);
                addons.add(PREMIUM_INSURANCE);
                addons.add(CONCIERGE_SERVICE);
                addons.add(CHAUFFEUR_SERVICE);
                addons.add(PREMIUM_SOUND_SYSTEM);
                break;
                
            default:
                // For unknown vehicles, return basic addons
                break;
        }
        
        return addons;
    }

    /**
     * Returns all available add-ons (for backward compatibility).
     * This method returns addons for Luxury vehicles as the complete set.
     *
     * @return List of all available add-ons
     * @deprecated Use getAddonsByVehicleId instead
     */
    @Deprecated
    public List<Addon> getAllAddons() {
        return getAddonsByVehicleId(3L); // Return luxury addons as complete set
    }
}

