# 🎁 AI Gift Hamper Order Assistant

⚡ An AI-powered chatbot that automatically takes complete gift hamper orders from customers — no manual chatting required.

---

## 🎥 Demo

> Customer → Chat → Order captured → Admin notified → Done 🚀
> (Add demo GIF/video here)

---

## 🧠 What It Does

This system replaces manual WhatsApp order handling with an AI assistant that:

* Asks customers questions step-by-step
* Collects complete order details
* Saves structured data to database
* Notifies admin instantly

---

## ✨ Features

* 🤖 AI Chatbot (Google Gemini)
* 🧾 Structured order collection (no messy chats)
* 📩 Instant email notifications (SMTP)
* 📊 Admin dashboard (confirm, ship, delete)
* 🔐 Secure admin access (passkey protected)
* 🎨 Modern UI (dark mode + animations)

---

## 🎯 Use Cases

* 🎁 Gift hamper businesses
* 🎂 Custom order shops
* 🛍️ Small D2C brands
* 📦 Manual order-based stores

---

## 🛠️ Tech Stack

* Next.js 14 (App Router)
* Tailwind CSS + Framer Motion
* Firebase Firestore
* Google Gemini API
* Nodemailer (SMTP)

---

## 🚀 Quick Start

```bash
git clone https://github.com/raizianofficial/ai-business-bot.git
cd YOUR_REPO
npm install
npm run dev
```

---

## 🔐 Environment Setup

Create `.env.local`:

```env
GEMINI_API_KEY=your_gemini_api_key

FIREBASE_PROJECT_ID=your_project_id
FIREBASE_CLIENT_EMAIL=your_client_email
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n"

SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_email@gmail.com
SMTP_PASS=your_app_password
ADMIN_EMAIL=admin@gmail.com

ADMIN_PASSKEY=your_secure_passkey
```

---

## ⚙️ How It Works

1. Customer opens chatbot
2. AI asks questions step-by-step
3. Order is structured and saved
4. Admin gets email notification
5. Order managed via dashboard

---

## 🗺️ Roadmap

* [ ] WhatsApp integration
* [ ] Payment integration
* [ ] Multi-admin support
* [ ] Order analytics

---

## 🤝 Contributing

Pull requests are welcome!

---

## ⭐ Support

If you find this useful:

👉 Star the repo
👉 Follow for more projects

---

## 🧑‍💻 Author

Built by Sunny Rawat (Raizian)
Building real-world AI tools 🚀
