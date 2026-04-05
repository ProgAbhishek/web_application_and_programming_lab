"""
Relational (Django ORM / SQLite):
  - Strict schema (columns defined in models.py)
  - Relations via ForeignKey / ManyToMany
  - SQL under the hood: SELECT * FROM library_book WHERE ...

NoSQL (MongoDB via pymongo):
  - Flexible, schema-less documents (like JSON)
  - No migrations needed
  - Good for unstructured data (logs, reviews, activity feeds)
"""

import pymongo

client = pymongo.MongoClient("mongodb://localhost:27017/")
db     = client["library_nosql"]

# INSERT — no schema required
db.reviews.insert_one({
    "book_isbn": "9780743273565",
    "user":      "alice",
    "rating":    5,
    "comment":   "Loved it!",
    "tags":      ["classic", "must-read"],   # arrays — no join table needed
})

# QUERY
top_reviews = db.reviews.find({"rating": {"$gte": 4}})

# UPDATE
db.reviews.update_one(
    {"user": "alice"},
    {"$set": {"comment": "Still love it!"}}
)

# DELETE
db.reviews.delete_one({"user": "alice"})