const BASE_URL = "http://localhost:8080";

// ─── Existing API calls (DO NOT MODIFY) ──────────────────────────────────────

export async function pingBackend() {
  try {
    const res = await fetch(`${BASE_URL}/ping`);
    if (!res.ok) throw new Error("Backend unreachable");
    const text = await res.text();
    return text === "pong";
  } catch (error) {
    console.error("Ping failed:", error);
    return false;
  }
}

/**
 * Original createPost — kept for any existing callers.
 * Uses the { text } body shape matching backend POST /api/posts.
 */
export async function createPost(text) {
  try {
    const res = await fetch(`${BASE_URL}/api/posts`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text })
    });
    if (!res.ok) throw new Error("Failed to create post");
    return res.json();
  } catch (error) {
    console.error("Error creating post:", error);
    throw error;
  }
}

export async function getPosts() {
  try {
    const res = await fetch(`${BASE_URL}/api/posts`);
    if (!res.ok) throw new Error("Failed to fetch posts");
    return res.json();
  } catch (error) {
    console.error("Error fetching posts:", error);
    throw error;
  }
}

export async function analyzeSentiment(text) {
  try {
    const res = await fetch(`${BASE_URL}/api/sentiment/analyze`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text })
    });
    if (!res.ok) throw new Error("Failed to analyze sentiment");
    return res.json();
  } catch (error) {
    console.error("Error analyzing sentiment:", error);
    throw error;
  }
}

export async function getStats() {
  try {
    const res = await fetch(`${BASE_URL}/api/analytics/stats`);
    if (!res.ok) throw new Error("Failed to fetch stats");
    return res.json();
  } catch (error) {
    console.error("Error fetching stats:", error);
    throw error;
  }
}

export async function getCrisis() {
  try {
    const res = await fetch(`${BASE_URL}/api/crisis/status`);
    if (!res.ok) throw new Error("Failed to fetch crisis status");
    return res.json();
  } catch (error) {
    console.error("Error fetching crisis:", error);
    throw error;
  }
}

// ─── NEW API integrations (FIXED) ────────────────────────────────────────────

/**
 * 1. PostComposer → POST button
 * POST /api/posts  { text }
 * FIX: Backend expects { text }, NOT { authorId, content }.
 */
export async function submitPost({ content }) {
  try {
    const res = await fetch(`${BASE_URL}/api/posts`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text: content }),
    });
    if (!res.ok) throw new Error(`submitPost failed: ${res.status}`);
    return res.json();
  } catch (error) {
    console.error("Error submitting post:", error);
    throw error;
  }
}

/**
 * 2. SentimentAnalytics → Analyze button (by Post ID)
 * FIX: /api/analysis/sentiment does NOT exist on the backend.
 * Instead, fetch the post by ID from /api/posts, find matching post,
 * then call /api/sentiment/analyze with its text.
 */
export async function analyzeSentimentByPostId(postId) {
  try {
    // Fetch all posts and find the one matching the ID
    const postsRes = await fetch(`${BASE_URL}/api/posts`);
    if (!postsRes.ok) throw new Error(`Failed to fetch posts: ${postsRes.status}`);
    const posts = await postsRes.json();
    const post = posts.find(p => String(p.id) === String(postId));
    if (!post) throw new Error(`Post with ID ${postId} not found`);

    // If the post already has sentiment data, return it directly
    if (post.sentimentLabel) {
      return post;
    }

    // Otherwise, analyze the post's text via the correct endpoint
    const sentimentRes = await fetch(`${BASE_URL}/api/sentiment/analyze`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text: post.text }),
    });
    if (!sentimentRes.ok) throw new Error(`analyzeSentiment failed: ${sentimentRes.status}`);
    return sentimentRes.json();
  } catch (error) {
    console.error("Error analyzing sentiment by post ID:", error);
    throw error;
  }
}

/**
 * 8. SentimentAnalytics → View Details
 * FIX: /api/analysis/sentiment/details does NOT exist on backend.
 * Return the post's existing sentiment data as a fallback.
 */
export async function getSentimentDetails(postId) {
  try {
    // Fetch all posts and find the matching one
    const postsRes = await fetch(`${BASE_URL}/api/posts`);
    if (!postsRes.ok) throw new Error(`Failed to fetch posts: ${postsRes.status}`);
    const posts = await postsRes.json();
    const post = posts.find(p => String(p.id) === String(postId));
    if (!post) throw new Error(`Post with ID ${postId} not found`);

    // Return available sentiment info as a details-like response
    return {
      postId: post.id,
      text: post.text,
      sentimentLabel: post.sentimentLabel || 'NEUTRAL',
      sentimentScore: post.sentimentScore || 0,
      tokens: [],  // Token breakdown not available from backend
      sentimentScores: {
        positive: post.sentimentLabel === 'POSITIVE' ? (post.sentimentScore || 0) : 0,
        negative: post.sentimentLabel === 'NEGATIVE' ? (post.sentimentScore || 0) : 0,
        neutral: post.sentimentLabel === 'NEUTRAL' ? 1.0 : (1 - (post.sentimentScore || 0)),
      },
    };
  } catch (error) {
    console.error("Error fetching sentiment details:", error);
    throw error;
  }
}

/**
 * 3. Dashboard → Refresh button
 * FIX: /api/dashboard/summary does NOT exist on backend.
 * Compose a summary from existing /api/analytics/stats + /api/crisis/status.
 */
export async function getDashboardSummary() {
  try {
    const [statsRes, crisisRes] = await Promise.all([
      fetch(`${BASE_URL}/api/analytics/stats`),
      fetch(`${BASE_URL}/api/crisis/status`),
    ]);
    if (!statsRes.ok || !crisisRes.ok) throw new Error("Failed to fetch dashboard summary");
    const stats = await statsRes.json();
    const crisis = await crisisRes.json();

    const total = stats.totalPosts || 0;
    const positive = stats.positivePosts || 0;

    return {
      totalPosts: total,
      positivePosts: positive,
      negativePosts: stats.negativePosts || 0,
      averageSentiment: total > 0 ? positive / total : 0,
      crisisCount: crisis.negativeCountLast5Minutes || 0,
      crisisLevel: crisis.crisisLevel || 'NORMAL',
      lastUpdated: new Date().toISOString(),
    };
  } catch (error) {
    console.error("Error fetching dashboard summary:", error);
    throw error;
  }
}

/**
 * 7. Dashboard → Auto-Refresh toggle
 * FIX: /api/dashboard/auto-refresh does NOT exist on backend.
 * Handle entirely client-side — return a mock success response.
 */
export async function setAutoRefresh({ enabled, intervalSeconds = 30 }) {
  // No backend endpoint exists; manage auto-refresh purely on the client.
  console.log(`Auto-refresh ${enabled ? 'enabled' : 'disabled'} (interval: ${intervalSeconds}s) — client-side only`);
  return { enabled, intervalSeconds };
}

/**
 * 4. StatsCards → Filter dropdown
 * FIX: /api/stats?range=value does NOT exist on backend.
 * Fall back to /api/analytics/stats (which returns all-time stats).
 */
export async function getStatsByRange(range) {
  try {
    // Backend only supports all-time stats; ignore range parameter
    const res = await fetch(`${BASE_URL}/api/analytics/stats`);
    if (!res.ok) throw new Error(`getStatsByRange failed: ${res.status}`);
    return res.json();
  } catch (error) {
    console.error("Error fetching stats by range:", error);
    throw error;
  }
}

/**
 * 5. ResultsTable → Pagination
 * GET /api/posts — backend returns full list (no server-side pagination).
 * Pagination is handled client-side.
 */
export async function getPostsPaginated(page = 0, size = 10) {
  try {
    const res = await fetch(`${BASE_URL}/api/posts`);
    if (!res.ok) throw new Error(`getPostsPaginated failed: ${res.status}`);
    const allPosts = await res.json();

    // Client-side pagination since backend returns all posts
    const start = page * size;
    const content = allPosts.slice(start, start + size);

    return {
      content,
      totalPages: Math.ceil(allPosts.length / size),
      totalElements: allPosts.length,
      page,
      size,
    };
  } catch (error) {
    console.error("Error fetching paginated posts:", error);
    throw error;
  }
}

/**
 * 6. ResultsTable → Export CSV
 * GET /api/posts/export
 * Returns a Blob for file download.
 */
export async function exportPostsCsv() {
  try {
    const res = await fetch(`${BASE_URL}/api/posts/export`);
    if (!res.ok) throw new Error(`exportPostsCsv failed: ${res.status}`);
    return res.blob();
  } catch (error) {
    console.error("Error exporting CSV:", error);
    throw error;
  }
}

// New: deploy system
export async function deploySystem() {
  try {
    const res = await fetch(`${BASE_URL}/api/system/deploy`, { method: 'POST' });
    if (!res.ok) throw new Error(`deploySystem failed: ${res.status}`);
    return res;
  } catch (error) {
    console.error("Error deploying system:", error);
    throw error;
  }
}

// New: request demo
export async function requestDemo({ name, email, company } = {}) {
  try {
    const res = await fetch(`${BASE_URL}/api/demo/request`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, company }),
    });
    if (!res.ok) throw new Error(`requestDemo failed: ${res.status}`);
    return res.json();
  } catch (error) {
    console.error("Error requesting demo:", error);
    throw error;
  }
}
