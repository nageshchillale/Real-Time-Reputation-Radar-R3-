import csv
import time
import sqlite3
from transformers import pipeline

print("Loading sentiment model...")
sentiment_pipeline = pipeline("sentiment-analysis")
print("Model loaded!")

# Connect to DB
conn = sqlite3.connect("crisis.db")
cursor = conn.cursor()

with open("posts.csv", "r", encoding="utf-8") as file:
    reader = csv.DictReader(file)

    for row in reader:
        text = row["text"]
        result = sentiment_pipeline(text)[0]
        sentiment = result["label"]

        cursor.execute(
            "INSERT INTO posts (text, sentiment) VALUES (?, ?)",
            (text, sentiment)
        )
        conn.commit()

        print(f"Post: {text}")
        print(f"Sentiment: {sentiment}")
        print("Saved to database")
        print("-" * 40)

        time.sleep(2)

conn.close()
