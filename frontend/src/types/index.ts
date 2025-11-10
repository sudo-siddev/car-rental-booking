export interface Vehicle {
  id: number;
  name: string;
  emoji: string;
  costPerDay: number;
}

export interface Addon {
  id: number;
  name: string;
  costPerDay: number;
}

export interface BookingState {
  selectedVehicle: Vehicle | null;
  pickupDate: string;
  dropoffDate: string;
  selectedAddons: number[];
  vehicles: Vehicle[];
  addons: Addon[];
  loading: boolean;
  error: string | null;
  showConfirmation: boolean;
}

export interface BookingSummary {
  vehicle: Vehicle;
  days: number;
  baseCost: number;
  addonsCost: number;
  subtotal: number;
  gst: number;
  total: number;
  selectedAddons: Addon[];
}

