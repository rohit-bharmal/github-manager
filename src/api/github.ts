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

export async function fetchRepos(username: string) {
  const response = await github.get(`/users/${username}/repos`);
  return response.data;
}

export async function fetchIssues(username: string, repo: string) {
  const res = await github.get(`/repos/${username}/${repo}/issues`, {
    params: { state: "all", per_page: 10 },
  });
  return res.data.filter((issue: any) => !issue.pull_request);
}

export async function fetchPRs(username: string, repo: string) {
  const res = await github.get(`/repos/${username}/${repo}/pulls`, {
    params: { state: "all", per_page: 10 },
  });
  return res.data;
}

// Fetch all PRs authored by the user across all repositories
export async function fetchUserAuthoredPRs(username: string) {
  const res = await github.get(`/search/issues`, {
    params: {
      q: `type:pr author:${username}`,
      sort: "updated",
      order: "desc",
      per_page: 20,
    },
  });
  return res.data.items;
}

// Fetch PRs for a specific repository that includes both repo PRs and user-authored PRs from upstream
export async function fetchAllPRsForRepo(username: string, repo: string) {
  try {
    // Get PRs from the user's repository
    const repoPRs = await fetchPRs(username, repo);

    // Check if this is a fork and get the upstream repo info
    const repoInfo = await github.get(`/repos/${username}/${repo}`);
    const isForked = repoInfo.data.fork;

    let upstreamPRs = [];
    if (isForked && repoInfo.data.parent) {
      // Get PRs authored by the user in the upstream repository
      const upstreamOwner = repoInfo.data.parent.owner.login;
      const upstreamRepoName = repoInfo.data.parent.name;

      const searchRes = await github.get(`/search/issues`, {
        params: {
          q: `type:pr author:${username} repo:${upstreamOwner}/${upstreamRepoName}`,
          sort: "updated",
          order: "desc",
          per_page: 10,
        },
      });
      upstreamPRs = searchRes.data.items;
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
