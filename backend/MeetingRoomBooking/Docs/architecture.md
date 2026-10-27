# Architecture

## Overview

The Room Reservation System is a client-server application built using ASP.NET Core Web API and React. The system allows users to manage meeting rooms, organizers, reservations, and room usage statistics.

The architecture follows a layered approach where the frontend communicates with a REST API, and the API uses Entity Framework Core to manage application data stored in an in-memory database.

## High-Level Architecture

```text
+---------------------------+
| React Frontend            |
| TypeScript + Vite         |
+------------+--------------+
             |
             | HTTP / REST
             |
             v
+------------+--------------+
| ASP.NET Core Web API      |
|                           |
| RoomsController           |
| ReservationsController    |
| UsersController           |
| RoomsUsageController      |
+------------+--------------+
             |
             | Entity Framework Core
             |
             v
+------------+--------------+
| EF Core InMemory Database |
+---------------------------+
```

## Backend Components

### Controllers

#### RoomsController

Responsible for:

- Creating rooms
- Updating rooms
- Deleting rooms
- Retrieving rooms
- Filtering rooms by capacity, floor, and equipment

#### ReservationsController

Responsible for:

- Creating reservations
- Updating reservations
- Canceling reservations
- Ending reservations early
- Reservation validation
- Preventing booking conflicts

#### UsersController

Responsible for:

- Creating users
- Updating users
- Deleting users
- Retrieving organizer information

#### RoomsUsageController

Responsible for:

- Room utilization reports
- Most popular rooms statistics
- Most canceled rooms statistics

## Data Layer

### AppDbContext

The application database context contains:

- Rooms
- Reservations
- Users

A one-to-many relationship exists between users and reservations:

```text
User
 └── Reservation(s)
```

Each reservation references:

- One Room
- One Organizer (User)

## Domain Model

### Room

Represents a meeting room.

Properties:

- Id
- Name
- MaxCapacity
- Floor
- Location
- Equipment
- Status

### User

Represents a reservation organizer.

Properties:

- Id
- Name
- Surname

### Reservation

Represents a room reservation.

Properties:

- Id
- RoomId
- OrganizerId
- Title
- PlannedStart
- PlannedEnd
- ParticipantCount
- Status

## Configuration

Reservation restrictions are configurable through application settings.

```json
{
  "BookingSettings": {
    "MaxReservationDurationDays": 7,
    "MaxBookingHorizonDays": 90
  }
}
```

## Data Storage

The application uses Entity Framework Core InMemory provider.

Advantages:

- Simple setup
- No external database required
- Fast development and testing

Limitations:

- Data is lost after application restart
- Not suitable for production environments

## Communication

The frontend communicates with the backend through REST endpoints.

CORS is configured to allow requests from:

```text
http://localhost:5173
```

## Error Handling

The API returns structured error responses:

```json
{
  "status": 409,
  "errorCode": "ROOM_BOOKING_CONFLICT",
  "message": "Room is already booked during the selected time."
}
```

This ensures consistent error handling across the application.

## Architectural Decisions

### Server-side Validation

All reservation validation is performed on the server to ensure data consistency regardless of frontend behavior.

### REST API

The project uses REST principles for communication between frontend and backend.

### DTO Usage

DTO objects are used to isolate API contracts from internal entity models and provide cleaner API responses.