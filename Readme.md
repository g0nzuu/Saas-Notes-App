
# SaaS Notes App

A multi-tenant SaaS-style Notes application built with **Node.js**, **Express**, **MongoDB**, **React**, and **TailwindCSS**.  
Supports multiple tenants (companies) with role-based access and subscription plans.

---

## Features

- Multi-tenancy with strict data isolation
- JWT-based authentication
- Role-based authorization:
  - **Admin**: Invite users, upgrade subscription
  - **Member**: Create, view, edit, delete notes
- Subscription plans:
  - **Free**: Limit of 3 notes per tenant
  - **Pro**: Unlimited notes
- CRUD operations for notes
- Modal popup UI for creating/editing notes
- Frontend built with React and TailwindCSS
- Demo accounts seeded for testing

---

## Demo Accounts

| Tenant | Role  | Email               | Password |
|--------|-------|-------------------|----------|
| Acme   | Admin | admin@acme.test    | password |
| Acme   | Member| user@acme.test     | password |
| Globex | Admin | admin@globex.test  | password |
| Globex | Member| user@globex.test   | password |

---

## Getting Started

### Backend Setup

1. Navigate to the backend folder:
   ```bash
   cd backend
   ```
2. Install dependencies:
    ```bash
   cd backend
   ``` 
2. Configure environment variables:
    ```bash
   cp .env.example .env
   ``` 
2. Set:
    ```bash
   MONGODB_URI=mongodb://localhost:27017/saas_notes
   JWT_SECRET=your_secret_key
   PORT=5000
   ``` 
2. Seed the database:
    ```bash
   npm run seed
   ``` 
2. Start the server:
    ```bash
   npm start
   ``` 
   Backend runs on: `http://localhost:5000`
### Frontend Setup

1.  Navigate to the frontend folder:
    ```bash
    `cd frontend` 
    ```
2.  Install dependencies:
    ```bash
    `npm install` 
    ```
3.  Start the React app:
    ```bash
    `npm start` 
    ```
    Frontend runs on: `http://localhost:3000`
    

----------

## Folder Structure
```bash
saas-notes-app/
│
├── backend/          # Node.js + Express + MongoDB
│   ├── models/       # Mongoose schemas (User, Tenant, Note)
│   ├── routes/       # API routes (auth, notes, tenants)
│   ├── middleware/   # Authentication & error handling
│   ├── seed.js       # Seed demo users and notes
│   └── server.js     # Backend entry point
│
├── frontend/         # React + TailwindCSS
│   ├── src/
│   │   ├── components/ # UI components (Navbar, NoteCard, Modal, UpgradeBanner)
│   │   └── App.js      # Main App component
│
└── README.md
```
----------

## API Endpoints

-   `POST /auth/login` → Login
    
-   `GET /auth/me` → Current user info
    
-   `POST /notes` → Create note
    
-   `GET /notes` → List notes
    
-   `GET /notes/:id` → Get note
    
-   `PUT /notes/:id` → Update note
    
-   `DELETE /notes/:id` → Delete note
    
-   `POST /tenants/:slug/upgrade` → Upgrade tenant plan (Admin only)
    
-   `GET /health` → Health check
    

----------

## Notes

-   Free plan tenants are limited to 3 notes.
    
-   Admin can upgrade to Pro for unlimited notes.
    
-   Modal popup UI improves note creation and editing experience.
    
-   Tenant data is strictly isolated.
    

----------


# License
```bash
© 2025 Shruti Singh

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to **use, copy, modify, and study** the Software for **educational, personal, or non-commercial purposes**, subject to the following conditions:

1. **Attribution:** You must give appropriate credit to the original author, provide a link to this repository, and indicate if any changes were made.
2. **Non-Commercial Use:** The Software may not be used for commercial purposes without explicit permission from the author.
3. **No Warranty:** The Software is provided "as is", without warranty of any kind, express or implied. The author is not responsible for any claims, damages, or other liability arising from its use.
4. **Redistribution:** You may redistribute the Software in its original or modified form, provided this license is included and the redistribution is **non-commercial**.

For commercial use, licensing, or contribution inquiries, please contact the author directly.

---

**Author:** Shruti Singh  
**Year:** 2025

```