from pymongo import MongoClient
from bson import ObjectId
from datetime import datetime

# ✅ MongoDB Atlas Connection
client = MongoClient("mongodb+srv://sath9030:sath9030@farmconnect.wk5ehlm.mongodb.net/farmconnect")
db = client["farmconnect"]
products = db.products

# 🔍 Find all malformed product documents
broken = products.find({
    "$or": [
        { "name": { "$exists": False } },
        { "price": { "$exists": False } },
        { "unit": { "$exists": False } },
        { "_id": { "$not": { "$type": "objectId" } } }
    ]
})

for bad in broken:
    print("Fixing:", bad)

    # Delete the invalid document
    products.delete_one({"_id": bad["_id"]})

    # Insert a new clean document with defaults
    fixed = {
        "name": bad.get("name", "Unnamed Product"),
        "price": bad.get("price", 0),
        "unit": bad.get("unit", "kg"),
        "category": bad.get("category", "Unknown"),
        "image": bad.get("image", "/static/images/default-produce.jpg"),
        "posted_by": bad.get("posted_by", "unknown"),
        "created_at": datetime.utcnow()
    }

    products.insert_one(fixed)

print("✅ All bad product entries fixed.")
