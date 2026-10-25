import { apiClient } from "./apiClient";
import type {
  RoomDto,
  CreateRoomDto,
  UpdateRoomDto,
} from "../types/room";

export const roomService = {
  getAll() {
    return apiClient.get<RoomDto[]>("/api/Rooms");
  },

  getById(id: number) {
    return apiClient.get<RoomDto>(`/api/Rooms/${id}`);
  },

  create(dto: CreateRoomDto) {
    return apiClient.post<RoomDto, CreateRoomDto>(
      "/api/Rooms",
      dto
    );
  },

  update(id: number, dto: UpdateRoomDto) {
    return apiClient.put<void, UpdateRoomDto>(
      `/api/Rooms/${id}`,
      dto
    );
  },

  delete(id: number) {
    return apiClient.delete(`/api/Rooms/${id}`);
  },

  getFiltered(params: {
    minCapacity?: number;
    floor?: number;
    equipment?: number;
  }) {
    const searchParams = new URLSearchParams();

    if (params.minCapacity !== undefined) {
      searchParams.append(
        "minCapacity",
        params.minCapacity.toString()
      );
    }

    if (params.floor !== undefined) {
      searchParams.append(
        "floor",
        params.floor.toString()
      );
    }

    if (params.equipment !== undefined) {
      searchParams.append(
        "equipment",
        params.equipment.toString()
      );
    }

    return apiClient.get<RoomDto[]>(
      `/api/Rooms?${searchParams.toString()}`
    );
  },
};