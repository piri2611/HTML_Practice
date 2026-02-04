# GitHub Pages Deployment Guide

## Automated Deployment Setup ✨

Your site now uses **GitHub Actions** to automatically build and deploy when you push to the `main` branch!

## Quick Setup (One-Time)

1. **Enable GitHub Pages with Actions:**
   - Go to: https://github.com/piri2611/HTML_Practice/settings/pages
   - Under "Source", select: **GitHub Actions** (not "Deploy from a branch")
   - Save changes

2. **Push to main branch:**
   - Any push to `main` will automatically trigger a build and deployment
   - View deployment status at: https://github.com/piri2611/HTML_Practice/actions

3. **Visit your live site:**
   - Main site: https://piri2611.github.io/HTML_Practice/
   - Wait 1-2 minutes after first deployment for DNS to propagate

## How It Works

When you push to `main`:
1. ✅ GitHub Actions workflow runs automatically
2. ✅ Installs dependencies (`npm ci`)
3. ✅ Builds the project (`npm run build`)
4. ✅ Deploys the `dist/` folder to GitHub Pages
5. ✅ Site updates at https://piri2611.github.io/HTML_Practice/

## Making Updates

```bash
# 1. Make your code changes in src/

# 2. Commit and push to main
git add -A
git commit -m "Your update message"
git push origin main

# 3. Wait for GitHub Actions to build and deploy (1-2 minutes)
# 4. Visit https://piri2611.github.io/HTML_Practice/ to see changes
```

## Troubleshooting

### Still seeing a white page?

1. **Check GitHub Actions:**
   - Go to: https://github.com/piri2611/HTML_Practice/actions
   - Make sure the latest workflow run succeeded (green checkmark)
   - Click on the run to see deployment details

2. **Verify Pages Settings:**
   - Go to: https://github.com/piri2611/HTML_Practice/settings/pages
   - Source should be: "GitHub Actions" (not "Deploy from a branch")

3. **Hard refresh your browser:**
   - Windows/Linux: `Ctrl + Shift + R`
   - Mac: `Cmd + Shift + R`

4. **Check browser console:**
   - Press F12 to open developer tools
   - Look for any error messages in the Console tab

### Deployment failed?

1. **Check the workflow logs:**
   - https://github.com/piri2611/HTML_Practice/actions
   - Click on the failed run to see error details

2. **Common issues:**
   - Missing dependencies: Make sure `package-lock.json` is committed
   - Build errors: Test locally with `npm run build`
   - Environment variables: Check if `.env` variables are needed in GitHub Secrets

## Project Structure

```
HTML_Practice/
├── .github/
│   └── workflows/
│       └── deploy.yml          ← Automated deployment workflow
├── src/                        ← Your source code (edit these files)
│   ├── App.tsx
│   ├── main.tsx
│   └── ...
├── dist/                       ← Build output (auto-generated, gitignored)
├── vite.config.ts              ← Vite config with base: '/HTML_Practice/'
└── package.json
```

## Why This Is Better

✅ **No manual builds:** Just push your code, deployment happens automatically  
✅ **Always fresh:** Build happens in cloud with latest dependencies  
✅ **No merge conflicts:** `dist/` folder is never committed  
✅ **Easy rollback:** Revert a commit and push to rollback deployment  
✅ **Professional:** Industry-standard CI/CD workflow

## Local Development

```bash
# Install dependencies
npm install

# Run dev server (with hot reload)
npm run dev

# Build locally to test
npm run build

# Preview the build
npm run preview
```
