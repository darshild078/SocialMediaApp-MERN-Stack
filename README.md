# Switter – MERN Stack Social Media App

A full-featured social media platform built using the **MERN Stack (MongoDB, Express.js, React, Node.js)** that allows users to create posts, follow others, interact through likes and comments, and manage their profiles.

---

## 📌 Features

- **Authentication & Authorization**
  - Secure user registration and login with JWT
  - Password hashing using bcrypt
- **User Profiles**
  - Editable profile with bio, location, website
  - Profile & cover photo upload
  - Light/Dark theme preference
  - Public/Private account settings
- **Posts**
  - Create, edit, and delete posts
  - Like, comment, and view post details
  - Upload images with posts
- **Social Features**
  - Follow/Unfollow users
  - View other user profiles and their posts
- **Search**
  - Search users and posts by keywords
- **Responsive Design**
  - Fully mobile-friendly UI

---

## 🛠 Tech Stack

### Frontend
- React.js
- Axios (API requests)
- CSS / Custom styling

### Backend
- Node.js
- Express.js
- MongoDB (Mongoose)
- Multer (file uploads)
- JWT (authentication)
- bcrypt (password hashing)

---

## 📂 Project Structure

```
backend/
├─ controllers/        # Request handling logic
├─ middleware/         # Auth, upload middleware
├─ models/             # Mongoose schemas
├─ routes/             # API route definitions
├─ uploads/            # Uploaded images
└─ server.js           # Entry point for backend

frontend/
├─ public/             # Static assets
├─ src/
│  ├─ components/      # React components
│  ├─ api.js           # API configuration
│  ├─ App.js           # Main React component
│  └─ styles.css       # Styling
└─ package.json
```

---

## ⚙️ Installation & Setup

### 1. Clone Repository
```bash
git clone https://github.com/darshild078/SocialMediaApp-MERN-Stack.git
cd SocialMediaApp-MERN-Stack
```

### 2. Install Backend Dependencies
```bash
cd backend
npm install
```

### 3. Install Frontend Dependencies
```bash
cd ../frontend
npm install
```

### 4. Create Environment Variables
Create `.env` in `backend/`:
```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/switter
JWT_SECRET=your_jwt_secret
CLOUDINARY_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

---

## 🚀 Running the Project

### Start Backend
```bash
cd backend
npm start
```

### Start Frontend
```bash
cd frontend
npm start
```

**App will run on:**
- Frontend → `http://localhost:3000`
- Backend → `http://localhost:5000`

---

## 📸 Screenshots
*(Add some screenshots of your app here)*

---

## 📅 Roadmap
- ✅ Phase 1: Profile Enhancements & Settings  
- 🔄 Phase 2: Social Features (hashtags, mentions, trending)  
- 🔜 Phase 3: Real-time Notifications & Messaging  
- 🔮 Phase 4: Analytics Dashboard & Admin Panel  

---

## 📂 .gitignore
Below is the `.gitignore` used in this project to maintain clean commits and protect sensitive data.

```
# Node modules
backend/node_modules/
frontend/node_modules/

# Environment variables
backend/.env
frontend/.env

# Logs
*.log
npm-debug.log*
yarn-debug.log*
yarn-error.log*
pnpm-debug.log*

# Runtime files
pids
*.pid
*.seed
*.pid.lock

# Coverage directory
coverage/

# Build outputs
frontend/build/
backend/dist/

# Uploaded images
backend/uploads/

# OS / Editor specific files
.DS_Store
Thumbs.db
.vscode/
.idea/

# Cache
.cache/
frontend/.parcel-cache/
```

---

## 🤝 Contributing
Pull requests are welcome. For major changes, open an issue first to discuss.

---

## 📜 License
This project is licensed under the MIT License.