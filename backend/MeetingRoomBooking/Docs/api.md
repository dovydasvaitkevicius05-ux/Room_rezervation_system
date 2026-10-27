# API Documentation

## Base URL

```text
https://localhost:{port}/api
```

---

# Rooms

## Get All Rooms

```http
GET /api/rooms
```

Optional query parameters:

| Parameter | Description |
|------------|------------|
| minCapacity | Minimum room capacity |
| floor | Room floor |
| equipment | Required equipment |

---

## Get Room

```http
GET /api/rooms/{id}
```

---

## Create Room

```http
POST /api/rooms
```

---

## Update Room

```http
PUT /api/rooms/{id}
```

---

## Delete Room

```http
DELETE /api/rooms/{id}
```

---

# Reservations

## Get Reservations

```http
GET /api/reservations
```

Optional filters:

| Parameter | Description |
|------------|------------|
| roomId | Room identifier |
| organizerId | Organizer identifier |
| status | Reservation status |
| from | Start date |
| to | End date |

---

## Get Reservation

```http
GET /api/reservations/{id}
```

---

## Create Reservation

```http
POST /api/reservations
```

Example request:

```json
{
  "roomId": 1,
  "organizerId": 1,
  "title": "Sprint Planning",
  "plannedStart": "2025-01-15T10:00:00",
  "plannedEnd": "2025-01-15T11:00:00",
  "participantCount": 8
}
```

---

## Update Reservation

```http
PUT /api/reservations/{id}
```

---

## Cancel Reservation

```http
PUT /api/reservations/{id}/cancel
```

---

## End Reservation Early

```http
PUT /api/reservations/{id}/endEarly
```

---

## Delete Reservation

```http
DELETE /api/reservations/{id}
```

---

# Users

## Get Users

```http
GET /api/users
```

---

## Get User

```http
GET /api/users/{id}
```

---

## Create User

```http
POST /api/users
```

---

## Update User

```http
PUT /api/users/{id}
```

---

## Delete User

```http
DELETE /api/users/{id}
```

---

# Room Usage Statistics

## Most Popular Rooms

```http
GET /api/roomsusage/most-popular
```

Returns rooms ordered by reservation count.

---

## Most Canceled Rooms

```http
GET /api/roomsusage/most-canceled
```

Returns rooms ordered by cancellation count.

---

# Error Response Format

```json
{
  "status": 409,
  "errorCode": "ROOM_BOOKING_CONFLICT",
  "message": "Room is already booked during the selected time."
}
```