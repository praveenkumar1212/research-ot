# Research Outcome Tracker - Tech Stack & Features

This document outlines the technologies, libraries, and core features used in the development of the Research Outcome Tracker project.

## 🚀 Technologies Used

### Frontend (User Interface)
* **HTML5**: For the structural layout of the application pages (Login, Register, Dashboard, Add Research, Reports).
* **CSS3**: For custom styling, layout, typography, and visual effects (e.g., "glassmorphism" `glass-card` design, animations, variables in `css/style.css`).
* **Vanilla JavaScript (ES6+)**: For client-side logic, manipulating the DOM, and handling asynchronous HTTP requests (fetch API) to communicate with the backend (`js/script.js`).

### Backend (Server & API)
* **Node.js**: The underlying JavaScript runtime environment executing the server-side code.
* **Express.js**: The web framework used to build RESTful APIs and handle routing (e.g., authentication routes, research logic).
* **MongoDB**: A NoSQL document-based database used for storing users and research data.
* **Mongoose**: An Object Data Modeling (ODM) library for MongoDB and Node.js, providing a strict schema and data modeling based on the application data (`models/` directory).

### Authentication & Security
* **JSON Web Tokens (JWT)**: Used for securely verifying user identity and authorizing API requests (`jsonwebtoken` package).
* **Bcrypt.js**: Used for cryptographically hashing and salting user passwords before storing them in the database (`bcryptjs` package).
* **CORS**: Middleware to allow restricted cross-origin resource sharing from the frontend to the backend API (`cors` package).
* **Dotenv**: Used to load secure environment variables (like the Database URI, JWT Secret) from a `.env` file (`dotenv` package).

## ⚙️ Core Features & Capabilities

1. **User Authentication System**
   * Secure user registration and login functionality.
   * Session state maintained securely via JWT Tokens.

2. **Research Project Management**
   * View all active research projects via the visually-rich Dashboard.
   * Add new research projects capturing multiple dimensions of details.

3. **Status & Progress Tracking**
   * Includes progress status tracking milestones (e.g., Pending, Problem Statement, Literature Review, Methodology, Analysis, Results, Conclusion) and project completion state flow.

4. **Decoupled RESTful API Architecture**
   * A well-structured backend component (`server.js`, `routes/`, `models/`, `middleware/`) allowing seamless and isolated API endpoints.
