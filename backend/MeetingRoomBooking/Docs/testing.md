# Testing

## Overview

The project includes automated unit and integration-style tests implemented using xUnit and Entity Framework Core InMemory Database Provider.

The tests validate reservation management, room filtering, and room usage reporting.

## Technologies

- xUnit
- Entity Framework Core InMemory Provider
- ASP.NET Core Controllers

## Test Strategy

Each test creates an isolated in-memory database instance to ensure complete independence and repeatability.

A helper utility (`TestHelper`) is used to:

- Create database contexts
- Create rooms
- Create users
- Create reservations
- Generate future test dates

## Reservation Tests

The following reservation behaviors are tested:

| # | Test |
|----|----|
| 1 | Successful reservation creation |
| 2 | Room does not exist |
| 3 | Organizer does not exist |
| 4 | Inactive room cannot be booked |
| 5 | Reservation start date in the past |
| 6 | End date before start date |
| 7 | Room booking conflict |
| 8 | Organizer booking conflict |
| 9 | Successful cancellation |
| 10 | Cancellation of non-existing reservation |
| 11 | Successful early completion |
| 12 | Cannot end reservation that is not in progress |

## Room Tests

Room filtering functionality is tested.

| # | Test |
|----|----|
| 13 | Filter by minimum capacity |
| 14 | Filter by floor |

## Statistics Tests

Room usage statistics are tested.

| # | Test |
|----|----|
| 15 | Rooms ordered by reservation count |

## Covered Business Scenarios

The test suite verifies:

- Reservation validation rules
- Booking conflicts
- Capacity restrictions
- Organizer existence validation
- Room existence validation
- Reservation cancellation
- Reservation completion
- Filtering functionality
- Room popularity statistics

## Test Execution

Run all tests using:

```bash
dotnet test
```

## Current Coverage

The existing test suite contains:

- 15 automated tests
- Positive scenarios
- Negative scenarios
- Validation rule verification
- Reservation lifecycle verification

The tested functionality covers the most critical business rules of the application, particularly reservation creation and conflict prevention.