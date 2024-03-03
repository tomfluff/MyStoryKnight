# MyStoryKnight

## Description

## Running the application

### Prerequisites
- Docker Desktop

### Steps
1. Clone the repository
2. Inside `backend`, copy `.env.example` to `.env` and fill in the necessary environment variables
3. Run the following command in the root directory of the repository
```bash
docker-compose up
```
1. Open a web browser and navigate to `http://localhost:3000`
2. Access the backend API at `http://localhost:5000/api`

## Structure
```
MyStoryKnight/
├── frontend                # Frontend code (React)
|  ├── Dockerfile           # Dockerfile for frontend
├── backend                 # Backend code (Flask)
|  ├── Dockerfile           # Dockerfile for backend
├── docker-compose.yml      # Docker compose file
└── README.md               # This file
```

## Dockerizing
### Backend
In `app.py`, need to set the host to `0.0.0.0` to allow the container to access the host's network.
```python
if __name__ == '__main__':
    app.run(host='0.0.0.0')
```

### Frontend
In `vite.config.ts` need to set the following settings:
```javascript
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  base: "/",
  plugins: [react()],
  preview: {
    port: 8080,
    strictPort: true,
  },
  server: {
    port: 8080,
    strictPort: true,
    host: true,
    origin: "http://127.0.0.1:8080", // Correctly load assets
  },
});
```
### Firebase (Database)
Local emulator is based on https://github.com/seletskiy/firebase-emulator.

