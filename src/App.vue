<script setup lang="ts">
import { ref } from 'vue'
import RepoList from './components/RepoList.vue'

const sidebarOpen = ref(false)
const isDark = ref(false)

function toggleTheme() {
  isDark.value = !isDark.value
  document.documentElement.setAttribute('data-theme', isDark.value ? 'dark' : 'light')
}
</script>

<template>
  <div class="app">
    <header class="header">
      <nav class="navbar">
        <div class="nav-brand">
          <h1 class="nav-title">
            <span class="github-icon">⚡</span>
            GitHub Manager
          </h1>
        </div>
        <div class="nav-actions">
          <button class="theme-btn" @click="toggleTheme">
            {{ isDark ? '☀️' : '🌙' }}
          </button>
        </div>
      </nav>
    </header>

    <aside class="sidebar" :class="{ open: sidebarOpen }">
      <nav class="sidebar-nav">
        <a href="#" class="nav-item active">
          <span class="nav-icon">📊</span>
          Dashboard
        </a>
        <a href="#" class="nav-item">
          <span class="nav-icon">📁</span>
          Repositories
        </a>
        <a href="#" class="nav-item">
          <span class="nav-icon">👤</span>
          Profile
        </a>
      </nav>
      <div class="sidebar-footer">
        <button class="logout-btn">
          <span class="nav-icon">🚪</span>
          Logout
        </button>
      </div>
    </aside>


    <main class="main-content">
      <div class="container">
        <RepoList />
      </div>
    </main>

    <footer class="footer">
      <div class="container">
        <p>&copy; 2025 GitHub Manager - Built for you!</p>
      </div>
    </footer>
  </div>
</template>

<style scoped>
.app {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.header {
  background: var(--gradient-primary);
  color: white;
  position: sticky;
  top: 0;
  z-index: 100;
  box-shadow: 0 4px 16px rgba(59, 130, 246, 0.3);
}

.navbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1rem 2rem;
  max-width: 1200px;
  margin: 0 auto;
}

.nav-brand {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.menu-btn {
  background: none;
  border: none;
  color: white;
  cursor: pointer;
  padding: 0.5rem;
  border-radius: 4px;
  transition: background-color 0.2s;
}

.menu-btn:hover {
  background: rgba(255, 255, 255, 0.1);
}

.hamburger {
  display: block;
  width: 20px;
  height: 2px;
  background: white;
  position: relative;
}

.hamburger::before,
.hamburger::after {
  content: '';
  position: absolute;
  width: 100%;
  height: 2px;
  background: white;
  transition: 0.3s;
}

.hamburger::before {
  top: -6px;
}

.hamburger::after {
  top: 6px;
}

.nav-title {
  margin: 0;
  font-size: 1.5rem;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.github-icon {
  font-size: 1.8rem;
}

.nav-actions {
  display: flex;
  gap: 1rem;
}

.theme-btn {
  background: none;
  border: none;
  color: white;
  font-size: 1.2rem;
  cursor: pointer;
  padding: 0.5rem;
  border-radius: 4px;
  transition: background-color 0.2s;
}

.theme-btn:hover {
  background: rgba(255, 255, 255, 0.1);
}

.sidebar {
  position: fixed;
  top: 0;
  left: -280px;
  width: 280px;
  height: 100vh;
  background: white;
  border-right: 1px solid #e5e7eb;
  transition: left 0.3s ease;
  z-index: 200;
  display: flex;
  flex-direction: column;
  padding-top: 80px;
}

.sidebar.open {
  left: 0;
}

.sidebar-nav {
  flex: 1;
  padding: 2rem 0;
}

.nav-item {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem 2rem;
  color: #374151;
  text-decoration: none;
  transition: background-color 0.2s;
}

.nav-item:hover {
  background: #f3f4f6;
}

.nav-item.active {
  background: linear-gradient(135deg, rgba(59, 130, 246, 0.1) 0%, rgba(6, 182, 212, 0.1) 100%);
  color: var(--primary-color);
  border-right: 3px solid var(--primary-color);
}

.nav-icon {
  font-size: 1.2rem;
}

.sidebar-footer {
  padding: 2rem;
  border-top: 1px solid #e5e7eb;
}

.logout-btn {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  width: 100%;
  padding: 0.75rem;
  background: none;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  color: #374151;
  cursor: pointer;
  transition: all 0.2s;
}

.logout-btn:hover {
  background: #f9fafb;
  border-color: #9ca3af;
}

.sidebar-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0, 0, 0, 0.5);
  z-index: 150;
  opacity: 0;
  visibility: hidden;
  transition: all 0.3s ease;
}

.sidebar-overlay.visible {
  opacity: 1;
  visibility: visible;
}

.main-content {
  flex: 1;
  padding: 2rem 0;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 2rem;
}

.footer {
  background: #f8fafc;
  border-top: 1px solid #e5e7eb;
  padding: 1.5rem 0;
  text-align: center;
}

.footer p {
  margin: 0;
  color: #6b7280;
  font-size: 0.875rem;
}

/* Dark theme styles */
[data-theme="dark"] .sidebar {
  background: #1f2937;
  border-right-color: #374151;
}

[data-theme="dark"] .nav-item {
  color: #d1d5db;
}

[data-theme="dark"] .nav-item:hover {
  background: #374151;
}

[data-theme="dark"] .nav-item.active {
  background: linear-gradient(135deg, rgba(96, 165, 250, 0.2) 0%, rgba(34, 211, 238, 0.2) 100%);
  color: var(--primary-color);
}

[data-theme="dark"] .sidebar-footer {
  border-top-color: #374151;
}

[data-theme="dark"] .logout-btn {
  border-color: #4b5563;
  color: #d1d5db;
}

[data-theme="dark"] .logout-btn:hover {
  background: #374151;
  border-color: #6b7280;
}

[data-theme="dark"] .footer {
  background: #1f2937;
  border-top-color: #374151;
}

[data-theme="dark"] .footer p {
  color: #9ca3af;
}

@media (max-width: 768px) {
  .navbar {
    padding: 1rem;
  }

  .nav-title {
    font-size: 1.25rem;
  }

  .container {
    padding: 0 1rem;
  }

  .main-content {
    padding: 1rem 0;
  }
}
</style>
