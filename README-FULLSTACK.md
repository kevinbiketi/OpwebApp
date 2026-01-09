# Fish Farm Operation Management System - Full Stack

A comprehensive full-stack web application for managing fish farm operations with Node.js backend, MySQL database, and React frontend.

## Technology Stack

### Frontend
- **React 18.2.0** - UI framework
- **React Router DOM 6.20.0** - Routing
- **CSS3** - Styling

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MySQL** - Database
- **JWT** - Authentication
- **bcryptjs** - Password hashing

## Project Structure

```
OpwebApp/
├── server/                 # Backend server
│   ├── server.js           # Main server file
│   ├── package.json        # Backend dependencies
│   ├── scripts/
│   │   └── setupDatabase.js  # Database setup script
│   └── .env.example        # Environment variables template
├── src/                    # Frontend React app
│   ├── components/         # React components
│   ├── services/
│   │   └── api.js         # API service layer
│   └── ...
├── package.json            # Frontend dependencies
└── .env.example           # Frontend environment variables
```

## Prerequisites

- Node.js (v14 or higher)
- MySQL (v5.7 or higher)
- npm or yarn

## Installation

### 1. Clone the Repository

```bash
git clone <your-repo-url>
cd OpwebApp
```

### 2. Install Frontend Dependencies

```bash
npm install
```

### 3. Install Backend Dependencies

```bash
cd server
npm install
cd ..
```

### 4. Set Up MySQL Database

1. Create a MySQL database:
```sql
CREATE DATABASE fish_farm_db;
```

2. Configure database credentials in `server/.env`:
```env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=fish_farm_db
PORT=5000
JWT_SECRET=your-secret-key
```

3. Run the database setup script:
```bash
cd server
npm run setup-db
cd ..
```

### 5. Configure Frontend Environment

Create a `.env` file in the root directory:
```env
REACT_APP_API_URL=http://localhost:5000/api
```

## Running the Application

### Development Mode

1. **Start the backend server:**
```bash
cd server
npm run dev
```

2. **Start the frontend (in a new terminal):**
```bash
npm start
```

3. Open [http://localhost:3000](http://localhost:3000) in your browser.

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user

### Settings
- `GET /api/settings` - Get farm settings
- `PUT /api/settings` - Update farm settings

### Batches
- `GET /api/batches` - Get all batches
- `POST /api/batches` - Create new batch
- `DELETE /api/batches/:id` - Delete batch

### Section Records
- `GET /api/sections/:section` - Get records for a section
- `POST /api/sections/:section` - Create new record
- `DELETE /api/sections/:section/:id` - Delete record

Sections: `hatchery`, `pre-grow-out`, `grow-out`, `puddling`, `quarantine`

## Database Schema

The database includes the following tables:
- `users` - User accounts
- `farm_settings` - Farm configuration
- `batches` - Batch records
- `hatchery_records` - Hatchery operations
- `pre_grow_out_records` - Pre-grow out operations
- `grow_out_records` - Grow-out operations
- `puddling_records` - Puddling operations
- `quarantine_records` - Quarantine operations

## Deployment

### Backend Deployment

The backend can be deployed to:
- **Heroku** - Easy Node.js deployment
- **Railway** - Modern deployment platform
- **AWS EC2** - Full control
- **DigitalOcean** - Simple VPS

1. Set environment variables on your hosting platform
2. Ensure MySQL database is accessible
3. Deploy the `server/` directory

### Frontend Deployment

The frontend can be deployed to:
- **GitHub Pages** - Static hosting
- **Netlify** - Easy deployment
- **Vercel** - Fast deployment

1. Update `.env` with production API URL
2. Build the app: `npm run build`
3. Deploy the `build/` folder

### Full Stack Deployment Options

1. **Separate Hosting:**
   - Backend: Heroku/Railway
   - Frontend: GitHub Pages/Netlify
   - Database: MySQL (hosted separately or same as backend)

2. **Single Server:**
   - Deploy both frontend and backend to same server
   - Use nginx to serve static files and proxy API requests

## Environment Variables

### Backend (`server/.env`)
```env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=fish_farm_db
PORT=5000
NODE_ENV=production
JWT_SECRET=your-secret-key-change-in-production
```

### Frontend (`.env`)
```env
REACT_APP_API_URL=http://localhost:5000/api
```

## Security Notes

- Change `JWT_SECRET` in production
- Use strong database passwords
- Enable HTTPS in production
- Implement rate limiting for API
- Use environment variables for sensitive data

## Features

- ✅ User authentication with JWT
- ✅ Secure password hashing
- ✅ MySQL database integration
- ✅ RESTful API
- ✅ React frontend with API integration
- ✅ All original features maintained

## Troubleshooting

### Database Connection Issues
- Verify MySQL is running
- Check database credentials in `.env`
- Ensure database exists: `CREATE DATABASE fish_farm_db;`

### API Connection Issues
- Verify backend server is running on port 5000
- Check `REACT_APP_API_URL` in frontend `.env`
- Check CORS settings in `server.js`

### Authentication Issues
- Clear browser localStorage
- Verify JWT_SECRET is set
- Check token expiration

## License

MIT
