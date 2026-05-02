# 🚨 R3 – Real-Time Reputation Radar

An end-to-end AI-powered system that monitors incoming text data (simulating social media streams), performs real-time sentiment analysis, and detects crisis-level spikes using sliding window analytics.

---

## 🧠 Overview

R3 is designed to simulate how modern platforms monitor brand reputation across social media. It combines:

* **Machine Learning (NLP)** for sentiment classification
* **Backend APIs** for processing and storage
* **Frontend dashboard** for visualization and insights

The system detects abnormal increases in negative sentiment and flags potential crises in real time.

---

## ✨ Key Features

* 🔄 Real-time data ingestion (manual + simulated stream)
* 🤖 AI-based sentiment analysis (Transformer model)
* 📊 Sliding window trend analysis (last 5 minutes)
* 🚨 Crisis detection based on negative spike threshold
* 💾 Persistent storage using SQLite
* 📡 REST APIs for frontend integration
* 🖥️ Interactive dashboard (React)

---

## 🏗️ Architecture

```
Frontend (React)
        ↓
Spring Boot Backend (API Layer)
        ↓
ML Service (Python - HuggingFace Model)
        ↓
SQLite Database
```

---

## ⚙️ Tech Stack

### Backend

* Java (Spring Boot)
* REST APIs
* JPA + Hibernate

### Frontend

* React
* Tailwind CSS

### ML Service

* Python
* HuggingFace Transformers
* PyTorch

### Database

* SQLite

---

## 🔗 API Endpoints

### Posts

* `POST /api/posts` → Create and analyze post
* `GET /api/posts` → Fetch all posts

### Sentiment

* `POST /api/sentiment/analyze` → Analyze text

### Analytics

* `GET /api/analytics/stats` → Get sentiment stats

### Crisis Detection

* `GET /api/crisis/status` → Get current crisis level

---

## 🧪 How It Works

1. User submits text (or simulated stream generates data)
2. Backend sends text to ML service
3. ML model returns sentiment + confidence score
4. Data is stored in database
5. Sliding window checks recent activity
6. If negative threshold exceeded → crisis flagged
7. Frontend dashboard updates in real-time

---

## ▶️ How to Run

### 1. Start ML Service

```bash
cd ml-service
pip install transformers torch fastapi uvicorn
python app.py
```

---

### 2. Start Backend

```bash
cd backend/reputationradar
mvn spring-boot:run
```

---

### 3. Start Frontend

```bash
cd frontend
npm install
npm start
```

---

## 📌 Future Improvements

* Live Twitter/Reddit API integration
* Kafka-based real-time streaming
* WebSocket live updates
* Advanced anomaly detection (ML-based)
* Role-based authentication

---

## 🎯 Use Cases

* Brand reputation monitoring
* Product outage detection
* Customer sentiment tracking
* Crisis management systems

---

## 📷 Demo (Optional)

*Add screenshots of dashboard here*

---

## 👨‍💻 Author

Nagesh Chillale
