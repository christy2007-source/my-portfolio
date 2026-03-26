# 🌸 Christy Saly — Portfolio Website

A modern, aesthetic portfolio website with a full CI/CD pipeline and backend API.

## 🗂️ Project Structure

```
my-portfolio/
├── index.html                  ← Frontend portfolio website
├── .gitignore                  ← Files Git should ignore
├── README.md                   ← This file
├── .github/
│   └── workflows/
│       └── ci.yml              ← GitHub Actions CI/CD pipeline
└── backend/
    ├── server.js               ← Node.js + Express API
    ├── package.json            ← Backend dependencies
    └── .env                    ← Secret keys (not pushed to GitHub)
```

## 🚀 Workflow

```
Local Git → GitHub → CI/CD (GitHub Actions) → Hosting → Web Browser
```

## 🌐 Frontend

- Pure HTML, CSS, JavaScript
- Deployed on **GitHub Pages**
- Live at: `https://YOUR_USERNAME.github.io/my-portfolio/`

## ⚙️ Backend

- **Node.js** + **Express.js**
- **PostgreSQL** database
- Deployed on **Render** (free tier)

## 🛠️ Local Setup

### Frontend
Just open `index.html` in your browser — no setup needed!

### Backend
```bash
cd backend
npm install
# Fill in your DATABASE_URL in .env
npm start
```

## 📬 API Endpoints

| Method | Route | Description |
|--------|-------|-------------|
| GET | `/` | Health check |
| POST | `/contact` | Save contact form |
| GET | `/contacts` | View all messages |

## 👩‍💻 Author

**Christy Saly** — BCA Student
