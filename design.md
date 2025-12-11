# Design Documentation for INI8 Labs File Management System

## 1. Tech Stack Choices

### Q1. What frontend framework did you use and why?
**Framework:** React (Vite)
**Reasoning:**
- **Component-Based:** Facilitates modular development (e.g., `Home`, `Uppload`, `downloadFile`).
- **Ecosystem:** Rich ecosystem with libraries like `@tanstack/react-query` for state management and `tailwindcss` for styling.
- **Performance:** Vite offers fast build times and hot module replacement.

### Q2. What backend framework did you choose and why?
**Framework:** Express.js (Node.js)
**Reasoning:**
- **Simplicity:** Minimalist framework that is easy to set up and extend.
- **Middleware Support:** Excellent support for middleware like `multer` for handling `multipart/form-data` (file uploads) and `cors`.
- **JSON Handling:** Native support for JSON parsing makes API development straightforward.

### Q3. What database did you choose and why?
**Database:** PostgreSQL
**Reasoning:**
- **Reliability:** ACID compliance ensures data integrity for file metadata.
- **Scalability:** robust enough to handle increasing amounts of data.
- **SQL Support:** Powerful querying capabilities for future expansion (e.g., searching, filtering).
- **Client:** Used `postgres` for a modern, fast, and simple SQL client experience.

### Q4. If you were to support 1,000 users, what changes would you consider?
- **Cloud Storage:** Migrate from local disk storage (`uploads/` folder) to a cloud object storage service like AWS S3 or Google Cloud Storage to handle volume and providing better durability.
- **Database Connection Pooling:** Ensure the database client is configured for connection pooling to handle concurrent requests efficiently.
- **Caching:** Implement Redis to cache frequently accessed file metadata (e.g., `/documents` endpoint).
- **Load Balancing:** Run multiple instances of the backend behind a load balancer (e.g., Nginx) to distribute traffic.
- **CDN:** Serve static assets and downloaded files via a CDN to reduce latency.

## 2. Architecture Overview

### Flow Diagram
```mermaid
graph LR
    User[User] -->|Interact| Frontend[React Frontend]
    Frontend -->|HTTP Requests (Axios)| Backend[Express Backend]
    Backend -->|Read/Write Metadata| DB[(PostgreSQL)]
    Backend -->|Save/Serve Files| FS[Local File Storage]
```

- **Frontend:** Handles user interface and API interaction using React Query.
- **Backend:** Manages API routes, business logic, and file handling.
- **Database:** Stores file metadata (filename, path, size, id).
- **File Storage:** Stores the actual file binaries in the local `uploads/` directory.

## 3. API Specification

| Endpoint | Method | Description | Sample Request | Sample Response |
| :--- | :--- | :--- | :--- | :--- |
| `/api/v1/files/documents/upload` | `POST` | Upload a single file. Expects `multipart/form-data`. | `FormData { file: (binary), filename: "doc.pdf" }` | `{ "message": "File uploaded successfully", "file": { ... } }` |
| `/api/v1/files/documents` | `GET` | Retrieve a list of all uploaded files. | `GET /documents` | `{ "message": "Files found", "files": [ ... ] }` |
| `/api/v1/files/documents/:id` | `GET` | Get details of a specific file by ID. | `GET /documents/1` | `{ "message": "File found", "file": { ... } }` |
| `/api/v1/files/documents/delete/:id` | `DELETE` | Delete a file record by ID. | `DELETE /documents/delete/1` | `{ "message": "File deleted", "file": [] }` |
| `/api/v1/files/documents/downloads/:id` | `GET` | Download the actual file binary. | `GET /documents/downloads/1` | **Binary File Stream** (content-type determined by file) |

## 4. Data Flow Description

### Q5. Step-by-step process of file upload and download

**File Upload:**
1.  **User Action:** User selects a file in the frontend modal, user is only allowed to upload PDF files and clicks "Upload".
2.  **Frontend:** `uploadMutation` calls `uploadDocument` API with `FormData`.
3.  **Backend (Middleware):** `multer` intercepts the request, saves the file to the `uploads/` directory with a timestamped filename.
4.  **Backend (Controller):** Extracts file details (original name, saved path, size) and executes an `INSERT` SQL query to the `files` table.
5.  **Response:** Backend returns the created file record. Frontend invalidates `getAllFileData` query to refresh the list.

**File Download:**
1.  **User Action:** User clicks the "Download" button for a specific file.
2.  **Frontend:** Calls `downloadDocumentByID` with the file ID.
3.  **Backend:**
    *   Queries `files` table using the ID to get the file path.
    *   Verifies the file exists.
    *   Uses `res.download(filepath, filename)` to stream the file to the client.
4.  **Frontend:** Receives the blob, creates a temporary object URL, and programmatically clicks a hidden anchor tag to trigger the browser's download behavior.

## 5. Assumptions

### Q6. What assumptions did you make while building this?
-   **Authentication:** The system currently assumes valid users; no login/auth middleware is implemented.
-   **File Storage:** Local disk storage is sufficient for the current scale.
-   **Concurrency:** API traffic is low enough that standard Node.js event loop and Postgres connection defaults are sufficient.
-   **File Types:** While the frontend restricts to PDF for the `Uppload` component validation, the backend `multer` configuration accepts all file types by default.
-   **Data Persistence:** The local `uploads` folder is persistent and not ephemeral (which would be an issue on some serverless platforms).
