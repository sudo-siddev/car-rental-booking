import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { BookingState, Vehicle } from '../types';
import { apiService } from '../services/api';
import { logger } from '../utils/logger';
import { ApiError } from '../utils/errorCodes';

const initialState: BookingState = {
  selectedVehicle: null,
  pickupDate: '',
  dropoffDate: '',
  selectedAddons: [],
  vehicles: [],
  addons: [],
  loading: false,
  error: null,
  showConfirmation: false,
};

export const fetchVehicles = createAsyncThunk(
  'booking/fetchVehicles',
  async (_, { rejectWithValue }) => {
    try {
      logger.debug('Fetching vehicles from API');
      const vehicles = await apiService.getVehicles();
      logger.info(`Successfully fetched ${vehicles.length} vehicles`);
      return vehicles;
      } catch (error) {
        const errorKey = error instanceof ApiError
          ? error.errorCode
          : (error as Error).message;
      logger.error('Failed to fetch vehicles', error, {
        action: 'fetchVehicles',
        errorKey,
      });
      return rejectWithValue(errorKey);
    }
  }
);

export const fetchAddons = createAsyncThunk(
  'booking/fetchAddons',
  async (vehicleId: number | undefined, { rejectWithValue }) => {
    try {
      logger.debug(`Fetching addons from API for vehicle ${vehicleId || 'none'}`);
      const addons = await apiService.getAddons(vehicleId);
      logger.info(`Successfully fetched ${addons.length} addons for vehicle ${vehicleId || 'none'}`);
      return addons;
      } catch (error) {
        const errorKey = error instanceof ApiError
          ? error.errorCode
          : (error as Error).message;
      logger.error('Failed to fetch addons', error, {
        action: 'fetchAddons',
        vehicleId,
        errorKey,
      });
      return rejectWithValue(errorKey);
    }
  }
);

const bookingSlice = createSlice({
  name: 'booking',
  initialState,
  reducers: {
    selectVehicle: (state, action: PayloadAction<Vehicle>) => {
      if (state.selectedVehicle && state.selectedVehicle.id !== action.payload.id) {
        state.pickupDate = '';
        state.dropoffDate = '';
      }
      state.selectedVehicle = action.payload;
      state.selectedAddons = [];
      state.addons = [];
    },
    setPickupDate: (state, action: PayloadAction<string>) => {
      state.pickupDate = action.payload;
      if (state.dropoffDate && state.dropoffDate <= action.payload) {
        state.dropoffDate = '';
      }
    },
    setDropoffDate: (state, action: PayloadAction<string>) => {
      state.dropoffDate = action.payload;
    },
    toggleAddon: (state, action: PayloadAction<number>) => {
      const addonId = action.payload;
      const index = state.selectedAddons.indexOf(addonId);
      if (index === -1) {
        state.selectedAddons.push(addonId);
      } else {
        state.selectedAddons.splice(index, 1);
      }
    },
    showConfirmation: (state) => {
      state.showConfirmation = true;
    },
    hideConfirmation: (state) => {
      state.showConfirmation = false;
    },
    resetBooking: (state) => {
      state.selectedVehicle = null;
      state.pickupDate = '';
      state.dropoffDate = '';
      state.selectedAddons = [];
      state.showConfirmation = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchVehicles.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchVehicles.fulfilled, (state, action) => {
        state.loading = false;
        state.vehicles = action.payload;
      })
      .addCase(fetchVehicles.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(fetchAddons.pending, (state) => {
        if (state.error) {
          state.error = null;
        }
      })
      .addCase(fetchAddons.fulfilled, (state, action) => {
        state.addons = action.payload;
      })
      .addCase(fetchAddons.rejected, (state, action) => {
        if (state.vehicles.length > 0) {
          const errorMessage = action.payload as string;
          logger.warn('Failed to fetch addons', { errorMessage });
        }
        state.addons = [];
      });
  },
});

export const {
  selectVehicle,
  setPickupDate,
  setDropoffDate,
  toggleAddon,
  showConfirmation,
  hideConfirmation,
  resetBooking,
} = bookingSlice.actions;

export default bookingSlice.reducer;

