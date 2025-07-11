# 📦 Deployment Guide

This guide will walk you through deploying your GitHub Manager application to GitHub Pages using GitHub Actions.

## 🚀 Quick Setup (Recommended)

### Step 1: Enable GitHub Pages

1. Go to your repository on GitHub
2. Click on **Settings** tab
3. Scroll down to **Pages** section in the left sidebar
4. Under **Source**, select **GitHub Actions**
5. Save the settings

### Step 2: Deploy

1. Make sure your code is pushed to the `main` branch:

   ```bash
   git add .
   git commit -m "Ready for deployment"
   git push origin main
   ```

2. The deployment will start automatically!
3. Check the **Actions** tab to monitor progress
4. Once complete, your app will be available at:
   ```
   https://rohit-bharmal.github.io/github-manager/
   ```

## 🔧 Manual Deployment (Alternative)

If you prefer to deploy manually or to a different platform:

### Build the Project

```bash
# Install dependencies
npm install

# Build for production
npm run build
```

The built files will be in the `dist/` directory.

### Deploy to GitHub Pages Manually

```bash
# Install gh-pages globally
npm install -g gh-pages

# Deploy the dist folder
gh-pages -d dist
```

### Deploy to Other Platforms

The `dist/` folder contains static files that can be deployed to:

- **Netlify**: Drag and drop the `dist` folder
- **Vercel**: Connect your GitHub repo
- **Surge.sh**: `surge dist/`
- **Firebase Hosting**: `firebase deploy`

## 🔍 Troubleshooting

### Common Issues

#### 1. **Deployment Fails with "Resource not accessible by integration"**

**Solution**: Make sure GitHub Pages is set to "GitHub Actions" source, not "Deploy from branch".

#### 2. **App loads but API calls fail**

**Causes**:

- Missing or invalid GitHub token
- Token doesn't have required permissions

**Solutions**:

- Check that `VITE_GITHUB_TOKEN` secret is set correctly
- Verify token has `public_repo` and `read:user` scopes
- Generate a new token if needed

#### 3. **404 Error on GitHub Pages**

**Causes**:

- Incorrect base URL in Vite config
- Repository name doesn't match config

**Solution**:
Update `vite.config.ts`:

```typescript
export default defineConfig({
  base: "/your-actual-repo-name/",
  // ... rest of config
});
```

#### 4. **Build Fails with Node.js Version Error**

**Solution**: The workflow uses Node.js 20. Make sure your local development uses compatible versions.

### Checking Deployment Status

1. Go to **Actions** tab in your repository
2. Click on the latest workflow run
3. Expand the steps to see detailed logs
4. Look for any error messages in red

### Logs and Debugging

If deployment fails:

1. Check the **Actions** tab for error details
2. Common fixes:
   - Update Node.js version in workflow
   - Check package.json for correct scripts
   - Verify all dependencies are in package.json
   - Ensure no TypeScript errors

## 🌍 Custom Domain (Optional)

To use a custom domain:

1. Add a `CNAME` file to the `public/` directory:

   ```
   your-domain.com
   ```

2. Configure DNS with your domain provider:

   - Add a CNAME record pointing to `your-username.github.io`

3. In repository Settings > Pages, enter your custom domain

## 🔄 Updating Your Deployment

To update your deployed app:

1. Make changes to your code
2. Commit and push to `main` branch:
   ```bash
   git add .
   git commit -m "Update features"
   git push origin main
   ```
3. GitHub Actions will automatically rebuild and deploy

## 📊 Monitoring

### Performance

- Use browser dev tools to check load times
- Monitor GitHub API rate limits in browser console

### Analytics (Optional)

Add Google Analytics or similar by including the script in `index.html`.

## 🔐 Security Best Practices

1. **Never commit tokens to code**
2. **Use repository secrets for sensitive data**
3. **Regularly rotate personal access tokens**
4. **Use minimal required token permissions**
5. **Monitor token usage in GitHub settings**

## 📱 Testing Your Deployment

After deployment, test these features:

- [ ] Search for different GitHub users
- [ ] Switch between Repositories and PRs view
- [ ] Filter and sort repositories
- [ ] View repository details
- [ ] Check responsive design on mobile
- [ ] Test dark mode toggle
- [ ] Verify all links work correctly

---

Need help? [Open an issue](https://github.com/rohit-bharmal/github-manager/issues) or check the [main README](README.md) for more information.
