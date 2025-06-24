# controllers/main_routes.py
from flask import render_template, request, redirect, url_for, flash, session, jsonify
from werkzeug.security import generate_password_hash, check_password_hash
from werkzeug.utils import secure_filename
from bson.objectid import ObjectId
from datetime import datetime
import os

ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg'}

def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

def register_main_routes(app):
    users_collection = app.db.users
    products_collection = app.db.products
    chats_collection = app.db.chats

    if "home" not in app.view_functions:
        @app.route('/')
        def home():
            products = list(products_collection.find())
            return render_template('index.html', products=products)

    if "how_it_works" not in app.view_functions:
        @app.route('/howitworks')
        def how_it_works():
            return render_template('howitworks.html')

    if "about" not in app.view_functions:
        @app.route('/about')
        def about():
            return render_template('about.html')

    if "contact" not in app.view_functions:
        @app.route('/contact')
        def contact():
            return render_template('contact.html')

    if "faq" not in app.view_functions:
        @app.route('/faq')
        def faq():
            return render_template('faq.html')

    if "signup" not in app.view_functions:
        @app.route('/signup', methods=['GET', 'POST'])
        def signup():
            error = None
            if request.method == 'POST':
                name = request.form.get('name')
                email = request.form.get('email')
                password = request.form.get('password')
                confirm_password = request.form.get('confirmPassword')
                role = request.form.get('role') or ('farmer' if 'farmerForm' in request.form else 'buyer')

                if not name or not email or not password or not confirm_password:
                    error = "All fields are required."
                elif password != confirm_password:
                    error = "Passwords do not match."
                elif users_collection.find_one({"email": email}):
                    error = "Email is already registered."
                else:
                    hashed_pw = generate_password_hash(password)
                    users_collection.insert_one({
                        "name": name,
                        "email": email,
                        "password": hashed_pw,
                        "role": role,
                        "created_at": datetime.utcnow()
                    })
                    return redirect('/signin')

            return render_template('signup.html', error=error)

    if "signin" not in app.view_functions:
        @app.route('/signin', methods=['GET', 'POST'])
        def signin():
            error = None
            if request.method == 'POST':
                email = request.form.get('email')
                password = request.form.get('password')
                role = request.form.get('role')

                user = users_collection.find_one({"email": email})

                if not email or not password:
                    error = "All fields are required."
                elif not user:
                    error = "No account found with that email."
                elif not check_password_hash(user['password'], password):
                    error = "Incorrect password."
                elif role != user.get("role"):
                    error = f"You are registered as a {user['role']}. Please select the correct role."
                else:
                    session['user'] = user['name']
                    session['username'] = user['email']
                    session['role'] = user['role']
                    return redirect('/farmerdash' if user['role'] == 'farmer' else '/buyerdash')

            return render_template('signin.html', error=error)

    if "logout" not in app.view_functions:
        @app.route('/logout', methods=['POST'])
        def logout():
            session.clear()
            return redirect('/signin')

    if "products" not in app.view_functions:
        @app.route('/products')
        def products():
            return render_template('all_products.html')

    if "farmers" not in app.view_functions:
        @app.route('/farmers')
        def farmers():
            return render_template('farmers.html')

    if "add_produce" not in app.view_functions:
        @app.route('/add-produce', methods=['POST'])
        def add_produce():
            if "username" not in session or session.get("role") != "farmer":
                return redirect(url_for("signin"))

            category = request.form.get('category')
            name     = request.form.get('name')
            price    = request.form.get('price')
            unit     = request.form.get('unit')
            image    = request.files.get('image')

            if not all([category, name, price, unit, image]):
                flash("All fields (category, name, price, unit, image) are required.")
                return redirect(url_for('farmer_dashboard'))

            if not allowed_file(image.filename):
                flash("Invalid image format. Only png, jpg, jpeg allowed.")
                return redirect(url_for('farmer_dashboard'))

            filename = secure_filename(image.filename).replace(" ", "-")
            image_path = os.path.join(app.config['UPLOAD_FOLDER'], filename)
            image.save(image_path)

            produce = {
                "name": name,
                "category": category,
                "price": float(price),
                "unit": unit,
                "image": image_path.replace("\\", "/"),
                "posted_by": session["username"],
                "date_added": datetime.utcnow()
            }
            products_collection.insert_one(produce)

            flash("Produce added successfully!")
            return redirect(url_for('farmer_dashboard'))

    if "delete_produce" not in app.view_functions:
        @app.route('/delete-produce/<produce_id>', methods=['POST'])
        def delete_produce(produce_id):
            products_collection.delete_one({"_id": ObjectId(produce_id)})
            flash("Produce deleted successfully.")
            return redirect('/farmerdash')

    if "chat_page" not in app.view_functions:
        @app.route("/chat/<order_id>")
        def chat_page(order_id):
            user_name = session.get("user", "Guest")
            return render_template("chat.html", room_id=order_id, user_name=user_name)

    if "messages_json" not in app.view_functions:
        @app.route("/messages-json/<order_id>")
        def messages_json(order_id):
            messages = list(chats_collection.find({"room": order_id}))
            return jsonify([
                {"from": msg["from"], "text": msg["text"]}
                for msg in messages
            ])
