# GitHub Pages Deployment Guide

## Current Setup

Your site is live at: https://piri2611.github.io/HTML_Practice/

## Configuration Steps

### 1. Update GitHub Pages Settings

Go to your repository settings at: https://github.com/piri2611/HTML_Practice/settings/pages

**Configure as follows:**
- **Source**: Deploy from a branch
- **Branch**: `main`
- **Folder**: `/ (root)` ← **This is correct as the dist folder is committed to the repository**

### 2. What Was Fixed

✅ Updated `dist/index.html` to use **relative paths** instead of absolute paths:
- Changed: `/assets/` → `./assets/`
- This allows the assets to load correctly from any subdirectory

### 3. Deployment Status

Your site builds automatically when you push to the `main` branch. Check deployment status at:
https://github.com/piri2611/HTML_Practice/deployments

### 4. Testing Your Site

Visit your site:
- Main: https://piri2611.github.io/HTML_Practice/
- Should load without 404 errors

## If Still Getting 404 Errors

### Option A: Use `/dist` as Source (Recommended)
1. Go to Settings → Pages
2. Change Branch to: `main`
3. Change Folder to: `/dist`
4. Save

This is cleaner as it deploys only the built files.

### Option B: Keep Current Setup
The current setup (deploying from root) works fine since we've committed the dist folder with proper relative paths.

## How to Update Site

```bash
# Make code changes
npm run build          # Build the project
git add -A            # Stage all changes
git commit -m "Your message"  # Commit
git push origin main  # Deploy automatically
```

## Troubleshooting

**Still seeing 404?**
1. Hard refresh your browser: `Ctrl+Shift+R` (or `Cmd+Shift+R` on Mac)
2. Check GitHub Actions to see if build succeeded
3. Verify `dist/index.html` exists in the repository

**Assets not loading?**
1. Check browser console for exact error paths
2. Ensure relative paths use `./assets/` not `/assets/`
3. Clear browser cache

## Project Structure

```
HTML_Practice/
├── dist/              ← Deployed files
│   ├── index.html
│   └── assets/
│       ├── index-93b3f9ee.js    (app bundle)
│       └── index-47754294.css   (styles)
├── src/               ← Source code
└── ...
```
