**🐞 AI-Powered Bug Tracker**

A lightweight, modern bug tracking system with AI-driven classification, fix suggestions, and a Kanban board interface.
Ideal for small teams, SaaS products, and solo developers who want automated issue management.

---

*🚀 Features*
🤖 AI Intelligence

AI Auto-Classification
Predicts bug category (UI, Backend, Database, Security, Performance)

auto-assigns severity (Low / Medium / High / Critical)

AI Fix Suggestions
AI reads the ticket description, stack trace, or logs → suggests potential fixes.

---

**📌 Bug Management**

Create tickets with title, description, attachments, logs

Update status & assignment

Project-based organization

**🗂️ Kanban Board**

Drag & drop workflow across:

To Do

In Progress

Resolved

Closed

---

**🔐 Roles & Authentication**

Admin

Developer

Tester
Using JWT Auth

---

**🗃️ Tech Stack**
Layer	Tech
Frontend	Next.js + Tailwind CSS
Backend	Express.js + Node.js
Database	MySQL
AI Engine	OpenAI / HuggingFace


**📡 API Overview**
**🔑 Auth**
POST /auth/register       → Register user
POST /auth/login          → Login (JWT)

**🗂️ Projects**
POST /projects            → Create project
GET /projects/:id/tickets → Get tickets for a project

**🎫 Tickets**
POST /tickets             → Create ticket (supports screenshot upload)
PUT /tickets/:id          → Update ticket
GET /tickets/:id/suggestions → AI fix suggestions

---

**🛠️ Setup & Installation**
🧩 Backend Setup
cd backend
npm install
npm run dev

**🎨 Frontend Setup**
cd frontend
npm install
npm run dev

---

**Hosted Url**

Frontend: https://bug-sage-three.vercel.app/

Backend:  https://bug-sage.onrender.com/
