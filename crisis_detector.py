import sqlite3
from datetime import datetime, timedelta
import time

def check_crisis():
    conn = sqlite3.connect("crisis.db")
    cursor = conn.cursor()

    now = datetime.now()
    five_min_ago = now - timedelta(minutes=5)
    sixty_min_ago = now - timedelta(minutes=60)

    neg_5 = cursor.execute(
        "SELECT COUNT(*) FROM posts WHERE sentiment='NEGATIVE' AND timestamp >= ?",
        (five_min_ago,)
    ).fetchone()[0]

    neg_60 = cursor.execute(
        "SELECT COUNT(*) FROM posts WHERE sentiment='NEGATIVE' AND timestamp >= ?",
        (sixty_min_ago,)
    ).fetchone()[0]

    avg_per_5 = neg_60 / 12 if neg_60 > 0 else 0

    print(f"NEGATIVE (5 min): {neg_5}")
    print(f"NEGATIVE (60 min): {neg_60}")

    if neg_5 > avg_per_5 * 2 and neg_5 > 3:
        print("🚨 CRISIS DETECTED 🚨")
    else:
        print("Normal")

    conn.close()
    print("-" * 40)

while True:
    check_crisis()
    time.sleep(10)
