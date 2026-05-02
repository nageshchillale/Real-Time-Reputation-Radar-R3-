# Reputation Radar Frontend – Backend Integration Checklist

## Overview
This repository contains the **React** frontend for the Reputation Radar SaaS application. The UI components are built and functional, but several buttons and interactive elements still rely on mock data or have no backend integration yet.  This README lists all such UI elements, the expected API contracts, and guidance for implementing the corresponding **Spring Boot** (Java) or **Python** (e.g., FastAPI/Django) services.

---

## UI Elements Requiring Backend Implementation

| Component | UI Element | Action | Expected Endpoint | HTTP Method | Request Payload (JSON) | Response Payload (JSON) | Notes |
|-----------|------------|--------|------------------|-------------|-----------------------|--------------------------|-------|
| `PostComposer.jsx` | **Post** button | Submit a new post written by the user | `/api/posts` | POST | `{ "authorId": "string", "content": "string" }` | `{ "id": "string", "authorId": "string", "content": "string", "createdAt": "ISO8601 timestamp" }` | Backend must persist the post and return the created entity. |
| `PostComposer.jsx` | **Cancel** button | Discard current draft | — | — | — | — | No backend call needed; just UI state reset. |
| `SentimentAnalytics.jsx` | **Analyze** button (appears after a post is submitted) | Trigger sentiment analysis for a post | `/api/analysis/sentiment` | POST | `{ "postId": "string" }` | `{ "postId": "string", "sentimentScore": "float", "sentimentLabel": "POSITIVE|NEGATIVE|NEUTRAL" }` | Should call the AI/ML sentiment service. |
| `Dashboard.jsx` | **Refresh Data** button | Pull latest aggregated statistics for the dashboard | `/api/dashboard/summary` | GET | — | `{ "totalPosts": 123, "averageSentiment": 0.42, "crisisCount": 5, "lastUpdated": "ISO8601" }` | Implement caching as needed; may be called periodically. |
| `StatsCards.jsx` | **Filter** dropdown (e.g., by time range) | Retrieve stats for the selected range | `/api/stats?range=last24h|last7d|custom` | GET | — | `{ "range": "string", "metrics": { … } }` | Backend should support query parameters for flexible ranges. |
| `ResultsTable.jsx` | **Next / Prev** pagination buttons | Navigate through paginated list of posts | `/api/posts?page={page}&size={size}` | GET | — | `{ "page": 2, "size": 20, "totalPages": 10, "posts": [ … ] }` | Provide pagination metadata; size is configurable. |
| `ResultsTable.jsx` | **Export CSV** button | Export current view as CSV file | `/api/posts/export?format=csv&page={page}&size={size}` | GET | — | CSV stream (Content‑Type: `text/csv`) | Ensure proper streaming for large exports. |
| `Dashboard.jsx` | **Toggle Auto‑Refresh** switch | Enable/disable periodic refresh of dashboard data | `/api/dashboard/auto-refresh` | POST | `{ "enabled": true|false, "intervalSeconds": 30 }` | `{ "enabled": true|false, "nextRefreshAt": "ISO8601" }` | Optional feature; default interval 30 s. |
| `SentimentAnalytics.jsx` | **View Details** link on each sentiment tile | Retrieve detailed sentiment breakdown for a specific topic | `/api/analysis/sentiment/details?postId={postId}` | GET | — | `{ "postId": "string", "tokens": [{ "word": "…", "score": 0.1 }] }` | Useful for drill‑down UI. |

---

## Suggested Backend Stack
- **Spring Boot (Java)** – Ideal for production‑grade REST services, security, and easy integration with relational databases. Use `@RestController` with DTOs matching the request/response payloads above.
- **Python (FastAPI / Django REST Framework)** – Faster prototyping; the same JSON contracts apply. Choose FastAPI for async workloads (e.g., sentiment model inference). 

Both stacks should expose the same endpoints (path & JSON schema) so the frontend remains agnostic to the language used.

## Common Requirements
1. **Authentication** – All endpoints should be protected (e.g., JWT Bearer token). Add `Authorization` header handling in the frontend later.
2. **Validation** – Enforce schema validation (e.g., `@Valid` in Spring, Pydantic models in FastAPI).
3. **Error Handling** – Return standardized error JSON: `{ "error": "Message", "code": 400 }` with appropriate HTTP status.
4. **CORS** – Allow origin from the development server (`http://localhost:3000`).
5. **Rate Limiting** – Optional but recommended for the sentiment analysis endpoint.

---

## Next Steps for Backend Development
1. **Create API stubs** for each endpoint listed above.
2. **Write unit/integration tests** using the request/response contracts.
3. **Implement persistence** for posts and stats (e.g., PostgreSQL, MySQL).
4. **Integrate AI/ML sentiment service** (could be a Python micro‑service called from Spring via HTTP or gRPC).
5. **Update the frontend** to point to the actual backend URLs (currently using mock URLs).

Feel free to expand this README as new UI elements are added.

---

*Generated on 2026‑04‑30.*
