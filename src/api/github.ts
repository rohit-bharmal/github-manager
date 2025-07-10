// src/api/github.ts
import axios from "axios";

const token = import.meta.env.VITE_GITHUB_TOKEN;

const github = axios.create({
  baseURL: "https://api.github.com",
  headers: {
    Authorization: `Bearer ${token}`,
    Accept: "application/vnd.github+json",
  },
});

// Helper function to fetch all pages of results
async function fetchAllPages(url: string, params: any = {}) {
  const allResults: any[] = [];
  let page = 1;
  let hasNextPage = true;

  while (hasNextPage) {
    const response = await github.get(url, {
      params: { ...params, per_page: 100, page },
    });

    allResults.push(...response.data);

    // Check if there are more pages
    hasNextPage = response.data.length === 100;
    page++;

    // Safety limit to prevent infinite loops
    if (page > 50) break;
  }

  return allResults;
}

// Helper function for search endpoints (has different response structure)
async function fetchAllSearchResults(url: string, params: any = {}) {
  const allResults: any[] = [];
  let page = 1;
  let hasNextPage = true;

  while (hasNextPage) {
    const response = await github.get(url, {
      params: { ...params, per_page: 100, page },
    });

    allResults.push(...response.data.items);

    // Check if there are more pages (search API returns total_count)
    hasNextPage =
      response.data.items.length === 100 &&
      allResults.length < response.data.total_count;
    page++;

    // GitHub search API has a limit of 1000 results, safety limit
    if (page > 10 || allResults.length >= 1000) break;
  }

  return allResults;
}

export async function fetchRepos(username: string) {
  // Fetch all repositories (no limit)
  return await fetchAllPages(`/users/${username}/repos`, { sort: "updated" });
}

export async function fetchIssues(username: string, repo: string) {
  // Fetch all issues (no 10 item limit)
  const allIssues = await fetchAllPages(`/repos/${username}/${repo}/issues`, {
    state: "all",
  });
  return allIssues.filter((issue: any) => !issue.pull_request);
}

export async function fetchPRs(username: string, repo: string) {
  // Fetch all PRs (no 10 item limit)
  return await fetchAllPages(`/repos/${username}/${repo}/pulls`, {
    state: "all",
  });
}

// Fetch all PRs authored by the user across all repositories
export async function fetchUserAuthoredPRs(username: string) {
  // Fetch all user PRs (no 20 item limit)
  return await fetchAllSearchResults(`/search/issues`, {
    q: `type:pr author:${username}`,
    sort: "updated",
    order: "desc",
  });
}

// Fetch all PRs where the user is requested as a reviewer
export async function fetchUserReviewPRs(username: string) {
  // Fetch all PRs where user is requested as reviewer
  return await fetchAllSearchResults(`/search/issues`, {
    q: `type:pr review-requested:${username}`,
    sort: "updated",
    order: "desc",
  });
}

// Fetch PRs for a specific repository that includes both repo PRs and user-authored PRs from upstream
export async function fetchAllPRsForRepo(username: string, repo: string) {
  try {
    // Get all PRs from the user's repository (no limits)
    const repoPRs = await fetchPRs(username, repo);

    // Check if this is a fork and get the upstream repo info
    const repoInfo = await github.get(`/repos/${username}/${repo}`);
    const isForked = repoInfo.data.fork;

    let upstreamPRs = [];
    if (isForked && repoInfo.data.parent) {
      // Get all PRs authored by the user in the upstream repository (no 10 item limit)
      const upstreamOwner = repoInfo.data.parent.owner.login;
      const upstreamRepoName = repoInfo.data.parent.name;

      upstreamPRs = await fetchAllSearchResults(`/search/issues`, {
        q: `type:pr author:${username} repo:${upstreamOwner}/${upstreamRepoName}`,
        sort: "updated",
        order: "desc",
      });
    }

    // Combine and deduplicate PRs
    const allPRs = [...repoPRs, ...upstreamPRs];
    const uniquePRs = allPRs.filter(
      (pr, index, self) => index === self.findIndex((p) => p.id === pr.id)
    );

    return uniquePRs.sort(
      (a, b) =>
        new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime()
    );
  } catch (error) {
    console.error("Error fetching PRs:", error);
    // Fallback to just repo PRs
    return await fetchPRs(username, repo);
  }
}
