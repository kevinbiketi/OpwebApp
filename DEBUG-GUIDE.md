# Debugging Guide

## Common Issues and Solutions

### 1. Backend Not Running
**Symptoms:** API calls fail, "Network error" messages

**Solution:**
```bash
cd server
npm install
npm run dev
```

Make sure the backend is running on port 5000 before starting the frontend.

### 2. Database Not Set Up
**Symptoms:** "Cannot connect to database" errors

**Solution:**
1. Make sure MySQL is running
2. Create database: `CREATE DATABASE fish_farm_db;`
3. Configure `server/.env` with correct credentials
4. Run setup: `cd server && npm run setup-db`

### 3. CORS Errors
**Symptoms:** Browser console shows CORS errors

**Solution:**
- Backend CORS is already configured
- Make sure backend is running on port 5000
- Check `REACT_APP_API_URL` in frontend `.env`

### 4. Authentication Issues
**Symptoms:** "Invalid token" or "Session expired"

**Solution:**
- Clear browser localStorage
- Login again
- Check JWT_SECRET in `server/.env`

### 5. Components Still Using localStorage
**Symptoms:** Data not persisting, old data showing

**Solution:**
- All components should now use API
- Clear browser localStorage: `localStorage.clear()`
- Restart both frontend and backend

## Quick Debug Checklist

- [ ] Backend server running on port 5000
- [ ] MySQL database created and accessible
- [ ] Database tables created (run setup-db)
- [ ] Frontend `.env` has `REACT_APP_API_URL=http://localhost:5000/api`
- [ ] Backend `.env` has correct database credentials
- [ ] No console errors in browser
- [ ] No errors in backend terminal

## Testing the API

Test if backend is working:
```bash
curl http://localhost:5000/api/health
```

Should return: `{"status":"OK","message":"Server is running"}`
