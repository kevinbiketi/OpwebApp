# GitHub Pages Deployment Guide

## Important: Fixing the "Shows Notes and Markdown Files" Issue

If your GitHub Pages site is showing repository files (README.md, notes, etc.) instead of your React app, follow these steps:

### Step 1: Configure GitHub Pages Settings

1. Go to your repository on GitHub
2. Click on **Settings** (top menu)
3. Scroll down to **Pages** in the left sidebar
4. Under **Source**, select:
   - **Branch**: `gh-pages`
   - **Folder**: `/ (root)`
5. Click **Save**

### Step 2: Deploy Using One of These Methods

#### Method A: Using GitHub Actions (Recommended - Automatic)

The `.github/workflows/deploy.yml` file is already set up. Just:
1. Push your code to the `main` or `master` branch
2. GitHub Actions will automatically build and deploy to `gh-pages` branch
3. Wait a few minutes for the deployment to complete
4. Your site will be available at `https://yourusername.github.io/repo-name`

#### Method B: Manual Deployment

1. Build your project:
   ```bash
   npm run build
   ```

2. Deploy to GitHub Pages:
   ```bash
   npm run deploy
   ```

   This will:
   - Build your React app
   - Create/update the `gh-pages` branch
   - Deploy the `build` folder contents

### Step 3: Verify Deployment

1. Wait 1-2 minutes after deployment
2. Visit your GitHub Pages URL (usually `https://yourusername.github.io/repo-name`)
3. You should see your React app, not the repository files

### Troubleshooting

**If you still see markdown files:**
- Make sure GitHub Pages is set to use the `gh-pages` branch, NOT the `main` branch
- Clear your browser cache (Ctrl+Shift+Delete)
- Wait a few more minutes for GitHub to update
- Check that the `gh-pages` branch contains the built files (index.html, static folder, etc.)

**If the page is blank:**
- Check the browser console for errors (F12)
- Make sure all paths in your code use relative paths
- Verify that `homepage: "."` is set in `package.json`

### Important Notes

- The `homepage: "."` field in `package.json` ensures React uses relative paths
- The `.nojekyll` file prevents GitHub from processing files with Jekyll
- The `404.html` file handles routing for single-page apps
- HashRouter is used for GitHub Pages compatibility (URLs will have `#`)
