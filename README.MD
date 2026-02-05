# Real-Time Reputation Radar (R3)

A prototype system that simulates live social media streams, performs real-time sentiment analysis using a pretrained transformer model, stores results in SQLite, and detects abnormal spikes in negative sentiment (crisis detection).

## Features
- Simulated live social media feed (CSV streaming)
- AI-based sentiment analysis
- SQLite storage
- Sliding window trend analysis
- Crisis detection alerts

## Tech Stack
- Python
- HuggingFace Transformers
- SQLite

## How to Run

1. Create virtual environment  
2. Install dependencies:
   pip install transformers torch

3. Create database:
   python db_setup.py

4. Run live stream + sentiment:
   python live_sentiment.py

5. Run crisis detector (new terminal):
   python crisis_detector.py
