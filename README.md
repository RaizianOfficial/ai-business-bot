# AI Gift Hamper Order Assistant

A production-ready AI-powered order management system for gift hamper stores.

## Features
- **AI Chatbot**: Sequential order collection using Google Gemini 1.5 Flash.
- **Admin Dashboard**: Secure order management (Confirm, Ship, Delete).
- **Email Notifications**: Instant admin alerts via SMTP/Nodemailer.
- **Modern UI**: Dark mode, glassmorphism, and smooth animations with Framer Motion.
- **Secure**: Passkey-protected admin access.

## Tech Stack
- **Frontend**: Next.js 14+ (App Router), TailwindCSS, TypeScript.
- **Backend**: Next.js Serverless Routes.
- **AI**: Google Gemini API.
- **Database**: Firebase Firestore.
- **Email**: SMTP (Nodemailer).

---

## Setup Instructions

### 1. Environment Variables
Create a `.env.local` file in the root directory and fill in the following:

```env
GEMINI_API_KEY=your_gemini_api_key

# Firebase Service Account
FIREBASE_PROJECT_ID=your_project_id
FIREBASE_CLIENT_EMAIL=your_client_email
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"

# SMTP Settings
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_email@gmail.com
SMTP_PASS=your_app_password
ADMIN_EMAIL=admin_recipient@gmail.com

# Admin Security
ADMIN_PASSKEY=1234
```

### 2. Firebase Setup
1. Create a Firebase project at [Firebase Console](https://console.firebase.google.com/).
2. Enable **Firestore Database**.
3. Go to Project Settings > Service Accounts.
4. Generate a new private key and copy the details to your `.env.local`.

### 3. Database Seeding
After setting up `.env.local`, run the seed script to initialize products:
```bash
npm run seed
```

### 4. Run Locally
```bash
npm install
npm run dev
```

---

## Deployment on Vercel

1. Push your code to GitHub.
2. Connect your repository to [Vercel](https://vercel.com/).
3. Add all environment variables from `.env.local` to the Vercel project settings.
4. Deploy!

---

## System Architecture

Customer Browser -> Next.js Website -> Chatbot UI -> API Route /api/chat -> Gemini AI -> Structured Order Data -> Firestore Database -> SMTP Email Notification -> Admin Dashboard
