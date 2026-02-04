# Deployment Structure Guide

## Project Structure

```
quiz/
├── src/                          # Source code
│   ├── App.tsx                   # Main App component
│   ├── main.tsx                  # Entry point
│   ├── styles.css                # Global styles
│   ├── frontend/                 # Frontend components
│   │   ├── components/           # React components
│   │   ├── context/              # Context providers
│   │   ├── hooks/                # Custom hooks
│   │   └── utils/                # Utility functions
│   └── backend/                  # Backend services
│       ├── api/                  # API configuration
│       ├── config/               # Configuration files
│       ├── services/             # Business logic services
│       └── types/                # TypeScript types
├── dist/                         # Build output (generated, NOT committed)
│   ├── index.html                # Generated HTML file
│   └── assets/                   # Generated JS/CSS bundles
├── package.json                  # Dependencies
├── vite.config.ts                # Vite build configuration
├── tsconfig.json                 # TypeScript configuration
├── .gitignore                    # Git ignore rules
└── .env                          # Environment variables (NOT committed)
```

## Build & Deployment Process

### Local Development
```bash
npm install
npm run dev
```

### Building for Production
```bash
npm run build
```
This command:
1. Compiles TypeScript to JavaScript
2. Bundles React components
3. Optimizes assets
4. Generates `dist/` folder with:
   - `index.html` - Entry point with correct asset references
   - `assets/` - JavaScript and CSS bundles with content hashes

### GitHub Pages Deployment

**Automated deployment is now set up!** The site automatically builds and deploys when you push to the `main` branch.

1. **Make your changes to source files**
   
2. **Commit and push to main:**
   ```bash
   git add -A
   git commit -m "Update source code"
   git push origin main
   ```

3. **GitHub Actions automatically:**
   - Installs dependencies
   - Builds the project (`npm run build`)
   - Deploys the `dist/` folder to GitHub Pages
   - Your site updates at: https://piri2611.github.io/HTML_Practice/

**Note:** The first time you push, you need to enable GitHub Pages in repository settings:
- Go to: Settings → Pages
- Set Source to: "GitHub Actions" (not "Deploy from a branch")
- The workflow will handle the rest!

## Why Dist is Not Committed

- **Consistency:** Each build generates unique filenames with content hashes
- **No conflicts:** Avoids merge conflicts when building on different machines
- **Smaller repo:** Reduces repository size
- **CI/CD friendly:** Build process ensures assets always match HTML references

## Asset Structure

When you run `npm run build`, the generated structure will be:

```
dist/
├── index.html                           # References below files
├── assets/
│   ├── index-{HASH}.js                 # Main JS bundle
│   ├── index-{HASH}.css                # Main CSS bundle
│   └── [other]-{HASH}.[ext]            # Other assets
```

The `{HASH}` is automatically generated based on file contents, ensuring:
- ✅ Cache busting when files change
- ✅ Consistent references between builds
- ✅ No 404 errors from stale links

## GitHub Pages Setup

The app is configured to deploy to: `https://username.github.io/HTML_Practice/`

Base path in `vite.config.ts`: `base: '/HTML_Practice/'`

This ensures all asset references use the correct path:
- `/HTML_Practice/assets/index-{HASH}.js`
- `/HTML_Practice/assets/index-{HASH}.css`

## Troubleshooting 404 Errors

If you see 404 errors for assets:

1. **Rebuild locally:**
   ```bash
   npm run build
   ```

2. **Verify index.html:**
   ```bash
   cat dist/index.html
   ```
   Check that the script and link tags reference existing files in `dist/assets/`

3. **Push the rebuilt dist/ (temporary):**
   ```bash
   git add dist/
   git commit -m "Update build artifacts"
   git push
   ```

4. **Or remove dist/ from git:**
   ```bash
   git rm -r --cached dist/
   echo "dist/" >> .gitignore
   git add .gitignore
   git commit -m "Stop tracking dist folder"
   git push
   ```

## Environment Variables

Create a `.env` file (not committed) with:
```
VITE_SUPABASE_URL=your_url
VITE_SUPABASE_ANON_KEY=your_key
```

Vite automatically loads these as `import.meta.env.VITE_*`
