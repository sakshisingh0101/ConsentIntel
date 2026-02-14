# ConsentIntel – Frontend

ConsentIntel is a **Consent Intelligence Dashboard** that helps users understand, evaluate, and monitor digital consent risks before and after installing applications.

This repository contains the **frontend** of the ConsentIntel system, built with **Vite + React** and designed to visualize consent risk, live permission usage, and trust timelines in a clear, decision-support format.

---

## 🚀 Key Features

### 🔍 Consent Risk Preview
- Select an app from a predefined list
- View requested permissions and simulated policy clauses
- Get a **Consent Risk Level** (Low / Medium / High)
- Clear explanation of *why* the risk exists

### 📊 Live Consent Dashboard
- Displays granted permissions after “installation” (simulated)
- Shows frequency of permission access
- Highlights unusual or risky behavior

### 🕒 Trust Timeline
- Timeline of consent-related events
- Risk escalation alerts
- Connects **pre-install expectations** with **post-install behavior**

---

## 🧱 Tech Stack

- **Framework:** React (Vite)
- **Styling:** Tailwind CSS
- **State Management:** React Hooks
- **API Communication:** Axios
- **Environment Config:** Vite environment variables

---

## 📁 Project Structure



📁 Project Structure
client/
│
├── public/
│   └── favicon.png
│
├── src/
│   ├── components/       # Reusable UI components
│   ├── pages/            # Risk Preview, Dashboard, Timeline
│   ├── services/         # API calls
│   ├── App.jsx
│   ├── main.jsx
│   └── index.css
│
├── index.html
├── tailwind.config.js
├── postcss.config.js
├── package.json
└── README.md

⚙️ Setup & Installation
1️⃣ Install dependencies
npm install

2️⃣ Environment Variables

Create a .env file in the client folder:

VITE_API_URL=https://your-backend-url/api


Example:

VITE_API_URL=https://consentintel-backend.onrender.com/api

3️⃣ Run locally
npm run dev


App will be available at:

http://localhost:5173

4️⃣ Build for production
npm run build

🌐 Deployment

This frontend is designed to be deployed as a static site.

Supported Platforms

Vercel ✅

Netlify ✅

Render (Static Site) ✅

Build Settings

Build Command: npm run build

Output Directory: dist

Root Directory: client
