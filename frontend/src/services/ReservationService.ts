import { apiClient } from "./apiClient";
import type {
  CreateReservationDto,
  ReservationDto,
  UpdateReservationDto,
} from "../types/reservation";

/**
 * Defines optional filters for loading reservations.
 * Only the provided filters are sent to the API.
 */
interface ReservationFilterParams {
  // Identify the room associated with the reservations.
  roomId?: number;
  // Identify the user who organizes the reservations.
  organizerId?: number;
  // Filter reservations by their numeric status code.
  status?: number;
  // Set the start of the date range in ISO format (YYYY-MM-DDTHH:mm:ss).
  from?: string;
  // Set the end of the date range in ISO format (YYYY-MM-DDTHH:mm:ss).
  to?: string;
}

/**
 * Provides methods for calling the reservations endpoints of the API.
 */
export const reservationService = {
  // Load all reservations.
  getAll() {
    return apiClient.get<ReservationDto[]>("/api/reservations");
  },

  // Load a single reservation by its ID.
  getById(id: number) {
    return apiClient.get<ReservationDto>(`/api/reservations/${id}`);
  },

  // Create a reservation and return the created record.
  create(dto: CreateReservationDto) {
    return apiClient.post<ReservationDto, CreateReservationDto>(
      "/api/reservations",
      dto,
    );
  },

  // Update an existing reservation.
  update(id: number, dto: UpdateReservationDto) {
    return apiClient.put<void, UpdateReservationDto>(
      `/api/reservations/${id}`,
      dto,
    );
  },

  // Delete a reservation by its ID.
  delete(id: number) {
    return apiClient.delete(`/api/reservations/${id}`);
  },

  // Cancel a booked reservation.
  cancel(id: number) {
    return apiClient.put<void>(`/api/reservations/${id}/cancel`);
  },

  // End an in-progress reservation early.
  endEarly(id: number) {
    return apiClient.put<void>(`/api/reservations/${id}/endEarly`);
  },

  // Load reservations matching the specified filters.
  getFiltered(params: ReservationFilterParams) {
    // Build the query string using only the provided filters.
    const searchParams = new URLSearchParams();

    if (params.roomId !== undefined) {
      searchParams.append("roomId", params.roomId.toString());
    }

    if (params.organizerId !== undefined) {
      searchParams.append("organizerId", params.organizerId.toString());
    }

    if (params.status !== undefined) {
      searchParams.append("status", params.status.toString());
    }

    if (params.from) {
      searchParams.append("from", params.from);
    }

    if (params.to) {
      searchParams.append("to", params.to);
    }

    return apiClient.get<ReservationDto[]>(
      `/api/reservations?${searchParams.toString()}`,
    );
  },
};