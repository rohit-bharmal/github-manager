# 🚀 GitHub Manager

A modern, responsive web application for managing GitHub repositories, pull requests, and issues. Built with Vue 3, TypeScript, and beautiful gradient styling.

![GitHub Manager](https://img.shields.io/badge/Vue.js-3.5-4FC08D?style=for-the-badge&logo=vue.js&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-5.8-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-7.0-646CFF?style=for-the-badge&logo=vite&logoColor=white)

## ✨ Features

- 🔍 **Search GitHub Users** - Explore any user's public repositories and contributions
- 📁 **Repository Management** - View public repos with detailed stats, languages, and metadata
- 🔄 **Pull Request Tracking** - See all public PRs across repositories, including upstream contributions
- 🐛 **Issue Management** - Browse and filter public issues by status
- 🎨 **Beautiful UI** - Modern design with gradients, animations, and dark mode
- 📱 **Responsive Design** - Works perfectly on desktop, tablet, and mobile
- ⚡ **Fast Performance** - Built with Vite for lightning-fast development and builds
- 🌐 **No Authentication Required** - Access public GitHub data without tokens

## 🛠️ Technology Stack

- **Frontend**: Vue 3 with Composition API
- **Language**: TypeScript
- **Build Tool**: Vite
- **Styling**: Custom CSS with CSS Variables
- **API**: GitHub REST API v3 (Public endpoints)
- **Deployment**: GitHub Pages via GitHub Actions

## 🚀 Quick Start

### Prerequisites

- Node.js 20+
- npm or yarn

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

3. **Start development server**

   ```bash
   npm run dev
   ```

4. **Open your browser**
   Navigate to `http://localhost:5173`

## 🌐 GitHub API Usage

This application uses GitHub's public API endpoints without authentication, which means:

- ✅ **No token required** - Works immediately without setup
- ✅ **Access to public repositories** - View all public repos, issues, and PRs
- ⚠️ **Rate limited** - 60 requests per hour per IP address
- ⚠️ **Public data only** - Cannot access private repositories or user-specific data

### Rate Limiting

The GitHub API allows 60 requests per hour for unauthenticated requests. The app is designed to be efficient with API calls, but if you hit the rate limit, you'll need to wait before making more requests.

## 📦 Deployment

### Automatic Deployment with GitHub Actions

This project includes a GitHub Actions workflow that automatically deploys to GitHub Pages when you push to the main branch.

#### Setup Instructions:

1. **Enable GitHub Pages**

   - Go to your repository settings
   - Scroll to "Pages" section
   - Set source to "GitHub Actions"

2. **Push to main branch**

   ```bash
   git push origin main
   ```

3. **Monitor deployment**
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

- All public PRs authored by the user
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
- [ ] Enhanced caching to work within rate limits
- [ ] Team collaboration features
- [ ] Export functionality

## 🔗 Links

- [Live Demo](https://rohit-bharmal.github.io/github-manager/)
- [GitHub Repository](https://github.com/rohit-bharmale/github-manager)
- [Report Issues](https://github.com/rohit-bharmal/github-manager/issues)

## ⭐ Show Your Support

Give a ⭐️ if this project helped you!

---

Built with ❤️ using Vue 3 and TypeScript
