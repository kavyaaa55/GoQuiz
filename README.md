

# 🧠 Go Quiz

**Go Quiz** is a sleek, secure, and interactive quiz platform built with modern technologies like **Next.js**, **TypeScript**, **Prisma ORM**, and **MySQL**. It delivers a timed quiz experience with speed-based scoring and anti-cheating mechanisms to ensure fair play.

> ⚠️ The project is currently under development — new features and improvements are being added.

## 🚀 Tech Stack

* **Frontend**: Next.js (App Router) + TypeScript
* **Backend**: Next.js API Routes
* **Database**: MySQL (via Prisma ORM)
* **Authentication**: NextAuth.js
* **ORM**: Prisma
* **Deployment**: Vercel

## 🌟 Features

* 🔐 **User Authentication** via NextAuth
* ⏱️ **Timed Questions** – each question has its own countdown
* ⚡ **Speed-Based Scoring** – the faster you answer, the more points you earn
* 🚫 **Single Attempt Policy** – users can attempt each quiz only once
* 🛡️ **Anti-Cheating Features** – tab-switch detection and anti copy paste features
* 🏆 **Leaderboard** – view top scorers and compete with others
* 📋 **Instant Results & Score Summary**
* 🌐 **Responsive UI** for all devices
* 🧪 Currently in **development mode**

## 🖥️ Demo

👉 [Live Site](https://goquiz-peach.vercel.app)

## 📸 Screenshots

> *Add screenshots here later*

## 🛠️ Local Development

### 1. Clone the Repository

```bash
git clone https://github.com/your-username/goquiz.git
cd goquiz
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Setup Environment Variables

Create a `.env` file in the root with:

```env
DATABASE_URL="mysql://user:password@localhost:3306/dbname"
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-secret-key
# OAuth credentials if using providers like Google
```

### 4. Initialize Prisma and Database

```bash
npx prisma generate
npx prisma migrate dev --name init
```

### 5. Start the Development Server

```bash
npm run dev
```

App will be running at: [http://localhost:3000](http://localhost:3000)

## 🗃️ Database Models Overview

* `User` – stores user info
* `Quiz` – quiz metadata
* `Question` – questions under each quiz
* `Option` – multiple-choice options
* `Result` – user attempts, scores, and timing
* `Leaderboard` – aggregated high scores per quiz

*(You can include an ER diagram or Prisma schema here if needed)*

## 🧑‍💻 Author

Made with ❤️ by \[Kavyanjali Gavate]

