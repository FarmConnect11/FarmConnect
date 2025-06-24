from datetime import datetime
from werkzeug.security import generate_password_hash

def create_farmer(name, email, password):
    return {
        "name": name,                    # From "Farm Name" input
        "email": email,
        "password": generate_password_hash(password),
        "role": "farmer",
        "joined_at": datetime.utcnow(),
        "location": "",                  # Can be added later
        "phone": "",
        "products": [],                  # List of products added later
        "is_verified": False
    }

def update_farmer(existing_data, updates):
    for key in updates:
        if key in existing_data:
            existing_data[key] = updates[key]
    existing_data["updated_at"] = datetime.utcnow()
    return existing_data
    
