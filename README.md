# 🎨 AI Thumbnail Generator

<p align="center">
  <strong>Generate professional YouTube thumbnails using AI in seconds.</strong>
</p>

<p align="center">
  Built with <strong>React</strong>, <strong>Node.js</strong>, <strong>MongoDB</strong>, <strong>Google Gemini Image Generation</strong>, and <strong>Cloudinary</strong>.
</p>

<p align="center">
  <a href="https://ai-thumbnail-generator-frontend-chi.vercel.app">
    <img src="https://img.shields.io/badge/🌐-Live%20Demo-8B5CF6?style=for-the-badge" />
  </a>
  &nbsp;
  <a href="https://ai-thumbnail-generator-backend.onrender.com">
    <img src="https://img.shields.io/badge/⚡-Backend%20API-10B981?style=for-the-badge" />
  </a>
</p>

---

## 📖 Overview

AI Thumbnail Generator is a full-stack web application that enables creators to generate eye-catching YouTube thumbnails using Google's Gemini Image Generation API.

Users can generate, edit, download, and manage AI-generated thumbnails with an intuitive and responsive interface.

---

## ✨ Features

### 🤖 AI Thumbnail Generation

- AI-powered thumbnail generation
- Multiple thumbnail styles
- Multiple aspect ratios
- Custom color palettes
- Additional prompt support
- Automatic text overlay

### ✏️ Edit Thumbnails

- Edit existing thumbnails
- Regenerate thumbnails using new prompts
- Preserve the same database record
- Automatic replacement of previous Cloudinary image
- Cancel editing anytime

### 🖼 Thumbnail Management

- View all generated thumbnails
- Live preview
- Download thumbnails
- Delete thumbnails
- Automatic generation status updates

### 🔐 Authentication

- User Registration
- User Login
- Session-based Authentication
- Protected Routes

### ☁️ Cloudinary Integration

- Automatic image uploads
- Secure cloud storage
- Optimized image delivery

### 📱 Responsive UI

- Mobile Friendly
- Tablet Friendly
- Desktop Friendly
- Modern Glassmorphism Design

---

# 🛠 Tech Stack

## Frontend

- React
- TypeScript
- Vite
- Tailwind CSS
- React Router DOM
- Axios
- React Hot Toast
- Lucide React

## Backend

- Node.js
- Express.js
- TypeScript
- MongoDB
- Mongoose

## AI

- Google Gemini Image Generation API

## Cloud Storage

- Cloudinary

## Authentication

- Express Session

---

# 📂 Folder Structure

```text
AI-Thumbnail-Generator
│
├── frontend
│   ├── public
│   ├── src
│   │   ├── assets
│   │   ├── components
│   │   ├── config
│   │   ├── contexts
│   │   ├── pages
│   │   └── ...
│   └── package.json
│
├── backend
│   ├── controllers
│   ├── middleware
│   ├── models
│   ├── routes
│   ├── utils
│   ├── DB
│   ├── config
│   └── package.json
│
└── README.md
```

---

# 🚀 Installation

## Clone Repository

```bash
git clone https://github.com/Vedant22Agarwal/AI-thumbnail-generator.git
cd cd AI-thumbnail-generator
```

---

## Backend

Install dependencies

```bash
cd backend

npm install
```

Create a `.env` file

```env
PORT=3000

MONGODB_URI=

SESSION_SECRET=

GOOGLE_CLOUD_PROJECT=

GOOGLE_CLIENT_EMAIL=

GOOGLE_PRIVATE_KEY=

CLOUDINARY_CLOUD_NAME=

CLOUDINARY_API_KEY=

CLOUDINARY_API_SECRET=
```

Run the backend

```bash
npm run server
```

---

## Frontend

Install dependencies

```bash
cd frontend

npm install
```

Create `.env`

```env
VITE_BACKEND_URL=http://localhost:3000
```

Run frontend

```bash
npm run dev
```

---

# 🎯 Usage

1. Login or create an account.
2. Enter your thumbnail title.
3. Select your preferred style.
4. Choose an aspect ratio.
5. Pick a color scheme.
6. Add optional custom prompts.
7. Click **Generate Thumbnail**.
8. Download, edit, or delete your generated thumbnail.

---

# 🎨 Thumbnail Styles

- Bold & Graphic
- Tech / Futuristic
- Minimalist
- Photorealistic
- Illustrated

---

# 🌈 Color Schemes

- Vibrant
- Sunset
- Forest
- Neon
- Purple
- Monochrome
- Ocean
- Pastel

---

# 🔗 API Endpoints

## Authentication

```http
POST /api/auth/register

POST /api/auth/login

POST /api/auth/logout
```

## Thumbnail

```http
POST /api/thumbnails/generate

PUT /api/thumbnails/:id

DELETE /api/thumbnails/:id

GET /api/users/thumbnails

GET /api/users/thumbnail/:id
```

---

# 🚀 Future Improvements

- AI Prompt Suggestions
- Image Upscaling
- AI Background Removal
- Template Library
- Public Gallery
- Collections
- Favorite Thumbnails
- Batch Thumbnail Generation
- Drag & Drop Thumbnail Editor


---

# 👨‍💻 Author

**Vedant Agarwal**

Electrical Engineering Undergraduate  
**Indian Institute of Technology (ISM), Dhanbad**

- GitHub: https://github.com/Vedant22Agarwal
- LinkedIn: https://www.linkedin.com/in/vedant-agarwal-1a68a4285

---

# ⭐ Show Your Support

If you found this project helpful, please consider giving it a ⭐ on GitHub.

It really helps and motivates future development.

---