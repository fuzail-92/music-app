# 🎵 Music App Backend

A full-featured music streaming backend built with the MERN stack. Supports user authentication with role-based access, music upload to cloud storage, albums, likes, playlists, and production-ready middleware like rate limiting and request logging.

**Live API:** [https://music-app.bonto.run](https://music-app.bonto.run)

---

## Features

- **Authentication** — Register, login, logout with JWT stored in HTTP-only cookies; passwords hashed with bcrypt
- **Role-based access** — Separate permissions for `user` and `artist` roles
- **Music** — Upload (to ImageKit cloud storage), paginated listing, search by title, delete
- **Albums** — Create, list, view details, delete, add/remove tracks
- **Likes** — Like/unlike tracks, view liked tracks
- **Playlists** — Create, add/remove tracks, list your playlists, delete
- **Production-ready** — Environment variable validation on startup, request logging (Morgan), rate limiting (100 req/15min per IP)

---

## Tech Stack

| Layer         | Technology                       |
| ------------- | -------------------------------- |
| Runtime       | Node.js (20.x)                   |
| Framework     | Express 5                        |
| Database      | MongoDB (via Mongoose)           |
| Auth          | JWT + bcrypt + HTTP-only cookies |
| File Storage  | ImageKit                         |
| File Uploads  | Multer (in-memory)               |
| Logging       | Morgan                           |
| Rate Limiting | express-rate-limit               |

---

## Project Structure

```
backend/
├── server.js                    # Entry point
├── package.json
├── .env.example                 # Template for required environment variables
└── src/
    ├── config/
    │   └── validateEnv.js       # Validates required env vars on startup
    ├── db/
    │   └── db.js                # MongoDB connection
    ├── models/
    │   ├── user.model.js
    │   ├── music.model.js
    │   ├── album.model.js
    │   ├── like.model.js
    │   └── playlist.model.js
    ├── controllers/
    │   ├── auth.controller.js
    │   └── music.controller.js
    ├── routes/
    │   ├── auth.routes.js
    │   └── music.routes.js
    ├── middlewares/
    │   └── auth.middleware.js   # authUser / authArtist guards
    └── services/
        └── storage.service.js   # ImageKit upload logic
```

---

## Getting Started (Local Setup)

### Prerequisites

- Node.js 20.x or later
- A MongoDB database (local or [MongoDB Atlas](https://www.mongodb.com/cloud/atlas))
- An [ImageKit](https://imagekit.io/) account (free tier works) for file storage

### Installation

```bash
git clone https://github.com/fuzail-92/music-app.git
cd music-app/backend
npm install
```

### Environment Variables

Copy `.env.example` to `.env` and fill in your own values:

```bash
cp .env.example .env
```

```env
PORT=3000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=a_long_random_secret_string
IMAGEKIT_PRIVATE_KEY=your_imagekit_private_key
```

### Run the Server

```bash
npm start
```

You should see:

```
Environment variables validated
Connecting to MongoDB...
MongoDB connected successfully
Server running on port 3000
```

---

## API Overview

Full endpoint documentation is available in [`API_DOCS.md`](./API_DOCS.md).

Quick reference:

| Module    | Base Path             |
| --------- | --------------------- |
| Auth      | `/api/auth`           |
| Music     | `/api/music`          |
| Albums    | `/api/music/album`    |
| Likes     | `/api/music/like`     |
| Playlists | `/api/music/playlist` |

A ready-to-import Postman collection is available at [`postman/music-app-postman-collection.json`](./postman/music-app-postman-collection.json).

---

## Deployment

This project is deployed on [Bonto](https://bonto.dev), with the database hosted on MongoDB Atlas and file storage on ImageKit. The `backend/` folder is the working directory — Bonto auto-detects it as a Node.js app and installs dependencies with Yarn.

**Node version note:** This project requires Node.js `20.x` (set via the `engines` field in `package.json`) due to a dependency (`mongoose@9.x`) requiring Node 20+.

---

## Author

**Muhammad Fuzail**
Built as part of Full Stack Development with MERN course.
