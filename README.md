# 💧 Smart Water Meter Monitoring and Billing System

## Overview

The **Development of Water Usage monitoring Application* is an IoT-based application designed to monitor water consumption in real time. The system integrates an **ESP32 microcontroller** with a **YF-S201 Water Flow Sensor** to measure water usage accurately. The collected data is transmitted to **Firebase Realtime Database**, where it is securely stored and displayed through a responsive **React.js** dashboard.

The application provides real-time monitoring, historical usage tracking, bill estimation, secure user authentication, email notifications for excessive water consumption, and an installable Progressive Web Application (PWA).

---

## Features

- 🔐 Secure User Authentication
- 💧 Real-Time Water Usage Monitoring
- 📊 Interactive User Dashboard
- 📈 Historical Usage Records
- 💰 Automatic Bill Estimation
- 📧 Email Notifications
- ☁️ Firebase Realtime Database Integration
- 📱 Progressive Web Application (PWA)
- 🌐 Cloud Deployment using Vercel
- 📄 Admin Report Generation

---

## Technology Stack

### Hardware
- ESP32 Development Board
- YF-S201 Water Flow Sensor

### Frontend
- React.js
- Vite
- HTML5
- CSS3
- JavaScript

### Backend & Cloud
- Firebase Authentication
- Firebase Realtime Database

### Deployment
- Git
- GitHub
- Vercel

---

## System Workflow

```text
Water Flow
      │
      ▼
YF-S201 Water Flow Sensor
      │
      ▼
ESP32 Microcontroller
      │
      ▼
Wi-Fi Communication
      │
      ▼
Firebase Realtime Database
      │
      ▼
React Dashboard
      │
 ┌────┴────────────┐
 ▼                 ▼
User Dashboard  Admin Dashboard
      │
      ▼
Bill Estimation & Email Notifications
```

---

## Project Structure

```
water-dashboard/
│
├── public/
├── src/
│   ├── assets/
│   ├── firebase.js
│   ├── App.jsx
│   ├── main.jsx
│   ├── App.css
│   └── index.css
│
├── .env
├── .gitignore
├── package.json
├── vite.config.js
└── README.md
```

---

## Installation

### Clone the Repository

```bash
git clone https://github.com/<your-username>/water-dashboard.git
```

### Navigate to the Project Folder

```bash
cd water-dashboard
```

### Install Dependencies

```bash
npm install
```

---

## Configure Firebase

Create a `.env` file in the project root.

```env
VITE_FIREBASE_API_KEY=YOUR_API_KEY
VITE_FIREBASE_AUTH_DOMAIN=YOUR_AUTH_DOMAIN
VITE_FIREBASE_DATABASE_URL=YOUR_DATABASE_URL
VITE_FIREBASE_PROJECT_ID=YOUR_PROJECT_ID
VITE_FIREBASE_STORAGE_BUCKET=YOUR_STORAGE_BUCKET
VITE_FIREBASE_MESSAGING_SENDER_ID=YOUR_SENDER_ID
VITE_FIREBASE_APP_ID=YOUR_APP_ID
```

---

## Run the Application

```bash
npm run dev
```

The application will be available at:

```
http://localhost:5173
```
Website link:https://water-dashboard-six.vercel.app/
---

## Deployment

The application is deployed using **Vercel** with automatic deployment through GitHub.

Deployment includes:

- Automatic builds
- Environment variable support
- HTTPS
- Progressive Web Application support

---

## Progressive Web Application

The application can be installed directly from the browser.

Benefits include:

- Install without Play Store
- Home screen shortcut
- Fast loading
- App-like user experience
- Automatic updates after deployment

---


## Security

- Firebase Authentication
- Firebase Realtime Database Rules
- Environment Variables
- GitHub Secret Protection
- Secure Cloud Deployment

---

## Future Enhancements

- Water Leakage Detection
- AI-based Water Usage Prediction
- Push Notifications
- PDF Bill Generation
- Multiple Water Meter Support
- Native Android & iOS Applications
- Advanced Analytics Dashboard

---

## Author

**Priya Dharshini K**

Internship Project

---

## License

This project was developed as part of an internship for educational and demonstration purposes.