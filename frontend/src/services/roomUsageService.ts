import { apiClient } from "./apiClient";
import type { RoomUsageDto } from "../types/roomUsage.ts";

export const roomUsageService = {
  getMostPopularRooms() {
    return apiClient.get<RoomUsageDto[]>(
      "/api/RoomsUsage/most-popular"
    );
  },

  getMostCanceledRooms() {
    return apiClient.get<RoomUsageDto[]>(
      "/api/RoomsUsage/most-canceled"
    );
  },
};