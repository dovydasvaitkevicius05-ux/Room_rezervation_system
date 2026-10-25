import { apiClient } from "./apiClient";
import type {
  ReservationDto,
  CreateReservationDto,
  UpdateReservationDto,
} from "../types/reservation";

export const reservationService = {
  getAll() {
    return apiClient.get<ReservationDto[]>(
      "/api/reservations"
    );
  },

  getById(id: number) {
    return apiClient.get<ReservationDto>(
      `/api/reservations/${id}`
    );
  },

  create(dto: CreateReservationDto) {
    return apiClient.post<
      ReservationDto,
      CreateReservationDto
    >("/api/reservations", dto);
  },

  update(id: number, dto: UpdateReservationDto) {
    return apiClient.put<void, UpdateReservationDto>(
      `/api/reservations/${id}`,
      dto
    );
  },

  delete(id: number) {
    return apiClient.delete(
      `/api/reservations/${id}`
    );
  },

  cancel(id: number) {
    return apiClient.put<void>(
      `/api/reservations/${id}/cancel`
    );
  },

  endEarly(id: number) {
    return apiClient.put<void>(
      `/api/reservations/${id}/endEarly`
    );
  },

  getFiltered(params: {
    roomId?: number;
    organizerId?: number;
    status?: number;
    from?: string;
    to?: string;
  }) {
    const searchParams = new URLSearchParams();

    if (params.roomId !== undefined) {
      searchParams.append(
        "roomId",
        params.roomId.toString()
      );
    }

    if (params.organizerId !== undefined) {
      searchParams.append(
        "organizerId",
        params.organizerId.toString()
      );
    }

    if (params.status !== undefined) {
      searchParams.append(
        "status",
        params.status.toString()
      );
    }

    if (params.from) {
      searchParams.append("from", params.from);
    }

    if (params.to) {
      searchParams.append("to", params.to);
    }

    return apiClient.get<ReservationDto[]>(
      `/api/reservations?${searchParams.toString()}`
    );
  },
};