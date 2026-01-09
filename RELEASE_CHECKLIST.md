# Quick Reference: WordPress.org Release Checklist

## Before Creating a Release

### 1. Version Numbers (Must Match!)
- [ ] Update `quick-cart-shopping.php` line ~16:
  ```php
  * Version: X.Y.Z
  ```
- [ ] Update `readme.txt` line ~4:
  ```
  Stable tag: X.Y.Z
  ```

### 2. Build & Test
- [ ] Run: `npm run build`
- [ ] Run: `composer install --prefer-dist --no-dev`
- [ ] Test plugin locally in WordPress

### 3. Commit Changes
```bash
git add -A
git commit -m "Release: v1.0.2 - Description"
```

### 4. Git Push
```bash
git push origin main
```

## Creating the Release

### Via Command Line (Recommended)
```bash
# Create and push tag
git tag -a v1.0.2 -m "Version 1.0.2"
git push origin v1.0.2
```

### Via GitHub Web UI
1. Go to "Releases"
2. Click "Create a new release"
3. Tag: `v1.0.2`
4. Title: `Version 1.0.2 - Your Release Notes`
5. Description: Add changelog
6. Click "Publish release"

## Automation Takes Over

Once you publish the release:
1. ⏳ Wait 1-2 minutes
2. 📊 Check GitHub Actions tab for progress
3. ✅ Plugin goes live on WordPress.org!

## What Gets Deployed

✅ `dist/` - Your built Vue assets  
✅ `apps/` - PHP code  
✅ `assets/` - Images/static files  
✅ `languages/` - Translation files  
✅ `vendor/` - Composer packages  
✅ Plugin files (`.php`)  
✅ `readme.txt`  

❌ `src/` - Source code  
❌ `node_modules/` - Dev dependencies  
❌ `.github/` - Workflows  
❌ Build configs (Vite, Webpack, etc.)  

## Required GitHub Secrets

✅ **SVN_USERNAME** - WordPress.org username  
✅ **SVN_PASSWORD** - WordPress.org password  
✅ **G_TOKEN** - GitHub personal access token  

## Quick Troubleshooting

| Problem | Solution |
|---------|----------|
| Version mismatch | Update all 3 files (`.php`, `readme.txt`, git tag) |
| Deployment fails | Check SVN credentials |
| dist/ not included | Verify `.distignore` doesn't list `dist/` |
| Assets don't update | Push to main with `.wordpress-org/` changes |
| Long deploy time | Normal - can take 2-3 minutes for first deploy |

## Release History

Each release automatically:
- Creates a GitHub Release page
- Uploads ZIP file to GitHub
- Deploys to WordPress.org
- Updates plugin page

You can see all releases at:
`https://github.com/giantwpsolutions/quick-cart-shopping/releases`

---

**That's it!** Just push your code, create a release, and automation handles the rest. 🚀
