from werkzeug.security import generate_password_hash, check_password_hash
from datetime import datetime

class User:
    def __init__(self, db):
        self.collection = db['users']

    def create_user(self, name, email, password, role):
        hashed_pw = generate_password_hash(password)
        user = {
            "name": name,
            "email": email,
            "password": hashed_pw,
            "role": role,
            "created_at": datetime.utcnow()
        }
        self.collection.insert_one(user)

    def find_by_email(self, email):
        return self.collection.find_one({"email": email})

    def verify_password(self, stored_pw, provided_pw):
        return check_password_hash(stored_pw, provided_pw)
