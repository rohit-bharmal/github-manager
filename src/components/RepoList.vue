<template>
  <div class="repo-list">
    <!-- User Search Section -->
    <div class="search-card">
      <div class="card-header">
        <h2 class="card-title">
          <span class="icon">🔍</span>
          Search GitHub User
        </h2>
      </div>
      <div class="card-content">
        <div class="search-form">
          <div class="input-group">
            <input v-model="username" type="text" placeholder="Enter GitHub username (e.g., octocat)"
              class="search-input" @keyup.enter="loadRepositories" :disabled="loading" />
            <button @click="loadRepositories" class="search-btn" :disabled="!username || loading">
              <span v-if="loading" class="spinner"></span>
              <span v-else class="icon">🔍</span>
              {{ loading ? 'Searching...' : 'Search User' }}
            </button>
          </div>

          <!-- View Toggle -->
          <div v-if="username && (repos.length > 0 || userAuthoredPRs.length > 0 || userReviewPRs.length > 0)"
            class="view-toggle">
            <button class="toggle-btn" :class="{ active: currentView === 'repos' }" @click="currentView = 'repos'">
              <span class="icon">📁</span>
              Repositories
              <span v-if="repos.length" class="count-badge">{{ repos.length }}</span>
            </button>
            <button class="toggle-btn" :class="{ active: currentView === 'prs' }" @click="currentView = 'prs'">
              <span class="icon">🔄</span>
              My PRs
              <span v-if="userAuthoredPRs.length" class="count-badge">{{ userAuthoredPRs.length }}</span>
            </button>
            <button class="toggle-btn" :class="{ active: currentView === 'reviews' }" @click="currentView = 'reviews'">
              <span class="icon">👀</span>
              PRs to Review
              <span v-if="userReviewPRs.length" class="count-badge">{{ userReviewPRs.length }}</span>
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Repositories Section -->
    <div v-if="username && repos.length > 0 && currentView === 'repos'" class="repos-card">
      <div class="card-header">
        <h2 class="card-title">
          <span class="icon">📁</span>
          Repositories for {{ username }}
          <span class="repo-count">{{ repos.length }} repos</span>
        </h2>
      </div>

      <!-- Filters and Sort -->
      <div class="card-content">
        <div class="filters">
          <div class="filter-group">
            <input v-model="searchQuery" type="text" placeholder="Filter repositories..." class="filter-input" />
          </div>
          <div class="filter-group">
            <select v-model="sortBy" class="filter-select">
              <option value="updated_at">Last Updated</option>
              <option value="name">Name</option>
              <option value="stargazers_count">Stars</option>
              <option value="forks_count">Forks</option>
              <option value="created_at">Created Date</option>
            </select>
          </div>
          <div class="filter-group">
            <select v-model="sortOrder" class="filter-select">
              <option value="desc">Descending</option>
              <option value="asc">Ascending</option>
            </select>
          </div>
        </div>

        <!-- Repository Grid -->
        <div class="repo-grid">
          <div v-for="repo in filteredAndSortedRepos" :key="repo.id" class="repo-card"
            :class="{ 'selected': selectedRepo?.id === repo.id }" @click="loadDetails(repo)">
            <div class="repo-header">
              <h3 class="repo-title">
                <span class="repo-icon">
                  {{ repo.private ? '🔒' : '📁' }}
                </span>
                {{ repo.name }}
              </h3>
            </div>

            <div class="repo-content">
              <p class="repo-description">
                {{ repo.description || 'No description available' }}
              </p>

              <div v-if="repo.language" class="repo-language">
                <span class="language-tag">{{ repo.language }}</span>
              </div>

              <div class="repo-stats">
                <div class="stat">
                  <span class="icon">⭐</span>
                  {{ repo.stargazers_count }}
                </div>
                <div class="stat">
                  <span class="icon">🍴</span>
                  {{ repo.forks_count }}
                </div>
                <div class="stat">
                  <span class="icon">📅</span>
                  {{ formatDate(repo.updated_at) }}
                </div>
              </div>
            </div>

            <div class="repo-actions">
              <a :href="repo.html_url" target="_blank" class="btn btn-outline" @click.stop>
                <span class="icon">🔗</span>
                View on GitHub
              </a>
              <button class="btn btn-primary">
                View Details
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- All User PRs Section -->
    <div v-if="username && userAuthoredPRs.length > 0 && currentView === 'prs'" class="user-prs-card">
      <div class="card-header">
        <h2 class="card-title">
          <span class="icon">🔄</span>
          My Pull Requests
          <span class="repo-count">{{ filteredUserPRs.length }} PRs</span>
        </h2>
      </div>

      <div class="card-content">
        <!-- Filter PRs -->
        <div class="pr-filters">
          <div class="pr-search-filter">
            <input v-model="prSearchQuery" type="text" placeholder="Search PRs by repository, title, or number..."
              class="filter-input pr-search-input" />
            <span class="search-icon">🔍</span>
          </div>
          <div class="state-filter">
            <select v-model="userPRState" class="filter-select">
              <option value="all">All States</option>
              <option value="open">Open</option>
              <option value="closed">Closed</option>
            </select>
          </div>
        </div>

        <!-- Loading State -->
        <div v-if="userPRsLoading" class="loading-skeleton">
          <div class="skeleton-item" v-for="i in 5" :key="i"></div>
        </div>

        <!-- User PRs List -->
        <div v-else class="user-prs-list">
          <div v-for="pr in filteredUserPRs" :key="pr.id" class="user-pr-item">
            <div class="pr-icon">
              <span class="status-icon" :class="pr.state">
                {{ pr.state === 'open' ? '🔄' : pr.pull_request?.merged_at ? '✅' : '❌' }}
              </span>
            </div>
            <div class="pr-content">
              <h4 class="pr-title">
                <a :href="pr.html_url" target="_blank">
                  {{ pr.title }}
                </a>
              </h4>
              <div class="pr-meta">
                <span class="repo-name">{{ pr.repository_url.split('/').slice(-2).join('/') }}</span>
                • {{ pr.state }} • #{{ pr.number }} • {{ formatDate(pr.created_at) }}
              </div>
            </div>
            <div class="pr-status">
              <span class="status-badge" :class="pr.pull_request?.merged_at ? 'merged' : pr.state">
                {{ pr.pull_request?.merged_at ? 'merged' : pr.state }}
              </span>
            </div>
          </div>
        </div>

        <!-- Empty State for User PRs -->
        <div v-if="!userPRsLoading && filteredUserPRs.length === 0" class="empty-state">
          <span class="empty-icon">🔄</span>
          <h3>No pull requests found</h3>
          <p>No PRs found matching the current filter.</p>
        </div>
      </div>
    </div>

    <!-- User Review PRs Section -->
    <div v-if="username && userReviewPRs.length > 0 && currentView === 'reviews'" class="user-prs-card">
      <div class="card-header">
        <h2 class="card-title">
          <span class="icon">👀</span>
          Pull Requests to Review
          <span class="repo-count">{{ filteredUserReviewPRs.length }} PRs</span>
        </h2>
      </div>

      <div class="card-content">
        <!-- Filter Review PRs -->
        <div class="pr-filters">
          <div class="pr-search-filter">
            <input v-model="reviewSearchQuery" type="text"
              placeholder="Search review PRs by repository, title, or number..." class="filter-input pr-search-input" />
            <span class="search-icon">🔍</span>
          </div>
          <div class="state-filter">
            <select v-model="userReviewPRState" class="filter-select">
              <option value="all">All States</option>
              <option value="open">Open</option>
              <option value="closed">Closed</option>
            </select>
          </div>
        </div>

        <!-- Loading State -->
        <div v-if="userReviewPRsLoading" class="loading-skeleton">
          <div class="skeleton-item" v-for="i in 5" :key="i"></div>
        </div>

        <!-- Review PRs List -->
        <div v-else class="user-prs-list">
          <div v-for="pr in filteredUserReviewPRs" :key="pr.id" class="user-pr-item review-pr-item">
            <div class="pr-icon">
              <span class="status-icon" :class="pr.state">
                {{ pr.state === 'open' ? '👀' : pr.pull_request?.merged_at ? '✅' : '❌' }}
              </span>
            </div>
            <div class="pr-content">
              <h4 class="pr-title">
                <a :href="pr.html_url" target="_blank">
                  {{ pr.title }}
                </a>
              </h4>
              <div class="pr-meta">
                <span class="repo-name">{{ pr.repository_url.split('/').slice(-2).join('/') }}</span>
                • {{ pr.state }} • #{{ pr.number }} • {{ formatDate(pr.created_at) }}
                • by {{ pr.user?.login }}
              </div>
            </div>
            <div class="pr-status">
              <span class="status-badge" :class="pr.pull_request?.merged_at ? 'merged' : pr.state">
                {{ pr.pull_request?.merged_at ? 'merged' : pr.state }}
              </span>
            </div>
          </div>
        </div>

        <!-- Empty State for Review PRs -->
        <div v-if="!userReviewPRsLoading && filteredUserReviewPRs.length === 0" class="empty-state">
          <span class="empty-icon">👀</span>
          <h3>No pull requests to review</h3>
          <p>No PRs found that need your review matching the current filter.</p>
        </div>
      </div>
    </div>

    <!-- Repository Details Section -->
    <div v-if="selectedRepo && currentView === 'repos'" class="details-card">
      <div class="card-header">
        <h2 class="card-title">
          <span class="icon">📂</span>
          {{ selectedRepo.name }} Details
        </h2>
        <button class="close-btn" @click="selectedRepo = null">
          <span class="icon">✕</span>
        </button>
      </div>

      <div class="tabs">
        <button class="tab-btn" :class="{ active: tab === 'issues' }" @click="tab = 'issues'">
          <span class="icon">🐛</span>
          Issues
          <span v-if="issues.length" class="tab-count">{{ issues.length }}</span>
        </button>
        <button class="tab-btn" :class="{ active: tab === 'prs' }" @click="tab = 'prs'">
          <span class="icon">🔄</span>
          Pull Requests
          <span v-if="prs.length" class="tab-count">{{ prs.length }}</span>
        </button>
      </div>

      <div class="card-content">
        <!-- Filters -->
        <div class="state-filter">
          <select v-if="tab === 'issues'" v-model="issueState" class="filter-select" @change="reloadDetails">
            <option value="all">All States</option>
            <option value="open">Open</option>
            <option value="closed">Closed</option>
          </select>
          <select v-else v-model="prState" class="filter-select" @change="reloadDetails">
            <option value="all">All States</option>
            <option value="open">Open</option>
            <option value="closed">Closed</option>
          </select>
        </div>

        <!-- Loading State -->
        <div v-if="detailsLoading" class="loading-skeleton">
          <div class="skeleton-item" v-for="i in 3" :key="i"></div>
        </div>

        <!-- Tab Content -->
        <div v-else class="tab-content">
          <!-- Issues Panel -->
          <div v-if="tab === 'issues'">
            <div v-if="filteredIssues.length" class="issue-list">
              <div v-for="issue in filteredIssues" :key="issue.id" class="issue-item">
                <div class="issue-icon">
                  <span class="status-icon" :class="issue.state">
                    {{ issue.state === 'open' ? '🐛' : '✅' }}
                  </span>
                </div>
                <div class="issue-content">
                  <h4 class="issue-title">
                    <a :href="issue.html_url" target="_blank">
                      {{ issue.title }}
                    </a>
                  </h4>
                  <div class="issue-meta">
                    {{ issue.state }} • #{{ issue.number }} • {{ formatDate(issue.created_at) }}
                  </div>
                </div>
                <div class="issue-status">
                  <span class="status-badge" :class="issue.state">
                    {{ issue.state }}
                  </span>
                </div>
              </div>
            </div>
            <div v-else class="empty-state">
              <span class="empty-icon">🐛</span>
              <h3>No issues found</h3>
              <p>This repository has no issues matching the current filter.</p>
            </div>
          </div>

          <!-- PRs Panel -->
          <div v-else>
            <div v-if="filteredPRs.length" class="pr-list">
              <div v-for="pr in filteredPRs" :key="pr.id" class="pr-item">
                <div class="pr-icon">
                  <span class="status-icon" :class="pr.state">
                    {{ pr.state === 'open' ? '🔄' : pr.merged ? '✅' : '❌' }}
                  </span>
                </div>
                <div class="pr-content">
                  <h4 class="pr-title">
                    <a :href="pr.html_url" target="_blank">
                      {{ pr.title }}
                    </a>
                  </h4>
                  <div class="pr-meta">
                    {{ pr.state }} • #{{ pr.number }} • {{ formatDate(pr.created_at) }}
                  </div>
                </div>
                <div class="pr-status">
                  <span class="status-badge" :class="pr.merged ? 'merged' : pr.state">
                    {{ pr.merged ? 'merged' : pr.state }}
                  </span>
                </div>
              </div>
            </div>
            <div v-else class="empty-state">
              <span class="empty-icon">🔄</span>
              <h3>No pull requests found</h3>
              <p>This repository has no pull requests matching the current filter.</p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Loading State for Repositories -->
    <div v-if="loading && username && currentView === 'repos'" class="loading-grid">
      <div class="skeleton-card" v-for="i in 6" :key="i">
        <div class="skeleton-header"></div>
        <div class="skeleton-content">
          <div class="skeleton-line"></div>
          <div class="skeleton-line short"></div>
        </div>
      </div>
    </div>

    <!-- Loading State for User PRs -->
    <div v-if="userPRsLoading && username && currentView === 'prs'" class="loading-skeleton">
      <div class="skeleton-item" v-for="i in 5" :key="i"></div>
    </div>

    <!-- Loading State for Review PRs -->
    <div v-if="userReviewPRsLoading && username && currentView === 'reviews'" class="loading-skeleton">
      <div class="skeleton-item" v-for="i in 5" :key="i"></div>
    </div>

    <!-- Error State -->
    <div v-if="error" class="error-alert">
      <div class="alert-content">
        <span class="alert-icon">⚠️</span>
        <div>
          <h4>Error</h4>
          <p>{{ error }}</p>
        </div>
      </div>
      <button class="alert-close" @click="error = null">✕</button>
    </div>

    <!-- Empty State for No Repositories -->
    <div v-if="!loading && username && repos.length === 0 && currentView === 'repos' && !error" class="empty-state">
      <span class="empty-icon">📁</span>
      <h3>No repositories found</h3>
      <p>User {{ username }} has no public repositories or doesn't exist.</p>
    </div>

    <!-- Empty State for No PRs -->
    <div v-if="!userPRsLoading && username && userAuthoredPRs.length === 0 && currentView === 'prs' && !error"
      class="empty-state">
      <span class="empty-icon">🔄</span>
      <h3>No pull requests found</h3>
      <p>User {{ username }} has no authored pull requests or they're not accessible.</p>
    </div>

    <!-- Empty State for No Review PRs -->
    <div v-if="!userReviewPRsLoading && username && userReviewPRs.length === 0 && currentView === 'reviews' && !error"
      class="empty-state">
      <span class="empty-icon">👀</span>
      <h3>No pull requests to review</h3>
      <p>User {{ username }} has no pull requests to review or they're not accessible.</p>
    </div>

    <!-- Welcome State -->
    <div v-if="!username" class="welcome-card">
      <div class="welcome-content">
        <span class="welcome-icon">⚡</span>
        <h2>Welcome to GitHub Manager</h2>
        <p>Enter a GitHub username above to explore their repositories, issues, and pull requests.</p>
      </div>
    </div>

    <!-- Back to Top Button -->
    <button v-if="showBackToTop" @click="scrollToTop" class="back-to-top-btn" aria-label="Back to top">
      <span class="back-to-top-icon">↑</span>
    </button>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { fetchRepos, fetchIssues, fetchAllPRsForRepo, fetchUserAuthoredPRs, fetchUserReviewPRs } from '../api/github'

// Reactive state
const username = ref('')
const repos = ref<any[]>([])
const selectedRepo = ref<any | null>(null)
const loading = ref(false)
const detailsLoading = ref(false)
const error = ref<string | null>(null)
const userPRsLoading = ref(false)
const userReviewPRsLoading = ref(false)
const showBackToTop = ref(false)

const issues = ref<any[]>([])
const prs = ref<any[]>([])
const userAuthoredPRs = ref<any[]>([])
const userReviewPRs = ref<any[]>([])

const searchQuery = ref('')
const prSearchQuery = ref('')
const reviewSearchQuery = ref('')
const sortBy = ref('updated_at')
const sortOrder = ref('desc')

const issueState = ref<'all' | 'open' | 'closed'>('all')
const prState = ref<'all' | 'open' | 'closed'>('all')
const tab = ref<'issues' | 'prs'>('issues')
const currentView = ref<'repos' | 'prs' | 'reviews'>('repos')

// Computed properties
const filteredAndSortedRepos = computed(() => {
  let filtered = repos.value

  // Filter by search query
  if (searchQuery.value) {
    filtered = filtered.filter(repo =>
      repo.name.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      (repo.description && repo.description.toLowerCase().includes(searchQuery.value.toLowerCase()))
    )
  }

  // Sort
  filtered.sort((a, b) => {
    let aVal = a[sortBy.value]
    let bVal = b[sortBy.value]

    if (typeof aVal === 'string') {
      aVal = aVal.toLowerCase()
      bVal = bVal.toLowerCase()
    }

    if (sortOrder.value === 'asc') {
      return aVal > bVal ? 1 : -1
    } else {
      return aVal < bVal ? 1 : -1
    }
  })

  return filtered
})

const filteredIssues = computed(() =>
  issueState.value === 'all' ? issues.value : issues.value.filter(i => i.state === issueState.value)
)

const filteredPRs = computed(() =>
  prState.value === 'all' ? prs.value : prs.value.filter(pr => pr.state === prState.value)
)

const userPRState = ref<'all' | 'open' | 'closed'>('all')
const userReviewPRState = ref<'all' | 'open' | 'closed'>('all')

const filteredUserPRs = computed(() => {
  let filtered = userAuthoredPRs.value

  // Filter by state
  if (userPRState.value !== 'all') {
    filtered = filtered.filter(pr => pr.state === userPRState.value)
  }

  // Filter by search query
  if (prSearchQuery.value) {
    const query = prSearchQuery.value.toLowerCase()
    filtered = filtered.filter(pr => {
      // Extract repository name from repository_url
      const repoName = pr.repository_url.split('/').slice(-2).join('/').toLowerCase()

      // Search in repository name, PR title, and PR number
      return (
        repoName.includes(query) ||
        pr.title.toLowerCase().includes(query) ||
        pr.number.toString().includes(query)
      )
    })
  }

  return filtered
})

const filteredUserReviewPRs = computed(() => {
  let filtered = userReviewPRs.value

  // Filter by state
  if (userReviewPRState.value !== 'all') {
    filtered = filtered.filter(pr => pr.state === userReviewPRState.value)
  }

  // Filter by search query
  if (reviewSearchQuery.value) {
    const query = reviewSearchQuery.value.toLowerCase()
    filtered = filtered.filter(pr => {
      // Extract repository name from repository_url
      const repoName = pr.repository_url.split('/').slice(-2).join('/').toLowerCase()

      // Search in repository name, PR title, and PR number
      return (
        repoName.includes(query) ||
        pr.title.toLowerCase().includes(query) ||
        pr.number.toString().includes(query)
      )
    })
  }

  return filtered
})

// Methods
async function loadRepositories() {
  if (!username.value) return

  loading.value = true
  error.value = null
  selectedRepo.value = null
  // Clear search queries when loading new user
  searchQuery.value = ''
  prSearchQuery.value = ''
  reviewSearchQuery.value = ''

  try {
    const [reposData] = await Promise.all([
      fetchRepos(username.value),
      loadUserAuthoredPRs(),
      loadUserReviewPRs()
    ])
    repos.value = reposData
  } catch (err: any) {
    error.value = err.response?.data?.message || 'Failed to fetch repositories'
    repos.value = []
  } finally {
    loading.value = false
  }
}

async function loadUserAuthoredPRs() {
  if (!username.value) return

  userPRsLoading.value = true
  try {
    userAuthoredPRs.value = await fetchUserAuthoredPRs(username.value)
  } catch (err: any) {
    console.error('Failed to fetch user authored PRs:', err)
    userAuthoredPRs.value = []
  } finally {
    userPRsLoading.value = false
  }
}

async function loadUserReviewPRs() {
  if (!username.value) return

  userReviewPRsLoading.value = true
  try {
    userReviewPRs.value = await fetchUserReviewPRs(username.value)
  } catch (err: any) {
    console.error('Failed to fetch user review PRs:', err)
    userReviewPRs.value = []
  } finally {
    userReviewPRsLoading.value = false
  }
}

async function loadDetails(repo: any) {
  selectedRepo.value = repo
  await reloadDetails()
}

async function reloadDetails() {
  if (!selectedRepo.value) return

  detailsLoading.value = true
  try {
    const [issuesData, prsData] = await Promise.all([
      fetchIssues(username.value, selectedRepo.value.name),
      fetchAllPRsForRepo(username.value, selectedRepo.value.name)
    ])

    issues.value = issuesData
    prs.value = prsData
  } catch (err: any) {
    error.value = 'Failed to fetch repository details'
  } finally {
    detailsLoading.value = false
  }
}

function formatDate(dateString: string) {
  return new Date(dateString).toLocaleDateString()
}

// Back to top functionality
function scrollToTop() {
  window.scrollTo({
    top: 0,
    behavior: 'smooth'
  })
}

function handleScroll() {
  showBackToTop.value = window.scrollY > 300
}

// Load initial data and setup scroll listener
onMounted(() => {
  loadRepositories()
  window.addEventListener('scroll', handleScroll)
})

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
})
</script>

<style scoped>
.repo-list {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

/* Card Styles */
.search-card,
.repos-card,
.details-card,
.welcome-card,
.user-prs-card {
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  overflow: hidden;
}

.card-header {
  background: var(--surface);
  color: var(--text-color);
  padding: 1.5rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-bottom: 1px solid var(--border);
}

.card-title {
  margin: 0;
  font-size: 1.25rem;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.repo-count {
  background: var(--surface-hover);
  border: 1px solid var(--border);
  padding: 0.25rem 0.75rem;
  border-radius: 12px;
  font-size: 0.875rem;
  margin-left: 1rem;
  color: var(--text-secondary);
}

.close-btn {
  background: var(--surface-hover);
  border: 1px solid var(--border);
  color: var(--text-secondary);
  width: 32px;
  height: 32px;
  border-radius: 6px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;
}

.close-btn:hover {
  background: var(--surface-hover);
  border-color: var(--border-muted);
  color: var(--text-color);
}

.card-content {
  padding: 1.5rem;
}

/* Search Form */
.search-form {
  max-width: 768px;
  margin: 0 auto;
}

.input-group {
  display: flex;
  gap: 1rem;
  align-items: center;
}

.search-input {
  flex: 1;
  padding: 0.75rem;
  border: 2px solid #e5e7eb;
  border-radius: 8px;
  font-size: 1rem;
  transition: border-color 0.2s;
}

.search-input:focus {
  outline: none;
  border-color: var(--primary-color);
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

.search-input:disabled {
  background: #f9fafb;
  color: #6b7280;
}

.search-btn {
  padding: 0.75rem 1.5rem;
  background: var(--primary-color);
  color: white;
  border: none;
  border-radius: 6px;
  font-weight: 500;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  transition: all 0.2s;
  white-space: nowrap;
}

.search-btn:hover:not(:disabled) {
  background: var(--primary-hover);
}

.search-btn:disabled {
  background: var(--text-muted);
  cursor: not-allowed;
}

.spinner {
  width: 16px;
  height: 16px;
  border: 2px solid transparent;
  border-top: 2px solid white;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

/* View Toggle */
.view-toggle {
  display: flex;
  gap: 0.5rem;
  margin-top: 1.5rem;
  padding-top: 1.5rem;
  border-top: 1px solid #e5e7eb;
}

.toggle-btn {
  flex: 1;
  padding: 0.75rem 1rem;
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: 6px;
  font-weight: 500;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  transition: all 0.2s;
  color: var(--text-secondary);
}

.toggle-btn:hover {
  background: var(--surface-hover);
  border-color: var(--border-muted);
}

.toggle-btn.active {
  background: var(--primary-color);
  border-color: var(--primary-color);
  color: white;
}

.count-badge {
  background: var(--surface-hover);
  border: 1px solid var(--border);
  padding: 0.125rem 0.5rem;
  border-radius: 10px;
  font-size: 0.75rem;
  font-weight: 500;
  color: var(--text-secondary);
}

.toggle-btn.active .count-badge {
  background: rgba(255, 255, 255, 0.2);
  border-color: rgba(255, 255, 255, 0.2);
  color: rgba(255, 255, 255, 0.9);
}

/* Filters */
.filters {
  display: grid;
  grid-template-columns: 2fr 1fr 1fr;
  gap: 1rem;
  margin-bottom: 2rem;
}

.filter-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.filter-input,
.filter-select {
  padding: 0.5rem;
  border: 1px solid var(--border);
  border-radius: 6px;
  font-size: 0.875rem;
  background: var(--surface);
  color: var(--text-color);
}

.filter-input:focus,
.filter-select:focus {
  outline: none;
  border-color: var(--primary-color);
  box-shadow: 0 0 0 3px rgba(9, 105, 218, 0.12);
}

.state-filter {
  margin-bottom: 1rem;
}

/* PR Filters */
.pr-filters {
  display: flex;
  gap: 1rem;
  margin-bottom: 1.5rem;
  align-items: center;
  flex-wrap: wrap;
}

.pr-search-filter {
  position: relative;
  flex: 1;
  min-width: 250px;
}

.pr-search-input {
  width: 100%;
  padding-right: 2.5rem;
  padding-left: 1rem;
  padding-top: 0.75rem;
  padding-bottom: 0.75rem;
  border: 2px solid #e5e7eb;
  border-radius: 8px;
  font-size: 0.875rem;
  transition: all 0.2s;
  background: white;
}

.pr-search-input:focus {
  outline: none;
  border-color: var(--primary-color);
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

.pr-search-input::placeholder {
  color: #9ca3af;
}

.search-icon {
  position: absolute;
  right: 0.75rem;
  top: 50%;
  transform: translateY(-50%);
  color: #9ca3af;
  font-size: 1rem;
  pointer-events: none;
}

.pr-filters .state-filter {
  margin-bottom: 0;
  min-width: 150px;
}

/* Repository Grid */
.repo-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 1.5rem;
}

.repo-card {
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: 6px;
  overflow: hidden;
  transition: all 0.2s;
  cursor: pointer;
  display: flex;
  flex-direction: column;
  height: 100%;
}

.repo-card:hover {
  border-color: var(--border-muted);
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.repo-card.selected {
  border-color: var(--primary-color);
  box-shadow: 0 0 0 2px rgba(9, 105, 218, 0.15);
}

.repo-header {
  padding: 1rem;
  background: var(--surface);
  border-bottom: 1px solid var(--border);
}

.repo-title {
  margin: 0;
  font-size: 1.125rem;
  font-weight: 600;
  color: var(--text-color);
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.repo-icon {
  font-size: 1.2rem;
}

.repo-content {
  padding: 1rem;
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.repo-description {
  margin: 0;
  color: var(--text-secondary);
  line-height: 1.5;
  min-height: 3rem;
}

.language-tag {
  display: inline-block;
  background: var(--accent-color);
  color: white;
  padding: 0.25rem 0.75rem;
  border-radius: 12px;
  font-size: 0.75rem;
  font-weight: 500;
}

.repo-stats {
  display: flex;
  justify-content: space-between;
  margin-top: auto;
}

.stat {
  display: flex;
  align-items: center;
  gap: 0.25rem;
  color: var(--text-secondary);
  font-size: 0.875rem;
}

.repo-actions {
  padding: 1rem;
  border-top: 1px solid #e5e7eb;
  display: flex;
  gap: 0.5rem;
}

/* Buttons */
.btn {
  padding: 0.5rem 1rem;
  border-radius: 6px;
  font-size: 0.875rem;
  font-weight: 500;
  text-decoration: none;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  cursor: pointer;
  transition: all 0.2s;
  border: none;
}

.btn-outline {
  background: var(--surface);
  color: var(--text-secondary);
  border: 1px solid var(--border);
}

.btn-outline:hover {
  background: var(--surface-hover);
  border-color: var(--border-muted);
}

.btn-primary {
  background: var(--primary-color);
  color: white;
  flex: 1;
}

.btn-primary:hover {
  background: var(--primary-hover);
}

/* Tabs */
.tabs {
  display: flex;
  border-bottom: 1px solid var(--border);
}

.tab-btn {
  padding: 1rem 1.5rem;
  background: none;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-weight: 500;
  color: var(--text-secondary);
  transition: all 0.2s;
  border-bottom: 2px solid transparent;
}

.tab-btn:hover {
  color: var(--text-color);
  background: var(--surface-hover);
}

.tab-btn.active {
  color: var(--primary-color);
  border-bottom-color: var(--primary-color);
  background: var(--surface);
}

.tab-count {
  background: var(--surface-hover);
  color: var(--text-secondary);
  padding: 0.125rem 0.5rem;
  border-radius: 10px;
  font-size: 0.75rem;
}

.tab-btn.active .tab-count {
  background: var(--primary-color);
  color: white;
}

/* Issue and PR Lists */
.issue-list,
.pr-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.issue-item,
.pr-item {
  display: flex;
  align-items: flex-start;
  gap: 1rem;
  padding: 1rem;
  border: 1px solid var(--border);
  border-radius: 6px;
  transition: background-color 0.2s;
}

.issue-item:hover,
.pr-item:hover {
  background: var(--surface-hover);
}

.issue-icon,
.pr-icon {
  flex-shrink: 0;
}

.status-icon {
  font-size: 1.2rem;
}

.issue-content,
.pr-content {
  flex: 1;
}

.issue-title,
.pr-title {
  margin: 0 0 0.5rem 0;
  font-size: 1rem;
  font-weight: 500;
}

.issue-title a,
.pr-title a {
  color: var(--text-color);
  text-decoration: none;
}

.issue-title a:hover,
.pr-title a:hover {
  color: var(--primary-color);
}

.issue-meta,
.pr-meta {
  color: var(--text-secondary);
  font-size: 0.875rem;
}

.status-badge {
  padding: 0.25rem 0.75rem;
  border-radius: 12px;
  font-size: 0.75rem;
  font-weight: 500;
}

.status-badge.open {
  background: #dcfce7;
  color: #166534;
  border: 1px solid #86efac;
}

.status-badge.closed {
  background: #fee2e2;
  color: #991b1b;
  border: 1px solid #fca5a5;
}

.status-badge.merged {
  background: #dbeafe;
  color: #1e40af;
  border: 1px solid #93c5fd;
}

/* Loading States */
.loading-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 1.5rem;
}

.skeleton-card {
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: 6px;
  overflow: hidden;
}

.skeleton-header {
  height: 60px;
  background: linear-gradient(90deg, #f3f4f6 25%, #e5e7eb 50%, #f3f4f6 75%);
  animation: shimmer 1.5s infinite;
}

.skeleton-content {
  padding: 1rem;
}

.skeleton-line {
  height: 16px;
  background: linear-gradient(90deg, #f3f4f6 25%, #e5e7eb 50%, #f3f4f6 75%);
  border-radius: 4px;
  margin-bottom: 0.5rem;
  animation: shimmer 1.5s infinite;
}

.skeleton-line.short {
  width: 60%;
}

.loading-skeleton {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.skeleton-item {
  height: 80px;
  background: linear-gradient(90deg, #f3f4f6 25%, #e5e7eb 50%, #f3f4f6 75%);
  border-radius: 8px;
  animation: shimmer 1.5s infinite;
}

@keyframes shimmer {
  0% {
    background-position: -200px 0;
  }

  100% {
    background-position: 200px 0;
  }
}

/* Empty States */
.empty-state {
  text-align: center;
  padding: 3rem 1rem;
  color: var(--text-secondary);
}

.empty-icon {
  font-size: 3rem;
  display: block;
  margin-bottom: 1rem;
}

.empty-state h3 {
  margin: 0 0 0.5rem 0;
  color: var(--text-color);
}

.empty-state p {
  margin: 0;
  font-size: 0.875rem;
}

/* Welcome State */
.welcome-card {
  background: var(--surface);
  color: var(--text-color);
  border: 1px solid var(--border);
}

.welcome-content {
  text-align: center;
  padding: 4rem 2rem;
}

.welcome-icon {
  font-size: 4rem;
  display: block;
  margin-bottom: 1rem;
}

.welcome-content h2 {
  margin: 0 0 1rem 0;
  font-size: 2rem;
  font-weight: 600;
}

.welcome-content p {
  margin: 0;
  font-size: 1.125rem;
  opacity: 0.9;
}

/* Error Alert */
.error-alert {
  background: #fef2f2;
  border: 1px solid #fecaca;
  border-radius: 8px;
  padding: 1rem;
  display: flex;
  align-items: flex-start;
  gap: 1rem;
}

.alert-content {
  flex: 1;
  display: flex;
  align-items: flex-start;
  gap: 0.75rem;
}

.alert-icon {
  font-size: 1.25rem;
  flex-shrink: 0;
}

.error-alert h4 {
  margin: 0 0 0.25rem 0;
  color: #991b1b;
  font-size: 1rem;
}

.error-alert p {
  margin: 0;
  color: #7f1d1d;
  font-size: 0.875rem;
}

.alert-close {
  background: none;
  border: none;
  color: #991b1b;
  cursor: pointer;
  padding: 0.25rem;
  border-radius: 4px;
  transition: background-color 0.2s;
}

.alert-close:hover {
  background: #fecaca;
}

/* Icon Styles */
.icon {
  display: inline-block;
  font-style: normal;
}

/* Responsive Design */
@media (max-width: 768px) {
  .filters {
    grid-template-columns: 1fr;
  }

  .input-group {
    flex-direction: column;
  }

  .repo-grid {
    grid-template-columns: 1fr;
  }

  .repo-actions {
    flex-direction: column;
  }

  .tabs {
    flex-wrap: wrap;
  }

  .tab-btn {
    flex: 1;
    justify-content: center;
  }

  .view-toggle {
    flex-direction: column;
    gap: 0.75rem;
  }

  .toggle-btn {
    justify-content: center;
    min-width: unset;
  }

  .pr-filters {
    flex-direction: column;
    align-items: stretch;
  }

  .pr-search-filter {
    min-width: unset;
  }

  .pr-filters .state-filter {
    min-width: unset;
  }
}

/* Back to Top Button */
.back-to-top-btn {
  position: fixed;
  bottom: 2rem;
  right: 2rem;
  width: 3.5rem;
  height: 3.5rem;
  background: var(--primary-color);
  border: none;
  border-radius: 50%;
  color: white;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  transition: all 0.3s ease;
  z-index: 999;
  animation: fadeInUp 0.3s ease;
}

.back-to-top-btn:hover {
  background: var(--primary-hover);
  transform: translateY(-2px);
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.2);
}

.back-to-top-btn:active {
  transform: translateY(0);
}

.back-to-top-icon {
  font-size: 1.5rem;
  font-weight: bold;
  line-height: 1;
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }

  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Mobile responsiveness for back to top button */
@media (max-width: 768px) {
  .back-to-top-btn {
    bottom: 1.5rem;
    right: 1.5rem;
    width: 3rem;
    height: 3rem;
  }

  .back-to-top-icon {
    font-size: 1.25rem;
  }
}

/* User PRs List */
.user-prs-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.user-pr-item {
  display: flex;
  align-items: flex-start;
  gap: 1rem;
  padding: 1.5rem;
  border: 1px solid var(--border);
  border-radius: 6px;
  transition: all 0.2s;
  background: var(--surface);
}

.user-pr-item:hover {
  background: var(--surface-hover);
  border-color: var(--border-muted);
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.user-pr-item .pr-content {
  flex: 1;
}

.user-pr-item .pr-title {
  margin: 0 0 0.5rem 0;
  font-size: 1.125rem;
  font-weight: 600;
}

.user-pr-item .pr-title a {
  color: var(--text-color);
  text-decoration: none;
}

.user-pr-item .pr-title a:hover {
  color: var(--primary-color);
}

.user-pr-item .pr-meta {
  color: var(--text-secondary);
  font-size: 0.875rem;
}

/* Review PR Items */
.review-pr-item {
  border-left: 3px solid var(--info);
}

.review-pr-item .pr-icon .status-icon.open {
  color: var(--info);
}

.repo-name {
  font-weight: 600;
  color: var(--accent-color);
  background: linear-gradient(135deg, #fff7ed 0%, #fed7aa 100%);
  padding: 0.125rem 0.5rem;
  border-radius: 6px;
  font-size: 0.75rem;
  border: 1px solid #fdba74;
}

/* Dark theme support */
[data-theme="dark"] .search-card,
[data-theme="dark"] .repos-card,
[data-theme="dark"] .details-card,
[data-theme="dark"] .user-prs-card {
  background: #1f2937;
  color: #f9fafb;
}

[data-theme="dark"] .repo-card {
  background: #374151;
  border-color: #4b5563;
}

[data-theme="dark"] .repo-header {
  background: #4b5563;
  border-bottom-color: #6b7280;
}

[data-theme="dark"] .repo-title {
  color: #f9fafb;
}

[data-theme="dark"] .repo-description {
  color: #d1d5db;
}

[data-theme="dark"] .search-input,
[data-theme="dark"] .filter-input,
[data-theme="dark"] .filter-select {
  background: #374151;
  border-color: #4b5563;
  color: #f9fafb;
}

[data-theme="dark"] .issue-item,
[data-theme="dark"] .pr-item {
  background: #374151;
  border-color: #4b5563;
}

[data-theme="dark"] .issue-item:hover,
[data-theme="dark"] .pr-item:hover {
  background: #4b5563;
}

[data-theme="dark"] .toggle-btn {
  background: #374151;
  border-color: #4b5563;
  color: #d1d5db;
}

[data-theme="dark"] .toggle-btn:hover {
  background: #4b5563;
  border-color: #6b7280;
}

[data-theme="dark"] .toggle-btn.active {
  background: var(--gradient-primary);
  border-color: var(--primary-color);
  color: white;
  box-shadow: 0 4px 12px rgba(96, 165, 250, 0.3);
}

[data-theme="dark"] .user-pr-item {
  background: #374151;
  border-color: #4b5563;
}

[data-theme="dark"] .user-pr-item:hover {
  background: #4b5563;
  border-color: #6b7280;
}

[data-theme="dark"] .user-pr-item .pr-title a {
  color: #f9fafb;
}

[data-theme="dark"] .repo-name {
  background: #4b5563;
  color: #d1d5db;
}
</style>
