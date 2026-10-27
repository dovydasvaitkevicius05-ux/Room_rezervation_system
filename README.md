# Room Reservation System

## Description

The Room Reservation System is designed for viewing, booking, and managing meeting rooms. The application enables users to browse available rooms, check room details, select reservation time, specify an organizer and participant count, and manage reservation statuses. The system is intended to simplify room scheduling while ensuring that booking rules are validated on the server side.

## Main Features

- View and filter meeting rooms.
- View a list of users acting as reservation organizers.
- Create, view and cancel reservations.
- Filter reservations by room, organizer, reservation status, and date range.
- Validate business rules for reservations on the server side.
- View room usage statistics and export them to pdf.

## Technologies Used

### Backend

- ASP.NET Core Web API
- EF Core InMemory Database 

### Frontend

- React
- TypeScript
- Vite

## Environment Requirements

Before running the project, ensure the following software is installed:

- .NET SDK compatible with the backend project's target framework.
- Node.js and npm versions compatible with the frontend dependencies.
- A modern web browser.

## Getting Started

### Backend

Open a terminal in the backend project directory containing the `.csproj` file and run:

```bash
dotnet restore
dotnet run
```

If the solution requires a specific project or launch profile, adjust the startup command accordingly.

### Frontend

Open a separate terminal in the frontend project directory and run:

```bash
npm install
npm run dev
```

Before starting the frontend application, make sure the backend API URL is configured correctly. After the development server starts, Vite will provide a local URL that can be opened in a web browser.

## Configuration

Reservation-related constraints and business rules are configured through the backend application's configuration settings. The frontend application should be configured to use the appropriate backend API endpoint corresponding to the selected environment.

## API Documentation

If Swagger/OpenAPI support is enabled, API documentation can be accessed through the Swagger endpoint exposed by the backend application.

## Data Storage

The project uses the EF Core InMemory database provider. Demo data is included and it is loaded automatically during application startup. Since the database exists only in memory, all data is lost when the application is stopped or restarted. This storage mechanism is intended for demonstration purposes rather than production use.

## Authentication

The system does not implement authentication or authorization. User records are used solely as reservation organizer information and are not associated with login accounts.

## Known Limitations

- Data is stored in memory and is not persisted between application restarts.
- The project is intended for demonstration purposes.
