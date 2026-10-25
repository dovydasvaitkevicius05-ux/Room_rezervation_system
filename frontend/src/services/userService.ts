import { apiClient } from "./apiClient";
import type {
  UserDto,
  CreateUserDto,
  UpdateUserDto,
} from "../types/user";

export const userService = {
  getAll() {
    return apiClient.get<UserDto[]>("/api/users");
  },

  getById(id: number) {
    return apiClient.get<UserDto>(
      `/api/users/${id}`
    );
  },

  create(dto: CreateUserDto) {
    return apiClient.post<UserDto, CreateUserDto>(
      "/api/users",
      dto
    );
  },

  update(id: number, dto: UpdateUserDto) {
    return apiClient.put<void, UpdateUserDto>(
      `/api/users/${id}`,
      dto
    );
  },

  delete(id: number) {
    return apiClient.delete(
      `/api/users/${id}`
    );
  },
};