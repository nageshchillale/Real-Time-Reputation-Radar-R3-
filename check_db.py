import sqlite3

conn = sqlite3.connect("crisis.db")
cursor = conn.cursor()

rows = cursor.execute("SELECT * FROM posts").fetchall()

for r in rows:
    print(r)

conn.close()
