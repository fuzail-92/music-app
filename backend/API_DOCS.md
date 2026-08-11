# API Documentation

Base URL (local): `http://localhost:3000`
Base URL (live): `https://music-app.bonto.run`

All authenticated routes expect a `token` cookie, which is set automatically by the `/api/auth/login` and `/api/auth/register` endpoints. When testing with Postman, cookies persist automatically within the same session as long as you're using the same environment.

---

## Table of Contents

- [Auth](#auth)
- [Music](#music)
- [Albums](#albums)
- [Likes](#likes)
- [Playlists](#playlists)
- [Error Responses](#error-responses)

---

## Auth

Base path: `/api/auth`

### Register

Creates a new user account and logs them in (sets a `token` cookie).

```
POST /api/auth/register
```

**Body**

```json
{
  "username": "fuzail1",
  "email": "fuzail1@example.com",
  "password": "123456",
  "role": "user"
}
```

`role` is optional — defaults to `"user"`. Set to `"artist"` to enable upload/album-management permissions.

**Success — 201**

```json
{
  "message": "User registered successfully",
  "user": {
    "id": "...",
    "username": "fuzail1",
    "email": "fuzail1@example.com",
    "role": "user"
  }
}
```

**Errors**

- `400` — missing required fields
- `409` — username or email already registered

---

### Login

```
POST /api/auth/login
```

**Body**

```json
{
  "username": "fuzail1",
  "password": "123456"
}
```

`email` can be used instead of `username`.

**Success — 200**

```json
{
  "message": "Login successful",
  "user": {
    "id": "...",
    "username": "fuzail1",
    "email": "fuzail1@example.com",
    "role": "user"
  }
}
```

**Errors**

- `400` — missing credentials
- `401` — invalid credentials

---

### Logout

```
POST /api/auth/logout
```

Clears the `token` cookie.

**Success — 200**

```json
{ "message": "Logged out successfully" }
```

---

## Music

Base path: `/api/music`

### Get All Musics

```
GET /api/music?page=1&limit=3
```

_Requires: logged-in user (any role)_

**Query params**
| Param | Default | Description |
|---|---|---|
| `page` | 1 | Page number |
| `limit` | 3 | Items per page |

**Success — 200**

```json
{
  "message": "Musics fetched successfully",
  "musics": [
    /* array of music objects, artist populated */
  ],
  "pagination": {
    "page": 1,
    "limit": 3,
    "total": 12,
    "pages": 4
  }
}
```

---

### Search Musics

```
GET /api/music/search?q=song-title
```

_Requires: logged-in user (any role)_

Case-insensitive partial match on `title`.

**Errors**

- `400` — missing `q` query param

---

### Upload Music

```
POST /api/music/upload
```

_Requires: `artist` role_

**Body** — `multipart/form-data`
| Field | Type | Notes |
|---|---|---|
| `title` | text | required |
| `music` | file | required — the audio file |

**Success — 201**

```json
{
  "message": "Music uploaded successfully",
  "music": {
    "id": "...",
    "uri": "https://ik.imagekit.io/.../music_...",
    "title": "Test Song",
    "artist": "..."
  }
}
```

**Errors**

- `400` — missing title or file
- `403` — not an artist

---

### Delete Music

```
DELETE /api/music/:id
```

_Requires: `artist` role, and must be the uploader_

**Success — 200**

```json
{ "message": "Music deleted successfully" }
```

**Errors**

- `404` — music not found
- `403` — not the owner

---

## Albums

Base path: `/api/music/album` (and `/api/music/albums` for listing)

### Create Album

```
POST /api/music/album
```

_Requires: `artist` role_

**Body**

```json
{
  "title": "My First Album",
  "musics": ["musicId1", "musicId2"]
}
```

**Success — 201**

```json
{
  "message": "Album created successfully",
  "album": { "id": "...", "title": "...", "musics": [...], "artist": "..." }
}
```

**Errors**

- `400` — missing title, empty/invalid musics array

---

### Get All Albums

```
GET /api/music/albums
```

_Requires: logged-in user (any role)_

Returns basic info only (`title`, `artist`) — tracks are not populated.

---

### Get Album By ID

```
GET /api/music/albums/:albumId
```

_Requires: logged-in user (any role)_

Returns full album detail with populated `musics` array.

**Errors**

- `404` — album not found

---

### Add Music to Album

```
PUT /api/music/album/add-music
```

_Requires: `artist` role, must own the album_

**Body**

```json
{ "albumId": "...", "musicId": "..." }
```

**Errors**

- `404` — album or music not found
- `403` — not the album owner
- `400` — music already in album

---

### Remove Music from Album

```
PUT /api/music/album/remove-music
```

_Requires: `artist` role, must own the album_

**Body**

```json
{ "albumId": "...", "musicId": "..." }
```

**Errors**

- `400` — music not in album

---

### Delete Album

```
DELETE /api/music/album/:id
```

_Requires: `artist` role, must own the album_

**Success — 200**

```json
{ "message": "Album deleted successfully" }
```

---

## Likes

Base path: `/api/music/like` (and `/api/music/likes` for listing)

### Like Music

```
POST /api/music/like
```

_Requires: logged-in user (any role)_

**Body**

```json
{ "musicId": "..." }
```

**Errors**

- `404` — music not found
- `400` — already liked

---

### Unlike Music

```
DELETE /api/music/like
```

_Requires: logged-in user (any role)_

**Body**

```json
{ "musicId": "..." }
```

**Errors**

- `404` — like not found

---

### Get Liked Musics

```
GET /api/music/likes
```

_Requires: logged-in user (any role)_

Returns the full music objects the current user has liked.

---

## Playlists

Base path: `/api/music/playlist` (and `/api/music/playlists` for listing)

### Create Playlist

```
POST /api/music/playlist
```

_Requires: logged-in user (any role)_

**Body**

```json
{ "name": "My Favorites", "isPublic": true }
```

`isPublic` is optional — defaults to `false`.

---

### Add to Playlist

```
POST /api/music/playlist/add
```

_Requires: logged-in user, must own the playlist_

**Body**

```json
{ "playlistId": "...", "musicId": "..." }
```

**Errors**

- `404` — playlist not found / not yours, or music not found
- `400` — music already in playlist

---

### Remove from Playlist

```
POST /api/music/playlist/remove
```

_Requires: logged-in user, must own the playlist_

**Body**

```json
{ "playlistId": "...", "musicId": "..." }
```

---

### Get User Playlists

```
GET /api/music/playlists
```

_Requires: logged-in user (any role)_

Returns all playlists belonging to the current user, with tracks populated.

---

### Delete Playlist

```
DELETE /api/music/playlist/:id
```

_Requires: logged-in user, must own the playlist_

**Success — 200**

```json
{ "message": "Playlist deleted successfully" }
```

---

## Error Responses

All errors follow the same shape:

```json
{ "message": "Human-readable error description" }
```

| Status | Meaning                                                           |
| ------ | ----------------------------------------------------------------- |
| `400`  | Bad request — missing or invalid fields                           |
| `401`  | Unauthorized — no token, or invalid credentials                   |
| `403`  | Forbidden — wrong role, or not the resource owner                 |
| `404`  | Not found                                                         |
| `409`  | Conflict — duplicate resource (e.g. username already exists)      |
| `429`  | Too many requests — rate limit exceeded (100 req / 15 min per IP) |
| `500`  | Server error                                                      |
