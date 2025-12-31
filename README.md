# Local Stay Booking Platform (Backend-First)

## 🚀 Project Overview
A role-based accommodation booking system designed for the unorganized travel sector (specifically the Konkan/Malvan region). Unlike standard hotel apps, this platform models real-world "request-approval" workflows rather than instant bookings, solving the problem of inventory synchronization in non-digitized stays.

## 🏗️ Technical Architecture
*   **Backend:** FastAPI (Python) - chosen for async performance and auto-documentation.
*   **Database:** PostgreSQL (via Supabase) - ensuring strict relational integrity.
*   **Authentication:** Custom JWT implementation with Role-Based Access Control (RBAC).
*   **ORM:** SQLAlchemy (Async) - for robust database interactions.

## 🔑 Key Features (Implemented)
*   **Role-Based Access:** Distinct scopes for Users, Owners, and Admins.
*   **State-Managed Bookings:** `REQUESTED` -> `ACCEPTED` -> `COMPLETED` workflow.
*   **Supply Management:** Owners manage their own inventory with admin verification steps.
*   **Security:** Password hashing, JWT access/refresh tokens, and dependency injection for auth guards.

## 🛠️ Setup & Installation
(Instructions to be added...)