# Quick Start Guide for Windows PowerShell

## 🚀 Starting All Services

Use these commands in separate PowerShell windows:

### Terminal 1: Backend Server
```powershell
cd d:\project\backend
npm start
```

### Terminal 2: Frontend Application
```powershell
cd d:\project\frontend
npm start
```

### Terminal 3: ML Service
```powershell
cd d:\project\ml_service
venv\Scripts\activate.ps1
python app.py
```

### Terminal 4: Web Scraper (Optional)
```powershell
cd d:\project\scraper
venv\Scripts\activate.ps1
python main.py once Mumbai
```

---

## 📋 Pre-flight Checklist

Before starting, ensure:

- [ ] MongoDB running: `mongod` (port 27017)
- [ ] Redis running: `redis-server` (port 6379)
- [ ] `.env` files configured in each directory
- [ ] Node packages installed: ✅ (DONE)
- [ ] Python packages installed: ✅ (DONE)

---

## 🔍 Service URLs

Once all services are running:

| Service | URL | Purpose |
|---------|-----|---------|
| **Frontend** | http://localhost:3000 | Web Interface |
| **Backend API** | http://localhost:5000 | REST API |
| **ML Service** | http://localhost:5001 | ML Endpoints |

---

## 🆘 Troubleshooting Commands

### Check if port is in use
```powershell
# Find process on port 5000
netstat -ano | findstr :5000

# Kill process
taskkill /PID <PID> /F
```

### Clear npm cache
```powershell
cd d:\project\backend
npm cache clean --force
npm install
```

### Activate Python venv
```powershell
# ML Service
cd d:\project\ml_service
venv\Scripts\activate.ps1

# Scraper
cd d:\project\scraper
venv\Scripts\activate.ps1
```

### Deactivate Python venv
```powershell
deactivate
```

---

## ✅ Quick Status Check

### Backend Status
```powershell
curl http://localhost:5000/health
```

### Frontend Running?
Visit http://localhost:3000 in browser

### ML Service Status
```powershell
curl http://localhost:5001/health
```

---

## 📝 First Time Setup

1. **Copy environment files:**
   ```powershell
   cd d:\project\backend
   Copy-Item .env.example .env
   
   cd d:\project\frontend
   Copy-Item .env.example .env
   
   cd d:\project\ml_service
   Copy-Item .env.example .env
   
   cd d:\project\scraper
   Copy-Item .env.example .env
   ```

2. **Edit `.env` files** with your MongoDB, Redis, and API keys

3. **Start all services** as shown above

4. **Open browser:** http://localhost:3000

---

## 🎯 Common Tasks

### Reset Backend
```powershell
cd d:\project\backend
npm cache clean --force
npm install
npm start
```

### Reset Frontend
```powershell
cd d:\project\frontend
npm cache clean --force
npm install
npm start
```

### View Backend Logs
```powershell
Get-Content backend/logs/error.log -Tail 50
```

### Install new npm package
```powershell
cd d:\project\backend
npm install <package-name>
```

### Install new Python package
```powershell
cd d:\project\ml_service
venv\Scripts\activate.ps1
pip install <package-name>
```

---

**Last Updated:** March 25, 2026
**Status:** All packages installed ✅
