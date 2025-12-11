# INI8 Labs File Management System

## Project Overview

This project is a full-stack file management system that allows users to upload, view, delete, and download documents.
It features a modern, responsive React frontend with a polished UI and a robust Node.js/Express backend backed by PostgreSQL.

**Key Features:**
*   **File Upload:** Securely upload documents (currently optimized for PDFs) with metadata.
*   **Dashboard:** View all uploaded files in a table with details like size and upload date.
*   **File Management:** Delete files and download them directly from the dashboard.
*   **Tech Stack:** React (Vite), Tailwind CSS, Express.js, PostgreSQL.

## How to Run Locally

### Prerequisites
*   Node.js (v18+ recommended)
*   Supabase account
*   Git

### 1. Clone the Repository
```bash
git clone <https://github.com/manavlade/INI8-Labs.git>
cd INI8-Labs
```

### 2. Backend Setup
Navigate to the backend directory and install dependencies:
```bash
cd Backend
npm install
```

Create a `.env` file in the `Backend` directory with your database connection string:
```env
DATABASE_URL=postgresql://postgres:[password]@db.sxagpsmupccwikrfypyo.supabase.co:5432/postgres
```

Start the backend server:
```bash
npm start
```
The server will run on `http://localhost:8000`.

### 3. Frontend Setup
Open a new terminal, navigate to the frontend directory and install dependencies:
```bash
cd Frontend
npm install
```

Start the development server:
```bash
npm run dev
```
The application will be available at `http://localhost:5173`.

## Example API Calls

You can interact with the API using `curl` or Postman.

### Upload a File
**Endpoint:** `POST /api/v1/files/documents/upload`

```bash
curl -X POST http://localhost:8000/api/v1/files/documents/upload \
  -F "file=@/path/to/your/document.pdf"
```

### Get All Files
**Endpoint:** `GET /api/v1/files/documents`

```bash
curl http://localhost:8000/api/v1/files/documents
```

**Response:**
```json
{
  "message": "Files found",
  "files": [
    {
      "id": 1,
      "filename": "document.pdf",
      "filesize": "1024",
      "created_at": "2024-01-01T00:00:00.000Z"
    }
  ]
}
```

### Download a File
**Endpoint:** `GET /api/v1/files/documents/downloads/:id`

```bash
curl -O -J http://localhost:8000/api/v1/files/documents/downloads/1
```

### Delete a File
**Endpoint:** `DELETE /api/v1/files/documents/delete/:id`

```bash
curl -X DELETE http://localhost:8000/api/v1/files/documents/delete/1
```