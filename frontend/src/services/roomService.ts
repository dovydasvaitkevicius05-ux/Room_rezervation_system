import { apiClient } from "./apiClient";
import type {
  RoomDto,
  CreateRoomDto,
  UpdateRoomDto,
} from "../types/room";

/**
 * Provides methods for calling the room endpoints of the API.
 */
export const roomService = {
  // Load all rooms.
  getAll() {
    return apiClient.get<RoomDto[]>("/api/Rooms");
  },

  // Load a single room by its ID.
  getById(id: number) {
    return apiClient.get<RoomDto>(`/api/Rooms/${id}`);
  },

  // Create a room and return the created record.
  create(dto: CreateRoomDto) {
    return apiClient.post<RoomDto, CreateRoomDto>("/api/Rooms", dto);
  },

  // Update an existing room.
  update(id: number, dto: UpdateRoomDto) {
    return apiClient.put<void, UpdateRoomDto>(`/api/Rooms/${id}`, dto);
  },

  // Delete a room by its ID.
  delete(id: number) {
    return apiClient.delete(`/api/Rooms/${id}`);
  },

  /**
   * Load rooms matching the specified filters.
   * Only the provided filters are sent to the API.
   */
  getFiltered(params: {
    // Set the minimum room capacity.
    minCapacity?: number;
    // Filter rooms by floor.
    floor?: number;
    // Filter rooms by equipment type.
    equipment?: number;
  }) {
    // Build the query string using only the provided filters.
    const searchParams = new URLSearchParams();

    if (params.minCapacity !== undefined) {
      searchParams.append("minCapacity", params.minCapacity.toString());
    }

    if (params.floor !== undefined) {
      searchParams.append("floor", params.floor.toString());
    }

    if (params.equipment !== undefined) {
      searchParams.append("equipment", params.equipment.toString());
    }

    return apiClient.get<RoomDto[]>(
      `/api/Rooms?${searchParams.toString()}`,
    );
  },
};