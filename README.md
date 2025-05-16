````markdown
# Pointo Task Manager

A full-stack Kanban-style task manager built with React + Vite (client) and Node.js + Express + Mongoose (server), containerized with Docker & Docker Compose and served via Nginx.

---

## 📝 Table of Contents

1. [Features](#-features)
2. [Tech Stack](#-tech-stack)
3. [Prerequisites](#-prerequisites)
4. [Getting Started (Local)](#-getting-started-local)
   - [Clone & Install](#clone--install)
   - [Environment Variables](#environment-variables)
   - [Run with Docker Compose](#run-with-docker-compose)
5. [Development](#-development)
   - [Server](#server)
   - [Client](#client)
6. [Production Build & Deployment](#-production-build--deployment)
7. [Project Structure](#-project-structure)
8. [Best Practices & Notes](#-best-practices--notes)
9. [License](#-license)

---

## 🔥 Features

- **Projects**: Create, edit, delete projects (title + description).
- **Boards (Columns)**: Add, edit, delete columns within projects; drag-and-drop ordering.
- **Tasks**: Add, edit, delete, reorder tasks (title, description, due date).
- **Drag & Drop**: Powered by @hello-pangea/dnd.
- **Toasts**: Feedback on actions via Sonner.
- **API Proxy**: Nginx forwards `/api/v1/*` to the backend.
- **Containerized**: Docker multi-stage builds + Compose.

---

## 🛠 Tech Stack

- **Frontend**: React 18, TypeScript, Vite, Tailwind CSS, shadcn/ui
- **Backend**: Node.js 20, Express, Mongoose, MongoDB Atlas
- **DevOps**: Docker, Docker Compose, Nginx

---

## ✅ Prerequisites

- Docker & Docker Compose installed
- (Optional) MongoDB Atlas cluster or local MongoDB URI

---

## 🚀 Getting Started (Local)

### Clone & Install

```bash
git clone https://github.com/your-username/pointo-task-manager.git
cd pointo-task-manager
```
````

### Environment Variables

Copy the provided examples and fill in your own values (do **not** commit your real secrets):

```bash
cp server/.env.example server/.env
cp client/.env.example client/.env
```

- **`server/.env`**

  ```ini
  PORT=8000
  MONGO_URI=your-mongodb-connection-string-here
  JWT_SECRET=your-jwt-secret-here
  FRONTEND_ORIGIN=http://localhost
  ```

- **`client/.env`**

  ```ini
  VITE_API_BASE_URL=/api/v1
  ```

### Run with Docker Compose

```bash
docker compose up --build -d
```

- Frontend UI → `http://localhost/`
- API → `http://localhost/api/v1/projects`

To view combined logs:

```bash
docker compose logs -f
```

To stop & remove containers:

```bash
docker compose down
```

---

## 💻 Development

You can also run each side independently:

### Server

```bash
cd server
npm install
npm run dev
```

- Runs on `http://localhost:8000`.

### Client

```bash
cd client
npm install --legacy-peer-deps
npm run dev
```

- Runs on `http://localhost:5173`.

---

## ⚙ Production Build & Deployment

1. Build & start containers:

   ```bash
   docker compose up --build -d
   ```

2. Verify:

   - UI at `http://<host>/`
   - API at `http://<host>/api/v1/...`

---

## 📂 Project Structure

```
/
├─ client/             # React + Vite frontend
│  ├─ src/
│  ├─ Dockerfile
│  └─ .env.example
├─ server/             # Express + Mongoose backend
│  ├─ src/
│  ├─ Dockerfile
│  └─ .env.example
├─ docker-compose.yml  # container orchestration
└─ README.md
```

---

## 💡 Best Practices & Notes

- Multi-stage Docker builds for minimal images
- Nginx handles SPA routing + API proxy
- Strict CORS, input validation, and centralized error handling
- Environment vars via `.env.example` and Docker Compose
- CI/CD pipeline recommended via GitHub Actions → ECR → EC2

---

## ⚖ License

MIT © \Kartik Bhardwaj

```

```
