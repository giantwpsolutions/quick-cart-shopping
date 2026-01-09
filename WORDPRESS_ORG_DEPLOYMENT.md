# WordPress.org Release Automation Setup

## Overview

This setup uses GitHub Actions to automatically deploy your Quick Cart Shopping plugin to WordPress.org when you create a release on GitHub.

## Workflow Files Created

### 1. `.github/workflows/deploy-plugin.yml`
**Triggered:** When a release is published on GitHub
**Actions:**
- Checks out the code
- Installs Node.js dependencies
- Builds Vue assets (npm run build) - **Important: This creates the dist folder**
- Installs PHP dependencies via Composer
- Deploys to WordPress.org SVN repository
- Uploads the built ZIP file as a release asset on GitHub

**Key Features:**
- ✅ Includes `npm run build` to generate production assets
- ✅ Uses dist folder (included in distribution)
- ✅ Generates ZIP file for GitHub release
- ✅ Supports Composer dependencies

### 2. `.github/workflows/update-assets-readme.yml`
**Triggered:** Push to main branch when `.wordpress-org/` or `readme.txt` changes
**Actions:**
- Updates plugin banners, icons, and screenshots on WordPress.org
- Updates readme.txt on WordPress.org
- No rebuild needed - static file updates only

## .distignore File (Customized)

The `.distignore` file tells the deploy action which files to EXCLUDE from the WordPress.org distribution package.

**Key Customization for Quick Cart Shopping:**
- ✅ **INCLUDES `dist/`** - Your built Vue assets ARE deployed
- ❌ **EXCLUDES `src/`** - Source files not needed
- ❌ **EXCLUDES `node_modules/`** - Dev dependencies not needed
- ❌ **EXCLUDES build tools** - Vite config, Tailwind config, etc.

This means WordPress.org will receive:
```
quick-cart-shopping/
├── apps/                  (PHP code)
├── assets/                (images, css, js)
├── dist/                  ✅ INCLUDED (production built files)
├── languages/             (translations)
├── vendor/                (Composer packages)
├── quick-cart-shopping.php
├── readme.txt
└── .wordpress-org/        (not deployed, used for assets only)
```

## Setup Instructions

### Step 1: Set GitHub Secrets

Go to GitHub → Settings → Secrets and variables → Actions

Add these secrets:

1. **SVN_USERNAME**
   - Value: Your WordPress.org plugin directory username
   - Example: `your-username`

2. **SVN_PASSWORD**
   - Value: Your WordPress.org password
   - ⚠️ Use an application password if you have 2FA enabled

3. **G_TOKEN** (GitHub Token)
   - Generate at: https://github.com/settings/tokens
   - Scopes needed:
     - ✅ `repo` (full control of private repositories)
     - ✅ `public_repo` (access to public repositories)
     - ✅ `workflow` (update GitHub Action workflows)
   - Expiration: 90 days or longer
   - Note: Name it something like "WordPress Deploy Token"

### Step 2: Create a Release

On GitHub:
1. Go to your repository
2. Click "Releases" → "Create a new release"
3. Tag version: `v1.0.2` (must match version in plugin header)
4. Release title: `Version 1.0.2 - Feature Name`
5. Description: Add changelog/notes
6. Click "Publish release"

### Step 3: Monitor Deployment

The workflow will:
1. Check the "Actions" tab for real-time logs
2. Deploy to WordPress.org SVN (takes 1-2 minutes)
3. Upload ZIP to GitHub release

## File Structure Overview

```
quick-cart-shopping/
├── .github/
│   └── workflows/
│       ├── deploy-plugin.yml           # Main deployment workflow
│       └── update-assets-readme.yml    # Asset/readme update workflow
├── .distignore                          # Distribution exclusions
├── .wordpress-org/                      # Plugin assets (banners, icons, screenshots)
│   ├── banner-1544x500.png
│   ├── icon-128x128.gif
│   └── screenshot-*.png
├── apps/                                # PHP code
├── assets/                              # Static assets
├── dist/                                # Built Vue assets (included!)
├── src/                                 # Vue source (excluded)
├── vendor/                              # Composer packages
├── quick-cart-shopping.php              # Main plugin file
└── readme.txt                           # Plugin readme
```

## Version Numbering

**Important:** Ensure consistency across these files:

1. **quick-cart-shopping.php** (Header comment)
   ```php
   * Version: 1.0.2
   ```

2. **readme.txt** (Header section)
   ```
   Stable tag: 1.0.2
   ```

3. **GitHub Release tag**
   ```
   v1.0.2
   ```

⚠️ These must match exactly or deployment may fail or show incorrect versions!

## Deployment Flow

```
You create release v1.0.2
         ↓
GitHub detects "release published" event
         ↓
Trigger: deploy-plugin.yml workflow
         ↓
1. Checkout code
2. npm ci (install Node deps)
3. npm run build (create dist/)
4. composer install --no-dev
5. Deploy to WordPress.org SVN
         ↓
Plugin live on WordPress.org! ✅
```

## Asset Updates

For banners, icons, or screenshots updates without creating a release:

1. Edit files in `.wordpress-org/`
2. Update `readme.txt` if needed
3. Push to main branch
4. The `update-assets-readme.yml` workflow runs automatically
5. WordPress.org updated! ✅

No rebuild needed - these are static file updates.

## Troubleshooting

### Deployment fails with "No route to host"
- Check SVN_USERNAME and SVN_PASSWORD are correct
- Ensure 2FA isn't blocking - use WordPress app password

### Version mismatch errors
- Verify all 3 files have matching versions
- Tag format should be `v1.0.2` (with 'v' prefix)

### dist/ folder not deployed
- Check `.distignore` - `dist/` should NOT be listed
- Check GitHub Actions log for build errors

### Assets not updating
- Verify files are in `.wordpress-org/` folder
- Confirm `readme.txt` also changed (triggers workflow)

## Security Notes

1. **GitHub Tokens** are scoped to releases only
2. **SVN Passwords** are encrypted in GitHub Secrets
3. Only repository admins can access these secrets
4. Consider using application-specific passwords for 2FA

## Future Releases

Once configured, every release follows this cycle:

```
Local Machine:
1. npm run build
2. Update version in quick-cart-shopping.php & readme.txt
3. git commit
4. git tag v1.0.3
5. git push origin main && git push origin v1.0.3

GitHub:
1. Open Releases
2. Create release from tag
3. Automation handles rest! ✅
```

## Next Steps

1. ✅ Push these files to GitHub: `.github/workflows/`, `.distignore`
2. ✅ Add GitHub Secrets: SVN_USERNAME, SVN_PASSWORD, G_TOKEN
3. ✅ Create your first release with matching version numbers
4. ✅ Monitor Actions tab for successful deployment

That's it! 🚀
