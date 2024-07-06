import sqlite3
from datetime import datetime


#Initializing the database
def init_db():
    conn = sqlite3.connect('journal_entries.db')
    
    cursor = conn.cursor()
    cursor.execute('''
    CREATE TABLE IF NOT EXISTS journal_entries (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT,
        description TEXT,
        date TEXT,
        affirmations TEXT
    )
    ''')

    conn.commit()
    conn.close()

init_db()


#Saving Entries; 
def save_entry(data):
    title = data.get("title", "")
    description = data.get("description", "")
    affirmations = data.get("affirmations", [])
    date = datetime.now().isoformat()

    conn = sqlite3.connect('journal_entries.db')
    cursor = conn.cursor()
    cursor.execute('''
    INSERT INTO journal_entries (title, description, date, affirmations)
    VALUES (?, ?, ?, ?)
    ''', (title, description, date, ','.join(affirmations)))
    conn.commit()
    conn.close()

    return {"message": "Journal Entry saved!"}, 200
