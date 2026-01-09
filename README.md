# Fish Farm Operation Management System

A comprehensive web application for managing fish farm operations with multiple sections including hatchery, pre-grow out, grow-out, puddling, and quarantine management.

## Features

- **Authentication System**: Separate sign up and login pages with Twitter blue background (#1DA1F2)
- **Mutable Logo & Farm Name**: Customizable farm logo and name in settings
- **Batch Management**: Add, view, and manage batches across different sections
- **Batch Reports**: Generate comprehensive batch reports with filtering options
- **Section Management**: Dedicated sections for:
  - Hatchery
  - Pre-Grow Out
  - Grow-Out
  - Puddling
  - Quarantine

## Installation

1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm start
```

3. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Usage

1. **Sign Up/Login**: Create an account or login with existing credentials
2. **Configure Farm**: Go to Settings to set your farm name and upload a logo
3. **Manage Batches**: Add new batches with details like species, quantity, section, etc.
4. **Track Operations**: Record data in each section (Hatchery, Pre-Grow Out, etc.)
5. **Generate Reports**: Create batch reports with filtering and download options

## Technology Stack

- React 18.2.0
- React Router DOM 6.20.0
- LocalStorage for data persistence
- Modern CSS with responsive design

## Project Structure

```
src/
├── components/
│   ├── Auth/
│   │   ├── Login.js
│   │   ├── Signup.js
│   │   └── Auth.css
│   ├── Dashboard/
│   │   ├── Dashboard.js
│   │   ├── Dashboard.css
│   │   ├── Settings.js
│   │   ├── Settings.css
│   │   ├── BatchManagement.js
│   │   ├── BatchManagement.css
│   │   ├── BatchReport.js
│   │   └── BatchReport.css
│   └── Sections/
│       ├── Hatchery.js
│       ├── PreGrowOut.js
│       ├── GrowOut.js
│       ├── Puddling.js
│       ├── Quarantine.js
│       └── Section.css
├── App.js
├── App.css
├── index.js
└── index.css
```

## Deployment to GitHub Pages

1. **Build the project:**
   ```bash
   npm run build
   ```

2. **Deploy to GitHub Pages:**
   - Go to your repository settings on GitHub
   - Navigate to "Pages" in the left sidebar
   - Under "Source", select the `gh-pages` branch and `/root` folder
   - Or use the GitHub Actions workflow (`.github/workflows/deploy.yml`) for automatic deployment

3. **Important Notes:**
   - The app uses HashRouter for GitHub Pages compatibility (URLs will have `#` like `yoursite.com/#/dashboard`)
   - A `404.html` file is included to handle routing on GitHub Pages
   - Make sure to set the `homepage` field in `package.json` if deploying to a subdirectory

## Notes

- All data is stored in browser localStorage
- No backend server required for basic functionality
- Responsive design works on desktop and mobile devices
- Uses HashRouter for GitHub Pages compatibility (clean URLs work in development, hash URLs in production)

