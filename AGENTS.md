# AGENTS.md

## Cursor Cloud specific instructions

Real-time private chat app built with Node.js, Express, and Socket.IO.

### Quick reference

| Task | Command |
|------|---------|
| Install deps | `npm install` |
| Dev server (auto-reload) | `npm run dev` |
| Production start | `npm start` |
| Lint | `npm run lint` |
| Tests | `npm test` |

### Architecture

- **`server.js`** — Express + Socket.IO server. Rooms are in-memory (no database). Serves static files from `public/`.
- **`public/`** — Frontend: lobby (`index.html`) and chat room (`chat.html`) with vanilla JS.
- Rooms are created via `POST /api/rooms` and accessed by 6-char hex invite codes.
- Empty rooms are auto-cleaned after 30 minutes of inactivity.

### Caveats

- The dev server (`npm run dev`) uses `node --watch` (Node 22+). Hot-reload watches all `.js` files; CSS/HTML changes are instant on browser refresh.
- Tests in `test/` spawn a child process on port 3000. Make sure port 3000 is free before running `npm test`.
- There is no persistent storage — all rooms and messages are lost on server restart.
