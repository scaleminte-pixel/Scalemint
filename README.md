# Scalemint — 360° Creative & Digital Growth Studio

A full-stack production-ready web application and dynamic content management system (CMS) engineered for category leadership, high conversion rates, and sub-second performance.

---

## ⚡ Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Database & ORM**: SQLite / Prisma ORM
- **Styling**: Tailwind CSS & Lucide React
- **Image Optimization**: Sharp & WebP Pipeline
- **Auth**: JWT Cookie Authentication
- **Media**: Central Media Library with zero server video uploads (YouTube Direct Streaming)

---

## 🚀 Quick Start

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Setup Environment**
   ```bash
   cp .env.example .env
   ```

3. **Initialize Database**
   ```bash
   npx prisma db push
   node prisma/seed.js
   node prisma/seed-portfolio.js
   node prisma/seed-extra.js
   ```

4. **Run Development Server**
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000) to view the website.

5. **Admin Dashboard**
   Navigate to [http://localhost:3000/admin](http://localhost:3000/admin).

---

## 🛡️ Production & Deployment

- **Build**: `npm run build`
- **Start**: `npm run start`
- **Process Manager**: PM2 with `ecosystem.config.js`
- **Backup**: `node scripts/backup-db.js`
