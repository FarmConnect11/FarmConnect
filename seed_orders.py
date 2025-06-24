from pymongo import MongoClient
from bson.objectid import ObjectId
from datetime import datetime

# === MongoDB Setup ===
client = MongoClient("mongodb+srv://sath9030:sath9030@farmconnect.wk5ehlm.mongodb.net/farmconnect")
db = client.farmconnect


# === Sample Buyer Email ===
buyer_email = "buyer1@gmail.com"
buyer_name = "Vaishnavi"

# === Insert Sample Orders ===
orders = [
    {
        "product_id": "p1",
        "product_name": "Tomatoes",
        "product_image_url": "/static/images/tomato.jpg",
        "quantity": 5,
        "unit": "kg",
        "buyer_name": buyer_name,
        "buyer_email": buyer_email,
        "farmer_username": "farmer_rao",
        "status": "Pending",
        "date": datetime.today().strftime('%Y-%m-%d')
    },
    {
        "product_id": "p2",
        "product_name": "Onions",
        "product_image_url": "/static/images/onion.jpg",
        "quantity": 3,
        "unit": "kg",
        "buyer_name": buyer_name,
        "buyer_email": buyer_email,
        "farmer_username": "farmer_sita",
        "status": "Delivered",
        "date": "2025-06-05"
    }
]

# Insert and capture their IDs
inserted = db.orders.insert_many(orders)
order_ids = inserted.inserted_ids

print("✅ Inserted Orders:", order_ids)

# === Insert Sample Chat Messages ===
chat_messages = [
    {"room": str(order_ids[0]), "from": "farmer_rao", "text": "Hello, dispatching by 6PM today"},
    {"room": str(order_ids[0]), "from": buyer_name, "text": "Okay, thank you!"},

    {"room": str(order_ids[1]), "from": "farmer_sita", "text": "Delivered at your gate"},
    {"room": str(order_ids[1]), "from": buyer_name, "text": "Received. Great quality!"}
]

db.chats.insert_many(chat_messages)

print("✅ Chat messages inserted!")
