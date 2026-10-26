import { apiClient } from "./apiClient";
import type {
  UserDto,
  CreateUserDto,
  UpdateUserDto,
} from "../types/user";

/**
 * Provides methods for calling the user endpoints of the API.
 */
export const userService = {
  // Load all users.
  getAll() {
    return apiClient.get<UserDto[]>("/api/users");
  },

  // Load a single user by their ID.
  getById(id: number) {
    return apiClient.get<UserDto>(`/api/users/${id}`);
  },

  // Create a user and return the created record.
  create(dto: CreateUserDto) {
    return apiClient.post<UserDto, CreateUserDto>("/api/users", dto);
  },

  // Update an existing user.
  update(id: number, dto: UpdateUserDto) {
    return apiClient.put<void, UpdateUserDto>(`/api/users/${id}`, dto);
  },

  // Delete a user by their ID.
  delete(id: number) {
    return apiClient.delete(`/api/users/${id}`);
  },
};