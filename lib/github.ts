export interface User {
  login: string;
  avatar_url: string;
  html_url: string;
}

export interface Label {
  id: number;
  name: string;
  color: string;
}

export interface Post {
  id: number;
  number: number;
  title: string;
  body: string;
  created_at: string;
  updated_at: string;
  labels: Label[];
  user: User;
  html_url: string;
}

const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
const REPO_OWNER = process.env.REPO_OWNER;
const REPO_NAME = process.env.REPO_NAME;

if (!REPO_OWNER || !REPO_NAME) {
  throw new Error("Missing REPO_OWNER or REPO_NAME environment variables");
}

const headers = {
  Accept: "application/vnd.github.v3+json",
  ...(GITHUB_TOKEN && { Authorization: `Bearer ${GITHUB_TOKEN}` }),
};

export async function getPosts(): Promise<Post[]> {
  const url = `https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/issues?state=open&labels=blog&per_page=100`;
  
  try {
    const res = await fetch(url, {
      headers,
      next: { revalidate: 60 },
    });

    if (!res.ok) {
      throw new Error(`Failed to fetch posts: ${res.status} ${res.statusText}`);
    }

    const data = await res.json();
    // Filter out pull requests, as issues endpoint returns both
    return data.filter((issue: any) => !issue.pull_request);
  } catch (error) {
    console.error("Error fetching posts:", error);
    return [];
  }
}

export async function getPost(number: number): Promise<Post | null> {
  const url = `https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/issues/${number}`;

  try {
    const res = await fetch(url, {
      headers,
      next: { revalidate: 60 },
    });

    if (!res.ok) {
      if (res.status === 404) return null;
      throw new Error(`Failed to fetch post: ${res.status} ${res.statusText}`);
    }

    const data = await res.json();
    return data;
  } catch (error) {
    console.error(`Error fetching post ${number}:`, error);
    return null;
  }
}
