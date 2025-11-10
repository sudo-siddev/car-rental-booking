import { createSelector } from '@reduxjs/toolkit';
import { RootState } from './store';
import { BookingSummary, Addon } from '../types';

/**
 * Base selector for booking state
 */
export const selectBookingState = (state: RootState) => state.booking;

/**
 * Selector for the currently selected vehicle
 */
export const selectSelectedVehicle = (state: RootState) => state.booking.selectedVehicle;

/**
 * Selector for the currently selected add-on IDs
 */
export const selectSelectedAddons = (state: RootState) => state.booking.selectedAddons;

/**
 * Memoized selector to calculate rental days from pickup and dropoff dates.
 * Returns 0 if dates are invalid or missing.
 */
export const selectRentalDays = createSelector(
  [selectBookingState],
  (booking) => {
    if (!booking.pickupDate || !booking.dropoffDate) return 0;
    const pickup = new Date(booking.pickupDate);
    const dropoff = new Date(booking.dropoffDate);
    const diffTime = Math.abs(dropoff.getTime() - pickup.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays || 0;
  }
);

/**
 * Memoized selector to calculate the complete booking summary including costs.
 * Returns null if booking is incomplete or invalid.
 */
export const selectBookingSummary = createSelector(
  [selectBookingState, selectRentalDays],
  (booking, days): BookingSummary | null => {
    if (!booking.selectedVehicle || !booking.pickupDate || !booking.dropoffDate || days === 0) {
      return null;
    }

    const baseCost = booking.selectedVehicle.costPerDay * days;

    const selectedAddonObjects: Addon[] = booking.addons.filter((addon) =>
      booking.selectedAddons.includes(addon.id)
    );

    const addonsCost = selectedAddonObjects.reduce(
      (sum, addon) => sum + addon.costPerDay * days,
      0
    );

    const subtotal = baseCost + addonsCost;
    const gst = subtotal * 0.18;
    const total = subtotal + gst;

    return {
      vehicle: booking.selectedVehicle,
      days,
      baseCost,
      addonsCost,
      subtotal,
      gst,
      total,
      selectedAddons: selectedAddonObjects,
    };
  }
);

/**
 * Memoized selector to check if the booking is valid and ready for submission.
 * Valid booking requires: vehicle selected, both dates set, and at least 1 rental day.
 */
export const selectIsBookingValid = createSelector(
  [selectBookingState, selectRentalDays],
  (booking, days) => {
    return (
      booking.selectedVehicle !== null &&
      booking.pickupDate !== '' &&
      booking.dropoffDate !== '' &&
      days > 0
    );
  }
);

