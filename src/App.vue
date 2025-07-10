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
  background: var(--surface);
  color: var(--text-color);
  position: sticky;
  top: 0;
  z-index: 1000;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  border-bottom: 1px solid var(--border);
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
  color: var(--text-color);
  cursor: pointer;
  padding: 0.5rem;
  border-radius: 4px;
  transition: background-color 0.2s;
}

.menu-btn:hover {
  background: var(--surface-hover);
}

.hamburger {
  display: block;
  width: 20px;
  height: 2px;
  background: var(--text-color);
  position: relative;
}

.hamburger::before,
.hamburger::after {
  content: '';
  position: absolute;
  width: 100%;
  height: 2px;
  background: var(--text-color);
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
  color: var(--text-color);
  font-size: 1.2rem;
  cursor: pointer;
  padding: 0.5rem;
  border-radius: 4px;
  transition: background-color 0.2s;
}

.theme-btn:hover {
  background: var(--surface-hover);
}

.sidebar {
  position: fixed;
  top: 0;
  left: -280px;
  width: 280px;
  height: 100vh;
  background: var(--surface);
  border-right: 1px solid var(--border);
  transition: left 0.3s ease;
  z-index: 999;
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
  color: var(--text-color);
  text-decoration: none;
  transition: background-color 0.2s;
}

.nav-item:hover {
  background: var(--surface-hover);
}

.nav-item.active {
  background: rgba(9, 105, 218, 0.1);
  color: var(--primary-color);
  border-right: 3px solid var(--primary-color);
}

.nav-icon {
  font-size: 1.2rem;
}

.sidebar-footer {
  padding: 2rem;
  border-top: 1px solid var(--border);
}

.logout-btn {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  width: 100%;
  padding: 0.75rem;
  background: none;
  border: 1px solid var(--border);
  border-radius: 6px;
  color: var(--text-color);
  cursor: pointer;
  transition: all 0.2s;
}

.logout-btn:hover {
  background: var(--surface-hover);
  border-color: var(--border-muted);
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
  margin-top: 0;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 2rem;
}

.footer {
  background: var(--surface);
  border-top: 1px solid var(--border);
  padding: 1.5rem 0;
  text-align: center;
}

.footer p {
  margin: 0;
  color: var(--text-secondary);
  font-size: 0.875rem;
}

/* Dark theme styles */
[data-theme="dark"] .sidebar {
  background: var(--surface);
  border-right-color: var(--border);
}

[data-theme="dark"] .nav-item {
  color: var(--text-color);
}

[data-theme="dark"] .nav-item:hover {
  background: var(--surface-hover);
}

[data-theme="dark"] .nav-item.active {
  background: rgba(88, 166, 255, 0.15);
  color: var(--primary-color);
}

[data-theme="dark"] .sidebar-footer {
  border-top-color: var(--border);
}

[data-theme="dark"] .logout-btn {
  border-color: var(--border);
  color: var(--text-color);
}

[data-theme="dark"] .logout-btn:hover {
  background: var(--surface-hover);
  border-color: var(--border-muted);
}

[data-theme="dark"] .footer {
  background: var(--surface);
  border-top-color: var(--border);
}

[data-theme="dark"] .footer p {
  color: var(--text-secondary);
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
    margin-top: 0;
  }
}
</style>
