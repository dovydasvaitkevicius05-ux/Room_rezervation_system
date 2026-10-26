import { apiClient } from "./apiClient";
import type { RoomUsageDto } from "../types/roomUsage.ts";

/**
 * Provides methods for retrieving room usage statistics.
 */
export const roomUsageService = {
  // Load rooms ranked by popularity.
  getMostPopularRooms() {
    return apiClient.get<RoomUsageDto[]>(
      "/api/RoomsUsage/most-popular",
    );
  },

  // Load rooms ranked by cancellation frequency.
  getMostCanceledRooms() {
    return apiClient.get<RoomUsageDto[]>(
      "/api/RoomsUsage/most-canceled",
    );
  },
};