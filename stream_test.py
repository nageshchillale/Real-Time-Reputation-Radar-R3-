import csv
import time

with open("posts.csv", "r", encoding="utf-8") as file:
    reader = csv.DictReader(file)

    for row in reader:
        print("New Post:", row["text"])
        time.sleep(2)
