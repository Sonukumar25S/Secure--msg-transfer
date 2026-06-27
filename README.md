# 🔐 Secure Message Transfer System

A secure full-stack messaging platform built using the MERN stack that enables users to exchange encrypted messages and files while maintaining privacy and security.

## 🚀 Live Demo

🌐 Frontend: https://secure-msg-transfer.vercel.app

## ✨ Features

* 🔐 Secure Message Encryption using AES & RSA
* 👤 User Authentication & Authorization
* 📧 Email Verification System
* 📁 Secure File Sharing
* 📥 Inbox & Sent Messages
* 🔑 RSA Key Pair Generation
* 🛡️ JWT-Based Authentication
* 📱 Fully Responsive User Interface

## 🛠️ Tech Stack

### Frontend

* React.js
* Tailwind CSS
* DaisyUI
* React Router

### Backend

* Node.js
* Express.js

### Database

* MongoDB Atlas
* Mongoose

### Security

* JWT Authentication
* AES Encryption
* RSA Encryption

## 📂 Project Structure

```text
backend/
├── config/
├── controllers/
├── middleware/
├── models/
├── routes/
├── utils/
├── uploads/
└── server.js

frontend/
├── public/
├── src/
├── tailwind.config.js
└── package.json
```

## 🔒 Security Features

### RSA Encryption

* RSA key pair generation during user registration
* Public key encryption support
* Secure message handling

### AES Encryption

* Message content encryption before storage
* Enhanced privacy and protection

### Authentication

* JWT-based authentication
* Protected routes
* Secure user sessions

## ⚙️ Installation

### Clone Repository

```bash
git clone https://github.com/Sonukumar25S/Secure--msg-transfer.git
```

### Backend Setup

```bash
cd backend
npm install
npm start
```

### Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

### Environment Variables

Create a `.env` file in the backend directory and configure:

```env
MONGO_URI=your_mongodb_uri
JWT_SECRET=your_jwt_secret
CLIENT_URL=your_frontend_url
EMAIL_USER=your_email
EMAIL_PASS=your_email_password
```

## 🎯 Key Learnings

* Full Stack Application Development
* Authentication & Authorization
* Cryptography Fundamentals
* REST API Development
* MongoDB Database Design
* Secure File Handling
* Deployment using Vercel & Render

## 👨‍💻 Author

**Sonu Kumar**

📧 Email: [sonukr2003saguni@gmail.com](mailto:sonukr2003saguni@gmail.com)

💼 LinkedIn: https://www.linkedin.com/in/sonu-kumar25

🌐 Portfolio: https://sonu-portfolio-jet.vercel.app

🐙 GitHub: https://github.com/Sonukumar25S
