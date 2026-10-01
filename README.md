# Booking System Frontend

Angular frontend for the Booking System application.

The frontend communicates with a Spring Boot REST API and provides
separate workflows for regular users and administrators.

## Current Features

### Authentication

- Login
- Logout
- JWT-based authentication
- USER and ADMIN roles
- Protected admin routes

### User Dashboard

- View personal bookings
- Create bookings
- View booking details
- Cancel bookings
- Reschedule bookings
- Display booking status

### Admin Dashboard

- User overview
- Booking management
- Service management
- My Bookings
- Accordion-based sections
- Section navigation
- Dynamic Users, Bookings and Services counters

### Booking Management

Administrators can:

- View all bookings
- View customer information
- View services
- Confirm pending bookings
- Cancel pending bookings

### Service Management

Administrators can:

- Create services
- Set service description
- Set service duration
- Activate services
- Deactivate services

## Technology Stack

- Angular 22
- TypeScript
- HTML
- CSS
- Angular Router
- RxJS

## Backend

The frontend communicates with a separate Spring Boot backend
through a REST API.

The backend is responsible for authentication, authorization,
business logic and persistence.

## Current Project Status

The main frontend workflows are implemented and functional.

The Admin Dashboard currently includes Users, Bookings, Services
and My Bookings sections, dynamic counters and custom
instrument-style dashboard gauges.

Further development will focus on TypeScript, CSS, HTML and Angular
as part of the practical learning process.
