# Research Outcome Tracker - Project Overview

This document provides a comprehensive summary of the technical stack and features implemented in the Research Outcome Tracker.

## 🚀 Technical Stack

### **Frontend (Client-Side)**
- **HTML5**: Semantic structure for all application pages.
- **Vanilla CSS3**: Custom design system featuring:
  - **Glassmorphism**: Modern, frosted-glass UI effects.
  - **CSS Variables**: Centralized design tokens for colors, spacing, and typography.
  - **Responsive Design**: Mobile-friendly layouts using Flexbox and Grid.
  - **Animations**: Smooth transitions and fade-in effects for enhanced UX.
- **Vanilla JavaScript (ES6+)**:
  - **Fetch API**: For asynchronous communication with the backend.
  - **LocalStorage**: Persistent storage for authentication tokens and user sessions.
  - **DOM Manipulation**: Dynamic rendering of tables, stats, and user data.

### **Backend (Server-Side)**
- **Node.js**: Asynchronous event-driven JavaScript runtime.
- **Express.js**: Web framework for building the RESTful API.
- **Mongoose**: ODM (Object Data Modeling) for MongoDB.
- **JWT (JSON Web Tokens)**: Secure stateless authentication.
- **Bcryptjs**: Industrial-strength password hashing.
- **Dotenv**: Management of environment variables.
- **CORS**: Cross-Origin Resource Sharing for frontend-backend integration.

### **Database**
- **MongoDB**: NoSQL database for flexible and scalable data storage.

---

## ✨ Key Features

### **1. Secure Authentication System**
- **User Registration**: Create accounts with automatic password hashing.
- **User Login**: Secure sign-in yielding a JWT for session management.
- **Auth Guard**: Automatic redirection of unauthenticated users away from protected pages.

### **2. Research Management**
- **Contribution Pipeline**: Users can add new research projects with titles, descriptions, and current status.
- **Status Lifecycle**: Track projects through "Ongoing", "Completed", and "Published" stages.
- **Publishing Tool**: A dedicated workflow to move completed research into the "Public" section.
- **Delete Functionality**: Securely remove own research projects with a confirmation workflow.

### **3. Interactive Dashboard**
- **Data Visualization**: Real-time counters for "Total Projects", "Ongoing", and "Published" research.
- **Personalized Experience**: Dynamic welcome messages and user-specific project lists.

### **4. Advanced Reporting**
- **Research Tables**: Sortable views of all research outcomes.
- **Status Badges**: Color-coded indicators for quick visual status assessment.

### **5. Premium UI/UX**
- **Consistent Design**: A unified "Glass Card" aesthetic across all pages.
- **Sidebar Navigation**: Efficient access to Dashboard, Add Research, and Reports.
- **Error Handling**: Graceful error messaging for network or server-side issues.

