# ReputationRadar API Documentation

## 1. Health Check

**GET** `/ping`
- **Response:** `"pong"`

---

## 2. Posts

### Create a Post
**POST** `/api/posts`
- **Request Body:**
```json
{
  "text": "string"
}
```
- **Response:**
```json
{
  "id": 1,
  "text": "string",
  "crisis": true,
  "crisisLevel": "SEVERE|CRITICAL|WARNING|NORMAL",
  "sentimentLabel": "POSITIVE|NEGATIVE|NEUTRAL",
  "sentimentScore": 0.95,
  "timestamp": "2026-04-28T12:34:56"
}
```

### Get All Posts
**GET** `/api/posts`
- **Response:**
Array of Post objects (see above).

---

## 3. Sentiment Analysis

**POST** `/api/sentiment/analyze`
- **Request Body:**
```json
{
  "text": "string"
}
```
- **Response:**
```json
{
  "label": "POSITIVE|NEGATIVE|NEUTRAL",
  "score": 0.95
}
```

---

## 4. Analytics

**GET** `/api/analytics/stats`
- **Response:**
```json
{
  "totalPosts": 100,
  "positivePosts": 60,
  "negativePosts": 40
}
```

---

## 5. Crisis Detection

**GET** `/api/crisis/status`
- **Response:**
```json
{
  "negativeCounatLast5Minutes": 5,
  "crisisLevel": "SEVERE|CRITICAL|WARNING|NORMAL"
}
```
