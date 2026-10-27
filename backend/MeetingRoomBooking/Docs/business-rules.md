# Business Rules

This document describes the business rules enforced by the Room Reservation System.

## Reservation Creation Rules

### Future Reservations Only

Reservations can only be created for future dates and times.

**Rule**

```text
PlannedStart > CurrentDateTime
```

**Error Code**

```text
INVALID_START_TIME
```

---

### End Time Must Be After Start Time

Reservation end time must be later than the start time.

**Rule**

```text
PlannedEnd > PlannedStart
```

**Error Code**

```text
INVALID_END_TIME
```

---

### Maximum Reservation Duration

Reservation duration cannot exceed the configured maximum number of days.

**Configuration**

```text
MaxReservationDurationDays = 7
```

**Error Code**

```text
MAX_DURATION_EXCEEDED
```

---

### Booking Horizon

Reservations cannot be created too far into the future.

**Configuration**

```text
MaxBookingHorizonDays = 90
```

**Error Code**

```text
BOOKING_HORIZON_EXCEEDED
```

---

### Room Must Exist

The selected room must exist before a reservation can be created.

**Error Code**

```text
ROOM_NOT_FOUND
```

---

### Organizer Must Exist

The selected organizer must exist before a reservation can be created.

**Error Code**

```text
USER_NOT_FOUND
```

---

### Inactive Rooms Cannot Be Reserved

Reservations can only be created for active rooms.

**Error Code**

```text
ROOM_INACTIVE
```

---

### Room Capacity Validation

The number of participants cannot exceed room capacity.

**Error Code**

```text
ROOM_CAPACITY_EXCEEDED
```

---

### Room Booking Conflict

Two active reservations cannot overlap in the same room.

**Error Code**

```text
ROOM_BOOKING_CONFLICT
```

---

### Organizer Booking Conflict

An organizer cannot have overlapping meetings.

**Error Code**

```text
ORGANIZER_BOOKING_CONFLICT
```

---

## Reservation Status Rules

### Cancel Reservation

Only reservations with status:

```text
Booked
```

can be canceled.

**Error Code**

```text
INVALID_STATUS
```

---

### End Reservation Early

A reservation can only be ended early if:

- Status is Booked
- Current time is between PlannedStart and PlannedEnd

**Error Code**

```text
RESERVATION_NOT_IN_PROGRESS
```

---

## Room Management Rules

### Room Deletion Restriction

Rooms that have active reservations cannot be deleted.

**Error Code**

```text
ROOM_HAS_RESERVATIONS
```

---

## User Management Rules

### User Deletion Restriction

Users with active reservations cannot be deleted.

**Error Code**

```text
USER_HAS_RESERVATIONS
```