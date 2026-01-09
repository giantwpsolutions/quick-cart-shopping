# 📋 Quick Cart Shopping - WordPress.org Automation Setup

## ✅ Status: COMPLETE & READY TO USE

Everything has been set up and committed to your repository!

## 📦 What Was Created

```
.github/workflows/
├── deploy-plugin.yml              ← Main WordPress.org deployment
└── update-assets-readme.yml       ← Asset updates

.distignore                         ← Distribution exclusions (dist/ INCLUDED!)

Documentation:
├── AUTOMATION_SETUP_COMPLETE.md   ← You are here
├── WORDPRESS_ORG_DEPLOYMENT.md    ← Detailed setup guide
└── RELEASE_CHECKLIST.md           ← Quick reference
```

## 🚀 How to Use It

### Phase 1: GitHub Secrets Setup (You Do This)
⏱️ **Time:** 2-3 minutes

1. Go to GitHub repository → Settings → Secrets and variables → Actions
2. Click "New repository secret"

**Add Secret 1: SVN_USERNAME**
```
Name: SVN_USERNAME
Value: your-wordpress-org-username
```

**Add Secret 2: SVN_PASSWORD**
```
Name: SVN_PASSWORD
Value: your-wordpress-org-password-or-app-password
```

**Add Secret 3: G_TOKEN**
```
Name: G_TOKEN
Value: your-github-personal-access-token
```

💡 **Get G_TOKEN:**
- Go to: https://github.com/settings/tokens/new
- Give it a name like "WordPress Deploy"
- Select scopes: `repo`, `public_repo`, `workflow`
- Generate and copy the token

### Phase 2: Create Your First Release (You Do This)
⏱️ **Time:** 2-3 minutes

**Before releasing, ensure versions match:**

File 1: `quick-cart-shopping.php` (line ~16)
```php
* Version: 1.0.2
```

File 2: `readme.txt` (line ~4)
```
Stable tag: 1.0.2
```

**Then create release:**

**Option A: Command line (recommended)**
```bash
git tag -a v1.0.2 -m "Version 1.0.2"
git push origin v1.0.2
```

**Option B: GitHub Web UI**
- Go to Releases → "Create a new release"
- Tag: `v1.0.2`
- Title: `Version 1.0.2 - Your Release Notes`
- Publish

### Phase 3: Automation Takes Over! 🎉
⏱️ **Time:** 1-2 minutes (automated)

1. Automation detects your release
2. Builds Vue assets: `npm run build`
3. Installs Composer packages
4. Deploys to WordPress.org SVN
5. Uploads ZIP to GitHub release

✅ Your plugin is now live on WordPress.org!

## 📊 Deployment Flow Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│ You Create Release v1.0.2                                       │
│ (GitHub → Releases → Publish)                                   │
└──────────────────────┬──────────────────────────────────────────┘
                       │
                       ↓
┌─────────────────────────────────────────────────────────────────┐
│ GitHub Actions Detects Release Published                        │
│ Triggers: deploy-plugin.yml                                     │
└──────────────────────┬──────────────────────────────────────────┘
                       │
        ┌──────────────┼──────────────┐
        ↓              ↓              ↓
    ┌────────┐    ┌─────────┐    ┌──────────┐
    │ npm    │    │composer │    │WordPress │
    │run     │    │install  │    │.org SVN  │
    │build   │    │--no-dev │    │Deploy    │
    └────────┘    └─────────┘    └──────────┘
        │              │              │
        └──────────────┼──────────────┘
                       ↓
┌─────────────────────────────────────────────────────────────────┐
│ ✅ Plugin Live on WordPress.org!                                │
│ ✅ ZIP Uploaded to GitHub Release                               │
│ ✅ Users can download and install                               │
└─────────────────────────────────────────────────────────────────┘
```

## 🎯 Key Features

✅ **Automatic Builds**
- Runs `npm run build` automatically
- Includes `dist/` folder in deployment
- No manual build needed!

✅ **Smart Distribution**
- Only includes necessary files (via `.distignore`)
- Excludes dev dependencies, source code, configs
- Smaller, faster downloads for users

✅ **Asset Updates**
- Update banners, icons, screenshots anytime
- Just push to main with `.wordpress-org/` changes
- No release needed for static assets

✅ **GitHub Releases**
- Automatic ZIP file creation
- Stored as GitHub release assets
- Users can download from both WordPress.org and GitHub

✅ **Zero Manual Work**
- After setup, just push code and create releases
- Everything else is automated!

## 📝 Version Management

Must be identical (e.g., all "1.0.2"):

| File | Location | Example |
|------|----------|---------|
| quick-cart-shopping.php | Line ~16 | `* Version: 1.0.2` |
| readme.txt | Line ~4 | `Stable tag: 1.0.2` |
| Git tag | When releasing | `v1.0.2` |

⚠️ **Mismatch = Problems!** Double-check all three before releasing.

## 📂 What Gets Deployed

**Included in WordPress.org distribution:**
```
✅ dist/              (Built Vue assets - YOUR CUSTOMIZATION!)
✅ apps/              (PHP code)
✅ assets/            (Images, static files)
✅ languages/         (Translations)
✅ vendor/            (Composer packages)
✅ *.php              (Plugin files)
✅ readme.txt         (Plugin readme)
```

**Excluded (via .distignore):**
```
❌ src/               (Vue source code)
❌ node_modules/      (Dev dependencies)
❌ .github/           (Workflows)
❌ Vite/Webpack configs
❌ Build tools
```

The key customization: Your built `dist/` folder IS included! Unlike primekit-addons which excludes it, your plugin needs it for production.

## 🔐 Security

✅ Secrets are encrypted
✅ Only repository admins see values
✅ Tokens are scoped and limited
✅ No sensitive data in logs
✅ Use app-specific passwords for 2FA

## 🐛 Troubleshooting

### "Deployment failed"
- ✅ Check GitHub Actions log
- ✅ Verify SVN_USERNAME and SVN_PASSWORD
- ✅ Ensure versions match all 3 files

### "dist/ folder not included"
- ✅ Check `.distignore` - should NOT list `dist/`
- ✅ Verify `npm run build` completes successfully
- ✅ Check workflow logs for build errors

### "Plugin not showing on WordPress.org"
- ✅ Check WordPress.org dashboard
- ✅ Verify version in readme.txt matches release
- ✅ Wait 5-10 minutes for sync

### "Assets not updating"
- ✅ Ensure files are in `.wordpress-org/`
- ✅ Push to main branch (not another branch)
- ✅ Check workflow ran successfully

## 📚 Documentation Files

| File | Purpose |
|------|---------|
| `AUTOMATION_SETUP_COMPLETE.md` | You are reading this! Complete overview. |
| `WORDPRESS_ORG_DEPLOYMENT.md` | Detailed technical guide with all setup steps. |
| `RELEASE_CHECKLIST.md` | Quick reference for creating releases. |

## ✨ Next Steps

1. ✅ **Add GitHub Secrets** (2-3 minutes)
   - SVN_USERNAME
   - SVN_PASSWORD
   - G_TOKEN

2. ✅ **Create First Release** (2-3 minutes)
   - Update version numbers
   - Create release tag
   - Publish release

3. ✅ **Watch Automation** (1-2 minutes)
   - Check Actions tab
   - See real-time logs
   - Enjoy your live plugin! 🎉

## 🎓 Example Release Workflow

```bash
# Step 1: Update versions in files
# - quick-cart-shopping.php: * Version: 1.0.3
# - readme.txt: Stable tag: 1.0.3

# Step 2: Commit
git add -A
git commit -m "Release: v1.0.3 - Bug fixes and improvements"

# Step 3: Push
git push origin main

# Step 4: Tag and push tag
git tag -a v1.0.3 -m "Version 1.0.3"
git push origin v1.0.3

# Step 5: GitHub automatically:
# - Detects release
# - Builds dist folder
# - Deploys to WordPress.org
# - Creates release page
# - 🎉 Live on WordPress.org!

# Step 6: Monitor
# Go to GitHub Actions tab and watch the magic happen!
```

## 🏆 Summary

| Aspect | Status |
|--------|--------|
| GitHub Workflows | ✅ Created & configured |
| .distignore | ✅ Created (dist/ included) |
| Documentation | ✅ Complete & comprehensive |
| Ready to Use | ✅ Yes! |
| Remaining Work | You add secrets + create release |

---

## 🎉 You're All Set!

Everything is ready. Just:
1. Add the 3 GitHub Secrets
2. Create your first release
3. Let automation do the rest!

Happy releasing! 🚀

**Questions?** Check `WORDPRESS_ORG_DEPLOYMENT.md` for detailed steps.
