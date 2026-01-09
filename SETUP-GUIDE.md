# Full Stack Setup Guide

This guide will help you set up the complete full-stack Fish Farm Management System.

## Quick Start

### 1. Install Dependencies

```bash
# Install frontend dependencies
npm install

# Install backend dependencies
cd server
npm install
cd ..
```

### 2. Set Up MySQL Database

1. **Install MySQL** (if not already installed)
   - Download from: https://dev.mysql.com/downloads/mysql/
   - Or use XAMPP/WAMP which includes MySQL

2. **Create Database**
   ```sql
   CREATE DATABASE fish_farm_db;
   ```

3. **Configure Database Connection**
   
   Create `server/.env` file:
   ```env
   DB_HOST=localhost
   DB_USER=root
   DB_PASSWORD=your_mysql_password
   DB_NAME=fish_farm_db
   PORT=5000
   JWT_SECRET=your-secret-key-change-in-production
   ```

4. **Run Database Setup**
   ```bash
   cd server
   npm run setup-db
   cd ..
   ```

   This will create all necessary tables.

### 3. Configure Frontend

Create `.env` file in the root directory:
```env
REACT_APP_API_URL=http://localhost:5000/api
```

### 4. Start the Application

**Terminal 1 - Backend:**
```bash
cd server
npm run dev
```

**Terminal 2 - Frontend:**
```bash
npm start
```

### 5. Access the Application

- Frontend: http://localhost:3000
- Backend API: http://localhost:5000/api

## Database Tables Created

The setup script creates these tables:
- `users` - User accounts
- `farm_settings` - Farm configuration
- `batches` - Batch records
- `hatchery_records` - Hatchery operations
- `pre_grow_out_records` - Pre-grow out operations
- `grow_out_records` - Grow-out operations
- `puddling_records` - Puddling operations
- `quarantine_records` - Quarantine operations

## Testing the Setup

1. **Register a new user** at http://localhost:3000/#/signup
2. **Login** with your credentials
3. **Add a batch** in Batch Management
4. **Update farm settings** in Settings
5. **Add records** in any section (Hatchery, Pre-Grow Out, etc.)

## Troubleshooting

### MySQL Connection Error
- Verify MySQL is running: `mysql -u root -p`
- Check credentials in `server/.env`
- Ensure database exists: `SHOW DATABASES;`

### Port Already in Use
- Change PORT in `server/.env` to a different port (e.g., 5001)
- Update `REACT_APP_API_URL` in frontend `.env` accordingly

### CORS Errors
- Backend CORS is already configured for localhost:3000
- For production, update CORS settings in `server/server.js`

### API Not Responding
- Check backend server is running
- Verify `REACT_APP_API_URL` matches backend URL
- Check browser console for errors

## Next Steps

- See `README-FULLSTACK.md` for deployment instructions
- Update section components (PreGrowOut, GrowOut, Puddling, Quarantine) to use API (follow Hatchery.js pattern)
- Update BatchReport.js to fetch from API

## Notes

- All section components follow the same pattern as Hatchery.js
- Use `sectionAPI.getAll('section-name')` to fetch records
- Use `sectionAPI.create('section-name', data)` to create records
- Use `sectionAPI.delete('section-name', id)` to delete records
