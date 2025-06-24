from flask import Flask
from flask_pymongo import PyMongo
from flask_socketio import SocketIO, join_room, emit
from dotenv import load_dotenv
import os

# === Load environment variables ===
load_dotenv()

# === Create Flask App ===
app = Flask(__name__)
app.secret_key = os.getenv("SECRET_KEY", "supersecretkey")

# === MongoDB Setup ===
app.config["MONGO_URI"] = os.getenv("MONGO_URI")
mongo = PyMongo(app)
app.db = mongo.db

# === File Upload Folder ===
UPLOAD_FOLDER = 'static/uploads'
os.makedirs(UPLOAD_FOLDER, exist_ok=True)
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER

# === SocketIO Setup ===
socketio = SocketIO(app)

# === Import only route registration function
from controllers.main_routes import register_main_routes
from controllers.farmer import *   # these are fine if unique
from controllers.buyer import *



# Register once
register_main_routes(app)

# === Socket Events ===
@socketio.on('join_room')
def handle_join(data):
    join_room(data['room'])
    emit('status', {'msg': f"{data['from']} has joined the room."}, room=data['room'])

@socketio.on("send_message")
def handle_send_message(data):
    room = data["room"]
    msg = {
        "room": room,
        "from": data["from"],
        "text": data["text"]
    }
    app.db.chats.insert_one(msg)
    emit("receive_message", msg, to=room)


# === Run App ===
if __name__ == "__main__":
    socketio.run(app, debug=True)

