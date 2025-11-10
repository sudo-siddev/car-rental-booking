import axios, { AxiosInstance, AxiosError } from 'axios';
import { Vehicle, Addon } from '../types';
import { logger } from '../utils/logger';
import { ApiError, ERROR_CODES } from '../utils/errorCodes';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api/v1';

const CACHE_DURATION = 5 * 60 * 1000;

interface CacheEntry<T> {
  data: T;
  timestamp: number;
}

/**
 * API Service class for handling all API calls with caching, error handling, and interceptors.
 * 
 * PR Review Fix: Throw ApiError with error codes instead of translated strings.
 * Network/API errors use error codes; server errors use plain Error with server message.
 */
class ApiService {
  private client: AxiosInstance;
  private cache: Map<string, CacheEntry<unknown>> = new Map();

  constructor() {
    this.client = axios.create({
      baseURL: API_BASE_URL,
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    this.client.interceptors.request.use(
      (config) => {
        if (!navigator.onLine) {
          const error = new ApiError(ERROR_CODES.OFFLINE);
          logger.warn('API request blocked: offline', { url: config.url, method: config.method });
          return Promise.reject(error);
        }
        logger.debug(`API Request: ${config.method?.toUpperCase()} ${config.url}`);
        return config;
      },
      (error) => {
        logger.error('Request interceptor error', error, {
          type: 'request_interceptor',
        });
        return Promise.reject(error);
      }
    );

    this.client.interceptors.response.use(
      (response) => {
        const cacheKey = `${response.config.method}_${response.config.url}`;
        this.cache.set(cacheKey, {
          data: response.data,
          timestamp: Date.now(),
        });
        logger.debug(`API Response: ${response.config.method?.toUpperCase()} ${response.config.url} - ${response.status}`);
        return response;
      },
      (error: AxiosError) => {
        const method = error.config?.method?.toUpperCase() || 'UNKNOWN';
        const url = error.config?.url || 'UNKNOWN';
        const status = error.response?.status;

        if (error.response) {
          const message = (error.response.data as { message?: string })?.message || 'An error occurred';
          logger.logApiError(method, url, status, new Error(message), error.response.data);
          return Promise.reject(new Error(message));
        } else if (error.request) {
          if (!navigator.onLine) {
            logger.warn('Network request failed: offline', { method, url });
            return Promise.reject(new ApiError(ERROR_CODES.OFFLINE));
          }
          
          if (error.code === 'ECONNABORTED' || error.message?.includes('timeout')) {
            logger.logApiError(method, url, undefined, new Error('Request timeout'), {
              networkError: true,
              timeout: true,
              timeoutMs: 10000,
            });
            return Promise.reject(new ApiError(ERROR_CODES.TIMEOUT));
          }
          
          logger.logApiError(method, url, undefined, new Error('Network error'), {
            networkError: true,
            timeout: false,
          });
          return Promise.reject(new ApiError(ERROR_CODES.NETWORK_ERROR));
        } else {
          logger.logApiError(method, url, undefined, error, {
            configError: true,
          });
          return Promise.reject(new ApiError(ERROR_CODES.UNEXPECTED, error.message));
        }
      }
    );
  }

  private getCached<T>(key: string): T | null {
    const entry = this.cache.get(key) as CacheEntry<T> | undefined;
    if (entry && Date.now() - entry.timestamp < CACHE_DURATION) {
      return entry.data;
    }
    this.cache.delete(key);
    return null;
  }

  /**
   * Fetch all available vehicles from the API.
   * Uses caching to avoid redundant API calls.
   *
   * @returns Promise resolving to an array of vehicles
   * @throws Error if the API call fails or user is offline
   */
  async getVehicles(): Promise<Vehicle[]> {
    const cacheKey = 'GET_/vehicles';
    const cached = this.getCached<Vehicle[]>(cacheKey);
    if (cached) {
      return cached;
    }

    const response = await this.client.get<Vehicle[]>('/vehicles');
    return response.data;
  }

  /**
   * Fetch add-ons available for a specific vehicle from the API.
   * Uses caching to avoid redundant API calls.
   *
   * @param vehicleId Optional vehicle ID to get vehicle-specific addons
   * @returns Promise resolving to an array of add-ons
   * @throws Error if the API call fails or user is offline
   */
  async getAddons(vehicleId?: number): Promise<Addon[]> {
    const cacheKey = vehicleId ? `GET_/addons?vehicleId=${vehicleId}` : 'GET_/addons';
    const cached = this.getCached<Addon[]>(cacheKey);
    if (cached) {
      return cached;
    }

    const url = vehicleId ? `/addons?vehicleId=${vehicleId}` : '/addons';
    const response = await this.client.get<Addon[]>(url);
    return response.data;
  }

  clearCache(): void {
    this.cache.clear();
  }
}

export const apiService = new ApiService();

