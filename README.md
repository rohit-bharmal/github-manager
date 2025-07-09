# 🚀 GitHub Manager

A modern, responsive web application for managing GitHub repositories, pull requests, and issues. Built with Vue 3, TypeScript, and beautiful gradient styling.

![GitHub Manager](https://img.shields.io/badge/Vue.js-3.5-4FC08D?style=for-the-badge&logo=vue.js&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-5.8-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-7.0-646CFF?style=for-the-badge&logo=vite&logoColor=white)

## ✨ Features

- 🔍 **Search GitHub Users** - Explore any user's repositories and contributions
- 📁 **Repository Management** - View repos with detailed stats, languages, and metadata
- 🔄 **Pull Request Tracking** - See all your PRs across repositories, including upstream contributions
- 🐛 **Issue Management** - Browse and filter issues by status
- 🎨 **Beautiful UI** - Modern design with gradients, animations, and dark mode
- 📱 **Responsive Design** - Works perfectly on desktop, tablet, and mobile
- ⚡ **Fast Performance** - Built with Vite for lightning-fast development and builds

## 🛠️ Technology Stack

- **Frontend**: Vue 3 with Composition API
- **Language**: TypeScript
- **Build Tool**: Vite
- **Styling**: Custom CSS with CSS Variables
- **API**: GitHub REST API v3
- **Deployment**: GitHub Pages via GitHub Actions

## 🚀 Quick Start

### Prerequisites

- Node.js 20+
- npm or yarn
- GitHub Personal Access Token

### Local Development

1. **Clone the repository**

   ```bash
   git clone https://github.com/rohit-bharmal/github-manager.git
   cd github-manager
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Set up environment variables**

   ```bash
   cp .env.example .env
   ```

   Edit `.env` and add your GitHub token:

   ```env
   VITE_GITHUB_TOKEN=your_github_personal_access_token_here
   ```

4. **Start development server**

   ```bash
   npm run dev
   ```

5. **Open your browser**
   Navigate to `http://localhost:5173`

## 🔑 GitHub Token Setup

### Creating a Personal Access Token

1. Go to [GitHub Settings > Developer settings > Personal access tokens](https://github.com/settings/tokens)
2. Click "Generate new token (classic)"
3. Give it a descriptive name like "GitHub Manager App"
4. Select the following scopes:
   - `public_repo` - Access public repositories
   - `read:user` - Read user profile information
   - `read:org` - Read organization membership (optional)
5. Click "Generate token"
6. **Copy the token immediately** (you won't see it again!)

### For Local Development

Create a `.env` file in the project root:

```env
VITE_GITHUB_TOKEN=ghp_your_token_here
```

### For Production Deployment

The app uses GitHub Actions for automatic deployment. The workflow will use repository secrets for the GitHub token.

## 📦 Deployment

### Automatic Deployment with GitHub Actions

This project includes a GitHub Actions workflow that automatically deploys to GitHub Pages when you push to the main branch.

#### Setup Instructions:

1. **Enable GitHub Pages**

   - Go to your repository settings
   - Scroll to "Pages" section
   - Set source to "GitHub Actions"

2. **Add Repository Secrets** (Optional - uses GITHUB_TOKEN by default)

   - Go to repository Settings > Secrets and variables > Actions
   - Add `VITE_GITHUB_TOKEN` with your personal access token value

3. **Push to main branch**

   ```bash
   git push origin main
   ```

4. **Monitor deployment**
   - Check the "Actions" tab in your repository
   - Your app will be available at `https://your-username.github.io/github-manager/`

### Manual Deployment

```bash
# Build the project
npm run build

# Deploy to GitHub Pages (using gh-pages package)
npm install -g gh-pages
gh-pages -d dist
```

## 🎨 Customization

### Color Theme

The app uses CSS custom properties for easy theming. Edit `src/style.css` to customize colors:

```css
:root {
  --primary-color: #3b82f6;
  --secondary-color: #06b6d4;
  --accent-color: #f97316;
  /* ... more variables */
}
```

### Dark Mode

Dark mode is automatically supported with the same CSS variables. Toggle using the moon/sun icon in the header.

## 🔧 Configuration

### Environment Variables

| Variable            | Description                  | Required |
| ------------------- | ---------------------------- | -------- |
| `VITE_GITHUB_TOKEN` | GitHub Personal Access Token | Yes      |

### Build Configuration

The app is configured in `vite.config.ts`. Key settings:

- **Base URL**: Automatically set for GitHub Pages
- **Build Output**: `dist/` directory
- **Assets**: Organized in `assets/` subdirectory

## 📊 Features Overview

### Repository View

- Grid layout of user repositories
- Filter and sort capabilities
- Repository statistics (stars, forks, language)
- Direct links to GitHub

### Pull Requests View

- All PRs authored by the user
- Includes upstream repository contributions
- Status filtering (open, closed, merged)
- Repository context for each PR

### Repository Details

- Issues and PRs for specific repositories
- Tabbed interface for easy navigation
- State filtering for issues and PRs
- Direct links to GitHub issues/PRs

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🎯 Roadmap

- [ ] Advanced filtering and search
- [ ] Repository bookmarking
- [ ] Notification system for PR updates
- [ ] GitHub Apps integration
- [ ] Team collaboration features
- [ ] Export functionality

## 🔗 Links

- [Live Demo](https://your-username.github.io/github-manager/)
- [GitHub Repository](https://github.com/your-username/github-manager)
- [Report Issues](https://github.com/your-username/github-manager/issues)

## ⭐ Show Your Support

Give a ⭐️ if this project helped you!

---

Built with ❤️ using Vue 3 and TypeScript
