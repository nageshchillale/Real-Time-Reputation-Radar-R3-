# R3 - Reputation Radar | Frontend Integration Guide

## 🎯 Integration Overview

The landing page has been transformed into a **functional AI dashboard** with real-time API integration. The existing futuristic UI/theme has been preserved, with minimal enhancements to display live data.

---

## 📋 Architecture Overview

### Tech Stack
- **Framework**: React 19 + Vite
- **Styling**: Tailwind CSS + custom glass-morphism
- **Animations**: Framer Motion
- **Icons**: Lucide React
- **Backend API**: http://localhost:8080

### Component Structure

```
App.jsx (Global State Manager)
├── CrisisAlert (Global Banner)
├── Navbar
├── Hero (Input System)
├── TrustBar (Dynamic Metrics)
├── Features
├── Pipeline
├── ValueProposition
├── UseCases
├── DashboardPreview (Real Data Dashboard)
├── CTA
└── Footer
```

---

## 🔗 API Layer (`src/api/index.js`)

### Implemented Functions

#### 1. `createPost(text)`
**Endpoint**: `POST /api/posts`
```javascript
const response = await createPost("My message here");
// Returns: { id, text, sentiment, timestamp, crisis_flag, ... }
```

#### 2. `getPosts()`
**Endpoint**: `GET /api/posts`
```javascript
const posts = await getPosts();
// Returns: Array of post objects [{ id, text, sentiment, timestamp }, ...]
```

#### 3. `getStats()`
**Endpoint**: `GET /api/analytics/stats`
```javascript
const stats = await getStats();
// Returns: { totalPosts, positiveCount, negativeCount, ... }
```

#### 4. `getCrisis()`
**Endpoint**: `GET /api/crisis`
```javascript
const crisis = await getCrisis();
// Returns: { crisis_detected: boolean, severity: "low|medium|high", ... }
```

---

## 🎨 Component Integration Details

### 1. Hero Section (`src/components/Hero.jsx`)

**Features**:
- Toggle input field on "Start Monitoring" button click
- Glass-morphism styled input field
- Submit button triggers `createPost()` API
- Loading spinner during submission
- Auto-refresh all data after successful post

**User Flow**:
```
Click "Start Monitoring" → Input appears → Type message → Click "Submit" 
→ API call → Input clears → Dashboard updates
```

**Props**: `{ posts, stats, onDataRefresh }`

**Key Changes**:
- Added state for `inputValue`, `isSubmitting`, `showInput`
- Integrated `createPost()` from API layer
- Added error handling and loading states

---

### 2. TrustBar Component (`src/components/TrustBar.jsx`)

**Features**:
- Displays real metrics from API
- Animated number counters (1.5s animation)
- Shows total posts, accuracy, sentiment distribution

**Metrics Displayed**:
- **Messages Analyzed**: `stats.totalPosts` or `posts.length`
- **Detection Accuracy**: 99.2% (static)
- **Positive Sentiment**: Count of positive posts
- **Negative Sentiment**: Count of negative posts

**New Component**: `AnimatedCounter`
- Smoothly animates from 0 to target value
- Used for all dynamic metrics

---

### 3. DashboardPreview Component (`src/components/DashboardPreview.jsx`)

**Major Enhancements**:

#### Sentiment Distribution Chart
- Real-time bar chart based on post data
- Color coded: Green (positive), Purple (neutral), Red (negative)
- Dynamic height based on sentiment data
- Critical threshold line indicator

#### Recent Posts Feed
- Displays last 5 posts
- Color-coded borders by sentiment
- Shows sentiment badge and timestamp
- Smooth animations on new posts

#### Crisis Status Display
- Real-time crisis detection indicator
- Red glow effect when crisis detected
- Shows "Crisis Detected" or "No Anomalies"
- Animated banner with icon

#### Live Metrics
- Negative Sentiment %: Animated progress bar
- Total Posts: Count with trending indicator
- Both animate on data update

**Props**: `{ posts, stats, crisis }`

---

### 4. CrisisAlert Component (`src/components/CrisisAlert.jsx`)

**Features**:
- Fixed global banner at top of page
- Shows glowing red alert when `crisis.crisis_detected = true`
- Shows green status when `crisis.crisis_detected = false`
- Dismissible (✕ button)
- Smooth animations

**Visual States**:
- **Crisis Active**: Red border, red background, animated pulse icon
- **Crisis Inactive**: Green border, green background, static icon

**Props**: `{ crisis, loading }`

---

### 5. Global State Management (`src/App.jsx`)

**State Variables**:
```javascript
const [posts, setPosts] = useState([]);
const [stats, setStats] = useState(null);
const [crisis, setCrisis] = useState(null);
const [loading, setLoading] = useState(true);
```

**Auto-Refresh Logic**:
- Fetches all data on component mount
- Auto-refresh every 10 seconds via `setInterval`
- Cleans up interval on unmount
- Passes `onDataRefresh` callback to Hero for post submission

**Data Flow**:
```
App.jsx (Fetches & Manages State)
    ↓
    ├→ Passes to CrisisAlert
    ├→ Passes to Hero (+ onDataRefresh callback)
    ├→ Passes to TrustBar
    └→ Passes to DashboardPreview
```

---

## 🚀 Getting Started

### 1. Frontend Setup (Already Complete)

```bash
# Navigate to project
cd c:\Users\Admin\OneDrive\Desktop\Reputation_Frontend

# Install dependencies (already done)
npm install

# Start dev server
npm run dev

# Server runs on http://localhost:5173
```

### 2. Backend Requirements

Your backend must be running on `http://localhost:8080` with:

**Required CORS Headers**:
```
Access-Control-Allow-Origin: http://localhost:5173
Access-Control-Allow-Methods: GET, POST, OPTIONS
Access-Control-Allow-Headers: Content-Type
Access-Control-Allow-Credentials: true
```

**Example Node.js/Express CORS Setup**:
```javascript
const cors = require('cors');
app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true
}));
```

### 3. API Endpoint Implementation

Ensure backend implements all 4 endpoints:

#### POST /api/posts
```json
Request:  { "text": "message content" }
Response: { "id": "uuid", "text": "message", "sentiment": "positive|negative|neutral", "timestamp": "2026-04-28T10:30:00Z", "crisis_flag": false }
```

#### GET /api/posts
```json
Response: [
  { "id": "uuid", "text": "...", "sentiment": "positive", "timestamp": "..." },
  { "id": "uuid", "text": "...", "sentiment": "negative", "timestamp": "..." }
]
```

#### GET /api/analytics/stats
```json
Response: { 
  "totalPosts": 42,
  "positiveCount": 25,
  "negativeCount": 10,
  "neutralCount": 7,
  "averageSentiment": 0.65
}
```

#### GET /api/crisis
```json
Response: {
  "crisis_detected": false,
  "severity": "low",
  "activeThreats": 0,
  "lastUpdated": "2026-04-28T10:30:00Z"
}
```

---

## 📱 User Workflows

### Workflow 1: Submit a Post
```
1. User clicks "Start Monitoring" button in Hero
2. Input field appears with placeholder text
3. User types message
4. User clicks "Submit" button
5. Loading spinner shows "Analyzing..."
6. API call to POST /api/posts
7. Input clears, hero section collapses
8. All dashboard data refreshes:
   - Recent posts updated
   - Sentiment chart updates
   - Metrics animated to new values
   - Crisis alert updates if needed
```

### Workflow 2: Monitor Dashboard
```
1. Page loads
2. CrisisAlert shows current status (green/red)
3. TrustBar displays live metrics with animated counters
4. DashboardPreview shows:
   - Sentiment distribution chart
   - Recent posts (if any)
   - Crisis metrics
5. Data auto-refreshes every 10 seconds
```

### Workflow 3: Crisis Detection
```
1. Backend detects crisis (crisis_detected = true)
2. CrisisAlert banner turns red with alert
3. DashboardPreview crisis indicator updates
4. Posts feed updates with relevant posts
5. Sentiment chart shows spike in negative sentiment
6. TrustBar metrics update
```

---

## 🎨 UI Enhancements

### Preserved Elements
✅ Futuristic neon theme (accent-neon colors)
✅ Glassmorphism effects (glass-card classes)
✅ Dark theme (dark-900 background)
✅ Smooth animations (Framer Motion)
✅ Gradient text effects
✅ Glowing shadows
✅ Grid overlay background

### New Elements
- Input field (Hero section)
- Animated number counters (TrustBar)
- Recent posts feed (DashboardPreview)
- Crisis status banner (CrisisAlert)
- Real-time sentiment chart (DashboardPreview)

### Color Coding
- **Positive Sentiment**: Green (`bg-green-500`)
- **Neutral Sentiment**: Purple/Primary (`bg-primary`)
- **Negative Sentiment**: Red (`bg-red-500`)
- **Crisis Alert**: Red border + background
- **Normal Status**: Green border + background

---

## 🔧 Configuration

### To Change Backend URL

Edit `src/api/index.js`, line 1:
```javascript
const BASE_URL = "http://localhost:8080"; // Change this
```

### To Change Auto-Refresh Interval

Edit `src/App.jsx`, line 41:
```javascript
const interval = setInterval(fetchAllData, 10000); // 10 seconds, change to desired ms
```

### To Change Recent Posts Count

Edit `src/components/DashboardPreview.jsx`, line 17:
```javascript
const recentPosts = posts.slice(0, 5); // Show 5 recent posts, change number
```

---

## 🐛 Troubleshooting

### Issue: CORS Errors in Console
**Problem**: "Access to fetch has been blocked by CORS policy"
**Solution**: Backend must have CORS headers enabled (see Backend Requirements section)

### Issue: API calls failing with 404
**Problem**: "Failed to fetch" errors
**Solution**: 
- Verify backend is running on http://localhost:8080
- Check endpoint paths match exactly
- Test endpoints with Postman/curl first

### Issue: No data showing in dashboard
**Problem**: Dashboard appears empty
**Solution**:
- Check browser console for errors
- Verify backend is returning data
- Check Network tab in DevTools
- Ensure posts array is being populated

### Issue: Animations not smooth
**Problem**: Janky animations
**Solution**:
- Check browser performance (DevTools → Performance tab)
- Reduce auto-refresh interval if causing issues
- Ensure hardware acceleration is enabled

---

## 📊 Data Flow Diagram

```
Backend (localhost:8080)
    ↓ (REST API)
    ↓ 
Frontend (localhost:5173)
    ↓
App.jsx (Global State)
    ↓
    ├─→ CrisisAlert (displays crisis status)
    ├─→ Hero (submit new posts)
    ├─→ TrustBar (display metrics)
    └─→ DashboardPreview (show real data)
```

---

## ✅ Testing Checklist

Before going live, verify:

- [ ] Backend running on http://localhost:8080
- [ ] CORS headers enabled on backend
- [ ] Frontend accessible at http://localhost:5173
- [ ] Can submit a post from Hero section
- [ ] Dashboard updates after post submission
- [ ] Metrics animate on data change
- [ ] Crisis alert shows/hides correctly
- [ ] Recent posts display correctly
- [ ] Sentiment chart updates with new data
- [ ] Auto-refresh works every 10 seconds
- [ ] No console errors
- [ ] Responsive design works on mobile

---

## 🎯 Production Considerations

1. **CORS**: Configure for production domain
2. **Error Handling**: Implement retry logic for failed API calls
3. **Loading States**: Add skeleton loaders for better UX
4. **Caching**: Consider caching frequently requested data
5. **Real-time**: Consider WebSocket for true real-time updates
6. **Performance**: Profile and optimize if needed
7. **Analytics**: Add error tracking (Sentry, etc.)
8. **Rate Limiting**: Implement on backend to prevent abuse

---

## 📝 Files Modified

1. `src/App.jsx` - Global state management (60 lines added)
2. `src/api/index.js` - API layer (NEW FILE - 42 lines)
3. `src/components/Hero.jsx` - Input system (80 lines modified)
4. `src/components/TrustBar.jsx` - Dynamic metrics (90 lines modified)
5. `src/components/DashboardPreview.jsx` - Real data (250 lines modified)
6. `src/components/CrisisAlert.jsx` - Crisis banner (NEW FILE - 55 lines)

**Total Added**: ~280 lines of code
**No breaking changes** to existing UI or styling

---

## 🎓 Learning Resources

- [React Hooks](https://react.dev/reference/react/hooks)
- [Fetch API](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API)
- [Framer Motion](https://www.framer.com/motion/)
- [Tailwind CSS](https://tailwindcss.com/)
- [CORS Issues](https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS)

---

## 🚀 Next Steps

1. **Start Backend Server**: Get your backend running on port 8080
2. **Enable CORS**: Configure CORS headers on backend
3. **Test Endpoints**: Verify all 4 endpoints work with Postman
4. **Connect Frontend**: Refresh page, dashboard should populate
5. **Submit Posts**: Test the Hero input flow
6. **Monitor Dashboard**: Watch real-time updates

---

**Status**: ✅ Frontend complete and ready for backend integration
**Frontend URL**: http://localhost:5173/
**Expected Backend URL**: http://localhost:8080/
**Last Updated**: 2026-04-28
