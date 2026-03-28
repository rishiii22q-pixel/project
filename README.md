# Vendor Management with Quotation & Invoice Generation

A full-stack procurement system with vendor registration, RFQ management, quotation comparison, purchase order generation, invoice automation, and inventory receipt tracking.

## Stack
- Frontend: React + Vite
- Backend: Node.js + Express
- Database: SQLite (via Sequelize)

## Features
- Vendor self-registration and profile management
- Vendor evaluation, performance scoring, blacklist handling
- RFQ creation with specifications, category, and timeline
- Vendor quotation submission and side-by-side comparison
- Purchase order generation, approval workflow, digital signature placeholder
- Invoice generation with GST/TDS calculation and payment status
- Stock receipt tracking and quality control workflow
- Postman collection provided for API testing

## Setup

### Backend
1. `cd server`
2. `npm install`
3. `npm run dev`

### Frontend
1. `cd client`
2. `npm install`
3. `npm run dev`

### Notes
- Backend runs on `http://localhost:4000`
- Frontend runs on `http://localhost:5173`
- API base path: `/api`
- If the SQLite schema changes, delete `server/database.sqlite` and restart the backend to recreate it.

## Authentication
- Register vendor: `POST /api/auth/register`
- Login: `POST /api/auth/login`
- Use returned `token` in `Authorization: Bearer <token>` header for protected endpoints
- Add `.env` file from `.env.example` and set `JWT_SECRET`

## API Testing
- Use `postman_collection.json` in the project root.

## Project structure
- `server/` contains backend API, Sequelize models, and routes
- `client/` contains React UI and Vite app
- `docs/schema.md` contains ER diagram and schema notes
