# Switter - Twitter-Like Social Media App

<p align="center">
  <img src="https://img.shields.io/badge/React-18.0+-61DAFB?style=for-the-badge&logo=react&logoColor=black">  
  <img src="https://img.shields.io/badge/Node.js-16.0+-339933?style=for-the-badge&logo=node.js&logoColor=white">  
  <img src="https://img.shields.io/badge/MongoDB-4.4+-47A248?style=for-the-badge&logo=mongodb&logoColor=white">  
  <img src="https://img.shields.io/badge/Express.js-4.21+-000000?style=for-the-badge&logo=express&logoColor=white">
</p>

A modern, full-stack social media application built with the MERN stack, featuring Google OAuth login, posts, profiles, and real-time interactions.

---

## Table of Contents

- [Features](#features)
- [Future Scopes](#future-scopes)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [Contributors](#contributors)
- [License](#license)

---

## Features

1. **User Authentication**
   - Email/password login and registration
   - Google OAuth direct login (no password required)
   - JWT-based session management
   - Logout functionality
2. **User Profiles**
   - View and edit profile
   - Upload profile and cover images (stored in cloud)
   - Follow/unfollow users and view follower counts
   - Remove comment/delete options on own profile page
   - Only logout option visible when logged in
3. **Posts & Feed**
   - Create, view, and interact with posts
   - Store images/posts in cloud storage with direct URL retrieval
   - Users can visit others' profiles and view their posts
4. **UI/UX**
   - Consistent styling across all pages
   - Message box in center instead of pop-ups for alerts/errors
5. **Navigation**
   - Login, register, home feed, create post, profile, user profile, and logout routes
6. **OAuth**
   - Google login integration using Passport.js

---

## Future Scopes

### Core Enhancements
- Ensure every page and feature works end-to-end
- Auto-login upon registration
- Discussion groups: anyone can create and join
- Direct Messages (DM) service
- Report a post feature
- Dating features: timeline, match by profile and posts
- Individual post pages showing likes and comments with time limit option
- Real-time notifications

### Cloud & Storage
- Migrate all file storage (images, posts) to cloud storage (e.g., AWS S3, Cloudinary)
- Optimize retrieval via direct URLs

### UI/UX Improvements
- Dark/light theme toggle
- Remove all pop-up boxes; use in-page message components
- Enhance mobile responsiveness and accessibility

### Collaboration & Roles
- Backend collaborator focuses on API, authentication, and storage
- Frontend collaborator focuses on UI, routing, and client logic

---

## Tech Stack

- **Frontend:** React, React Router DOM, Framer Motion, React Icons, Axios, CSS Variables
- **Backend:** Node.js, Express.js, MongoDB, Mongoose, Passport.js, JWT, bcryptjs, multer, CORS
- **Cloud:** Cloudinary or AWS S3 for image storage

---

## Project Structure

```
Switter-mern-stack/
├── backend/
│   ├── config/                # passport.js (Google OAuth)
│   ├── controllers/           # authController, userController, postController
│   ├── middleware/            # auth, upload, errorHandler
│   ├── models/                # User.js, Post.js
│   ├── routes/                # authRoutes, userRoutes, postRoutes
│   ├── uploads/               # local fallback storage
│   ├── server.js              # app entry point
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Auth/          # Login.js, Register.js, AuthSuccess.js, Auth.css
│   │   │   ├── Posts/         # PostFeed.js, CreatePost.js
│   │   │   ├── Profile/       # Profile.js, UserProfile.js
│   │   │   ├── Navbar.js
│   │   │   └── SearchBar.js
│   │   ├── App.js
│   │   ├── App.css
│   │   └── index.js
│   └── package.json
├── .gitignore
└── README.md
```

---

## Getting Started

1. **Clone repository**
```bash
git clone https://github.com/your-username/switter-mern-stack.git
cd switter-mern-stack
```
2. **Backend setup**
```bash
cd backend
npm install
npm install passport passport-google-oauth20 express-session dotenv
```
3. **Frontend setup**
```bash
cd ../frontend
npm install
```
4. **Configure `.env` in `backend/`**
```env
GOOGLE_CLIENT_ID=...
GOOGLE_CLIENT_SECRET=...
JWT_SECRET=...
MONGO_URI=...
PORT=5000
CLIENT_URL=http://localhost:3000
```
5. **Run servers**
```bash
# Backend
cd backend
nodemon server.js

# Frontend
cd ../frontend
npm start
```

---

## 👥 Contributors

- **Backend:** [Dhruv Vakharia](https://github.com/dhruvakhariaa)  
  📧 Email: vakhariadhruv529@gmail.com  

- **Frontend:** [Darshil Doshi](https://github.com/darshild078)  
  📧 Email: darshild078@gmail.com  

---

## 📞 Support & Contact

- 📧 **Email**: darshild078@gmail.com  
- 🐛 **Issues**: [GitHub Issues](https://github.com/darshild078/SocialMediaApp-MERN-Stack/issues)  
- 💬 **Discussions**: [GitHub Discussions](https://github.com/darshild078/SocialMediaApp-MERN-Stack/discussions)  

---

## License

This project is licensed under the MIT License.
