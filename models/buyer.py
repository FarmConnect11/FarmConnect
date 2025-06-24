from datetime import datetime
from werkzeug.security import generate_password_hash

def create_buyer(name, email, password):
    return {
        "name": name,
        "email": email,
        "password": generate_password_hash(password),
        "role": "buyer",
        "joined_at": datetime.utcnow(),
        "orders": []   # Optional: store order history
    }

def update_buyer(existing_data, updates):
    for key in updates:
        if key in existing_data:
            existing_data[key] = updates[key]
    existing_data["updated_at"] = datetime.utcnow()
    return existing_data
