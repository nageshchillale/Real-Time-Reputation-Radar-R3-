/**
 * Centralized API service layer — re-exports all API functions.
 *
 * Usage from components:
 *   import { createPost, submitPost, getDashboardSummary } from '../services/api';
 *
 * This file acts as the single entry-point specified in the integration spec.
 * The actual implementation lives in ../api/index.js.
 */
export {
  // Existing
  pingBackend,
  createPost,
  getPosts,
  analyzeSentiment,
  getStats,
  getCrisis,
  // New integrations
  submitPost,
  analyzeSentimentByPostId,
  getSentimentDetails,
  getDashboardSummary,
  setAutoRefresh,
  getStatsByRange,
  getPostsPaginated,
  exportPostsCsv,
  // System actions
  deploySystem,
  requestDemo,
} from '../api';
