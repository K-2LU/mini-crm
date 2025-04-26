# miniCRM

A modern, full-stack CRM (Customer Relationship Management) application built with Next.js, React, TypeScript, Prisma, and Express.js.

## Features
- User authentication (login/signup)
- Dashboard with welcome screen
- Client management (add, edit, delete, view clients)
- Project management
- Interaction logs (with client name resolution)
- Reminders
- Responsive sidebar navigation with dark/light theme toggle
- Accessible and modern UI using Tailwind CSS

## Tech Stack
- **Frontend:** Next.js (App Router), React, TypeScript, Tailwind CSS
- **Backend:** Express.js, Prisma ORM, PostgreSQL
- **Authentication:** JWT-based, stored in localStorage
- **Styling:** Tailwind CSS with dark mode support

## Getting Started

### Prerequisites
- Node.js (v18+ recommended)
- npm or yarn
- PostgreSQL (or your preferred database supported by Prisma)

### 1. Clone the repository
```bash
git clone https://github.com/K-2LU/crm-temp
cd crm-temp
```

### 2. Install dependencies
```bash
cd backend
npm install
cd ../frontend
npm install
```

### 3. Configure environment variables
- Copy `.env.example` to `.env` in both `backend` and `frontend` as needed, and fill in required values (e.g., database URL, backend URL).

### 4. Set up the database
```bash
cd backend
npx prisma migrate dev --name init
```

### 5. Run the backend server
```bash
cd ../backend
npm npx ts-node-dev src/index.ts
```

### 6. Run the frontend app
```bash
cd ../frontend
npm run dev
```

### 7. Open the app
Visit [http://localhost:3000](http://localhost:3000) in your browser.

## Folder Structure
```
crm-temp/
├── backend/      # Express.js API, Prisma models, controllers
├── frontend/     # Next.js app, React components, pages
├── prisma/       # Prisma schema and migrations
├── .gitignore
├── README.md
└── ...
```

## Accessibility
- Dialogs and sheets use accessible primitives (Radix UI)
- Keyboard navigation and screen reader support

## Customization
- Update Tailwind config and theme in `frontend/src/app/globals.css`
- Modify backend logic in `backend/src/controllers`

## License
MIT

---

For any issues or feature requests, please open an issue or pull request.
