# Senior Engineer Portfolio

A highly responsive, dynamic, and state-of-the-art portfolio web application. This project is built to represent an advanced engineering portfolio with interactive elements and admin capabilities for easy data management.

[![LinkedIn](https://img.shields.io/badge/LinkedIn-Profile-blue?style=for-the-badge&logo=linkedin)](https://www.linkedin.com/in/indrajeetsingh94/)

## 🏗 App Architecture & Why It Was Used

The architecture follows a modern **Feature-First** approach, creating self-contained modules that enhance maintainability and scalability.

**Why this Architecture?**

- **Separation of Concerns:** Distinct separation between presentation, state, and API integration.
- **Scalability:** Easy to introduce new features without polluting a global folder structure.
- **Performance:** Leveraging Vite for extremely fast HMR during development and optimized build bundles.
- **Security:** Use of device-secure storage mechanisms (e.g. encrypted local storage) for sensitive token management, and separation of environment secrets from the codebase.

## 🚀 Frontend Stack

- **React + TypeScript:** The core engine ensuring strong typing, fewer runtime bugs, and a highly component-based UI.
- **Vite:** Next-generation build tool chosen for exceptional developer experience and speed.
- **Tailwind CSS & Shadcn UI:** For styling. Chosen for a robust design system with highly customizable, accessible Radix-based components.
- **State Management:**
  - **Redux Toolkit:** Managing the global UI state smoothly.
  - **React Query (@tanstack/react-query):** Used to interface with the backend, handle caching, loading states, and background syncing natively.

## 🗄 Database & API Structure

The frontend interacts with a RESTful backend service. Below is a comprehensive structure of the endpoints expected by this frontend, detailing the payloads and responses.

### 🔐 Authentication

#### POST `/users/login`

- **Description:** Authenticates an admin user.
- **Request Body:**
  ```json
  {
    "email": "admin@example.com",
    "password": "securepassword"
  }
  ```
- **Response:**
  ```json
  {
    "success": true,
    "token": "eyJhbGciOiJIUzI1...",
    "user": {
      "id": "123",
      "email": "admin@example.com"
    }
  }
  ```

#### POST `/users/logout`

- **Description:** Logs out the admin user and invalidates the session on the backend.
- **Headers:** `Authorization: Bearer <token>`
- **Response:** `{ "success": true, "message": "Logged out successfully" }`

---

### 🎨 Portfolio Content

#### GET `/info`

- **Description:** Retrieves the global portfolio layout info and metadata.
- **Response:**
  ```json
  {
    "greeting": "Hello World,",
    "greetingSign": "I'm",
    "name": "Indrajeet Singh",
    "designation": "Senior Software Engineer",
    "resume": "https://url.to/resume.pdf",
    "image": "https://url.to/profile.jpg"
  }
  ```

#### GET `/about`

- **Description:** Retrieves the "About Me" and "Experience Timeline" data.
- **Response:**
  ```json
  {
    "bio": "I am a passionate software engineer...",
    "timeline": [
      {
        "year": "2023",
        "title": "Senior Engineer",
        "description": "Led the frontend team..."
      }
    ]
  }
  ```

#### GET `/projects`

- **Description:** Fetches all portfolio projects.
- **Response:** Array of Project objects.
  ```json
  [
    {
      "id": "proj_1",
      "title": "E-Commerce App",
      "description": "A high-performance modern store.",
      "technologies": ["React", "Node.js"],
      "githubUrl": "https://github.com/...",
      "liveUrl": "https://...",
      "thumbnail": "https://..."
    }
  ]
  ```

#### GET `/techs`

- **Description:** Fetches all skills and technologies.
- **Response:** Array of Technology objects.
  ```json
  [
    {
      "id": "tech_1",
      "name": "React",
      "category": "Frontend",
      "icon": "react-icon-url"
    }
  ]
  ```

#### GET `/blogs`

- **Description:** Retrieves all published blog articles.
- **Response:** Array of Blog objects.
  ```json
  [
    {
      "id": "blog_1",
      "title": "Understanding React Architecture",
      "content": "...",
      "tags": ["React", "Architecture"],
      "thumbnail": "https://...",
      "createdAt": "2024-01-01T10:00:00Z"
    }
  ]
  ```

---

### 📬 Contact & Enquiries

#### POST `/contact`

- **Description:** Submits a message from the public contact form.
- **Request Body:**
  ```json
  {
    "name": "John Doe",
    "email": "john@example.com",
    "message": "I would like to work with you!"
  }
  ```
- **Response:** `{ "success": true, "message": "Enquiry submitted successfully" }`

#### GET `/contact` (Admin)

- **Description:** Retrieves all submitted contact form messages.
- **Headers:** `Authorization: Bearer <token>`
- **Response:** Array of Enquiry objects.

## 🔒 Security & Admin Gateways

To protect administrative screens from malicious brute-force scans and unwanted traffic, this portfolio utilizes a **Dynamic Gateway** and hidden access points:

*   **Dynamic Custom Admin URL (`VITE_ADMIN_PATH`)**: Decouples the administrative dashboard from predictable paths (like `/admin`). Setting `VITE_ADMIN_PATH=/my-secret-portal` changes the entry-point to `/my-secret-portal/login`.
*   **The Secret Keyboard Shortcut**: Pressing **`Cmd + Shift + L`** (macOS) or **`Ctrl + Shift + L`** (Windows/Linux) globally on any page instantly opens the custom Admin login portal.
*   **The Footer Triple-Click Shortcut**: Clicking the copyright symbol (`©`) in the website footer **three times** in quick succession activates the secret admin gateway.
*   **Secure Client Storage**: Session tokens (`auth_token`) are encrypted with AES (`crypto-js`) inside the browser’s local storage using `VITE_STORAGE_SECRET` to prevent simple XSS-based scraping or local inspection.

---

## ⚡ Netlify Production Deployment

This application is fully optimized and **100% production-ready** for Netlify hosting.

### 1. Direct SPA Routing (`_redirects`)
Because this is a Single Page Application using clean HTML5 dynamic routing (`wouter`), a `_redirects` file is pre-configured in `/public` to rewrite all paths back to the index shell, ensuring that custom 404 pages and deep-nested admin routes function correctly when loaded directly:
```text
/* /index.html 200
```

### 2. Netlify Build & Site Configuration
When creating your Netlify site, set the following configuration:
*   **Repository**: Connect your GitHub repository.
*   **Build Command**: `npm run build`
*   **Publish Directory**: `dist`

### 3. Required Environment Variables (Netlify Dashboard)
Configure the following environment variables in your **Netlify Site Configuration > Environment Variables**:

| Variable Name | Example Value | Description |
| :--- | :--- | :--- |
| `VITE_API_URL` | `https://api.yourdomain.com` | Base URL of your backend REST API. |
| `VITE_ADMIN_PATH` | `/secret-portal` | Your secure, custom entry-point for the admin panel. |
| `VITE_STORAGE_SECRET` | `your-high-entropy-key` | A secure string for encrypting local storage data. |
| `VITE_SOCIAL_LINKEDIN` | `https://linkedin.com/in/...` | Your LinkedIn profile link. |
| `VITE_SOCIAL_GITHUB` | `https://github.com/...` | Your GitHub profile link. |

---

## 🔧 Getting Started

1. Copy `.env.example` to `.env` and fill in the necessary variables (e.g. `VITE_API_URL`, `VITE_SOCIAL_LINKEDIN`).
2. Run `npm install` to install dependencies.
3. Run `npm run dev` to start the development server.
4. Access the web app at `http://localhost:3000`.
