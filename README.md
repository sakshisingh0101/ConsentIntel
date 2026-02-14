# Consent Intelligence Dashboard - Frontend

This is the frontend for the Consent Intelligence Dashboard, built with **React**, **Vite**, and **Tailwind CSS**. It provides the user interface for analyzing app risks, monitoring active consents, and viewing risk timelines.

## Features
- **Risk Preview**: Pre-install analysis of app permissions and policies.
- **Live Dashboard**: Real-time monitoring of installed apps and global trust score.
- **Timeline**: Visual history of permission access events.
- **Simulations**: Interactive controls to trigger risk events (microphone access, dormant leaks).

## Prerequisites
- Node.js (v14+ recommended)
- npm

## Installation

1. Navigate to the client directory:
   ```bash
   cd client
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Setup Environment Variables:
   - Create a `.env` file in the `client` directory.
   - Add the backend URL:
     ```env
     VITE_API_URL=http://localhost:5000/api,https://consentinter-backend.onrender.com
     ```
     *(Note: For production, use your deployed backend URL)*

## Running Locally

Start the development server:
```bash
npm run dev
```
The app will typically run at `http://localhost:5173,https://consent-intel.vercel.app`.

## Build for Production

To create a production build:
```bash
npm run build
```
The output will be in the `dist` directory.


Root Directory: client
