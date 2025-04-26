# Backend API Documentation

This document describes all API endpoints for the backend server, including their methods, routes, authentication requirements, and a brief description of their purpose.

---

## Authentication

### `POST /api/auth/signup`
- **Description:** Register a new user (email & password).
- **Body:** `{ email: string, password: string }`
- **Returns:** JWT token and user info.
- **Auth:** No

### `POST /api/auth/login`
- **Description:** Login an existing user.
- **Body:** `{ email: string, password: string }`
- **Returns:** JWT token and user info.
- **Auth:** No

### `GET /api/auth/me`
- **Description:** Get current user info based on JWT token.
- **Headers:** `Authorization: Bearer <token>`
- **Returns:** User info
- **Auth:** Yes

---

## Clients

_All endpoints require authentication._

### `GET /api/clients`
- **Description:** List all clients for the authenticated user.
- **Returns:** Array of clients.

### `POST /api/clients`
- **Description:** Create a new client.
- **Body:** `{ name, email, phone, company?, notes? }`
- **Returns:** Created client object.

### `GET /api/clients/:id`
- **Description:** Get a single client by ID.
- **Returns:** Client object.

### `PUT /api/clients/:id`
- **Description:** Update a client by ID.
- **Body:** `{ name?, email?, phone?, company?, notes? }`
- **Returns:** Updated client object.

### `DELETE /api/clients/:id`
- **Description:** Delete a client by ID.
- **Returns:** Success message.

---

## Projects

_All endpoints require authentication._

### `GET /api/projects`
- **Description:** List all projects for the authenticated user's clients.
- **Returns:** Array of projects.

### `POST /api/projects`
- **Description:** Create a new project.
- **Body:** `{ clientId, title, budget, deadline, status }`
- **Returns:** Created project object.

### `GET /api/projects/:id`
- **Description:** Get a single project by ID.
- **Returns:** Project object.

### `PUT /api/projects/:id`
- **Description:** Update a project by ID.
- **Body:** `{ title?, budget?, deadline?, status? }`
- **Returns:** Updated project object.

### `DELETE /api/projects/:id`
- **Description:** Delete a project by ID.
- **Returns:** Success message.

---

## Reminders

_All endpoints require authentication._

### `GET /api/reminders`
- **Description:** List all reminders for the authenticated user.
- **Returns:** Array of reminders.

### `POST /api/reminders`
- **Description:** Create a new reminder.
- **Body:** `{ userId, title, dueDate, description, completed?, clientId?, projectId? }`
- **Returns:** Created reminder object.

### `GET /api/reminders/:id`
- **Description:** Get a single reminder by ID.
- **Returns:** Reminder object.

### `PUT /api/reminders/:id`
- **Description:** Update a reminder by ID.
- **Body:** `{ title?, dueDate?, description?, completed?, clientId?, projectId? }`
- **Returns:** Updated reminder object.

### `DELETE /api/reminders/:id`
- **Description:** Delete a reminder by ID.
- **Returns:** Success message.

---

## Logs (Interaction Logs)

_All endpoints require authentication._

### `GET /api/logs`
- **Description:** List all interaction logs for the authenticated user's clients/projects.
- **Returns:** Array of logs.

### `POST /api/logs`
- **Description:** Create a new log.
- **Body:** `{ date, type, notes?, clientId?, projectId? }`
- **Returns:** Created log object.

### `GET /api/logs/:id`
- **Description:** Get a single log by ID.
- **Returns:** Log object.

### `PUT /api/logs/:id`
- **Description:** Update a log by ID.
- **Body:** `{ date?, type?, notes?, clientId?, projectId? }`
- **Returns:** Updated log object.

### `DELETE /api/logs/:id`
- **Description:** Delete a log by ID.
- **Returns:** Success message.

---

## Dashboard

_All endpoints require authentication._

### `GET /api/dashboard`
- **Description:** Get summary statistics and recent activity for the authenticated user.
- **Returns:** Dashboard data (counts, recent logs, etc.)

---

## Notes
- All endpoints (except `/auth/signup` and `/auth/login`) require a valid JWT token in the `Authorization` header.
- All responses are JSON.
- Error responses include a message field.

---

For more details on request/response formats, see the controller source code.
