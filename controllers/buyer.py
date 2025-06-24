from flask import render_template, request, redirect, session, flash, jsonify, url_for
from bson import ObjectId
from datetime import datetime
from app import app
import os
from werkzeug.utils import secure_filename
from werkzeug.security import check_password_hash, generate_password_hash

# === Upload Settings ===
ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg'}
UPLOAD_FOLDER = 'static/uploads'
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER

def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

# === BUYER DASHBOARD ===
@app.route("/buyerdash")
def buyerdash():
    if "username" not in session or session.get("role") != "buyer":
        return redirect(url_for("signin"))

    products = list(app.db.products.find({}))
    cart = session.get("cart", {})
    cart_count = sum(item.get("quantity", 0) for item in cart.values())
    return render_template("buyerdash.html", products=products, cart=cart, cart_count=cart_count)

# === ADD TO CART (AJAX) ===
from bson.errors import InvalidId

@app.route("/add-to-cart/<product_id>", methods=["POST"])
def add_to_cart(product_id):
    if "username" not in session or session.get("role") != "buyer":
        return jsonify({"error": "Unauthorized"}), 401

    try:
        product = app.db.products.find_one({"_id": ObjectId(product_id)})
    except InvalidId:
        return jsonify({"error": "Invalid product ID"}), 400

    if not product:
        return jsonify({"error": "Product not found"}), 404

    # Ensure required fields exist
    try:
        quantity = int(request.form.get("quantity", 1))
        cart = session.get("cart", {})
        if product_id in cart:
            cart[product_id]["quantity"] += quantity
        else:
            cart[product_id] = {
                "product_name": product.get("name", "Unknown"),
                "product_image_url": product.get("image", "/static/images/default-produce.jpg"),
                "price": product.get("price", 0),
                "quantity": quantity,
                "unit": product.get("unit", "kg"),
                "farmer_username": product.get("posted_by", "unknown")
            }
        session["cart"] = cart
        session.modified = True
        return jsonify({"message": f"{product['name']} x{quantity} added to cart.", "cart_count": sum(i["quantity"] for i in cart.values())})
    except Exception as e:
        print("❌ ERROR adding to cart:", e)
        return jsonify({"error": "Unexpected error. Please check server logs."}), 500


# === VIEW CART ===
@app.route("/Bmycart")
def my_cart():
    if "username" not in session or session.get("role") != "buyer":
        return redirect("/signin")
    cart = session.get("cart", {})
    return render_template("Bmycart.html", cart=list(cart.values()))

# === REMOVE FROM CART ===
@app.route("/remove-from-cart/<product_id>")
def remove_from_cart(product_id):
    if "username" not in session or session.get("role") != "buyer":
        return redirect("/signin")
    cart = session.get("cart", {})
    if product_id in cart:
        del cart[product_id]
        session["cart"] = cart
        session.modified = True
        flash("Item removed from cart.")
    return redirect("/Bmycart")

# === CHECKOUT CART ===
@app.route("/checkout-cart", methods=["POST"])
def checkout_cart():
    if "username" not in session or session.get("role") != "buyer":
        return redirect("/signin")

    cart = session.get("cart", {})
    if not cart:
        flash("Your cart is empty.")
        return redirect("/Bmycart")

    for product_id, item in cart.items():
        order = {
            "product_id": product_id,
            "product_name": item["product_name"],
            "product_image_url": item["product_image_url"],
            "quantity": item["quantity"],
            "unit": item["unit"],
            "buyer_name": session.get("user", "Anonymous"),
            "buyer_email": session.get("username", "unknown"),
            "farmer_username": item.get("farmer_username", "unknown"),
            "status": "Pending",
            "date": datetime.today().strftime('%Y-%m-%d')
        }
        app.db.orders.insert_one(order)

    session["cart"] = {}
    flash("All orders placed successfully!")
    return render_template("Bmycart.html", cart=[])

# === SINGLE PRODUCT VIEW ===
@app.route("/product/<product_id>")
def product_detail(product_id):
    product = app.db.products.find_one({"_id": ObjectId(product_id)})
    if not product:
        flash("Product not found.")
        return redirect("/buyerdash")

    farmer = app.db.farmers.find_one({"_id": product.get("farmer_id")}) or {
        "name": "Demo Farmer",
        "location": "Demo Village",
        "vegetables": ["Tomato", "Carrot", "Onion"]
    }

    related_products = list(app.db.products.find({
        "farmer_id": product.get("farmer_id"),
        "_id": {"$ne": product["_id"]}
    })) if product.get("farmer_id") else []

    return render_template("product_details.html", product=product, farmer=farmer, related_products=related_products)

# === PLACE SINGLE ORDER FROM PRODUCT PAGE ===
@app.route("/place-order/<product_id>", methods=["POST"])
def place_order(product_id):
    if "username" not in session:
        flash("Please log in to place an order.")
        return redirect("/signin")

    product = app.db.products.find_one({"_id": ObjectId(product_id)})
    if not product:
        flash("Product not found.")
        return redirect("/buyerdash")

    quantity = request.form.get("quantity", 1)
    unit = request.form.get("unit", "kg")

    order = {
        "product_id": product["_id"],
        "product_name": product["name"],
        "product_image_url": product["image"],
        "quantity": quantity,
        "unit": unit,
        "buyer_name": session.get("user", "Anonymous"),
        "buyer_email": session.get("username", "unknown"),
        "farmer_username": product.get("posted_by", "unknown"),
        "status": "Pending",
        "date": datetime.today().strftime('%Y-%m-%d')
    }

    result = app.db.orders.insert_one(order)
    flash("Order placed successfully!")
    return redirect("/buyerdash")

# === CHECKOUT SUMMARY VIEW ===
@app.route("/Bcheckout-summary")
def checkout_summary():
    if "username" not in session or session.get("role") != "buyer":
        return redirect("/signin")
    
    cart = session.get("cart", {})
    cart_items = list(cart.values())

    total_price = sum(item["quantity"] * item["price"] for item in cart_items)

    return render_template("Bcheckout_summary.html", cart=cart_items, total=total_price)

# === ALL PRODUCTS PAGE ===
@app.route("/products")
def view_products():
    if "username" not in session or session.get("role") != "buyer":
        return redirect("/signin")
    products = list(app.db.products.find())
    return render_template("products.html", products=products)

# === VIEW ALL ORDERS (WITH MESSAGES) ===
'''@app.route("/Bmyorders")
def buyer_orders():
    if "username" not in session or session.get("role") != "buyer":
        return redirect("/signin")

    buyer_email = session.get("email")
    orders = list(app.db.orders.find({"buyer_email": buyer_email}))
    order_ids = [str(order["_id"]) for order in orders]
    messages_by_order = {}

    for order_id in order_ids:
        msgs = list(app.db.chats.find({"room": order_id}))
        messages_by_order[order_id] = msgs

    return render_template("Bmyorders.html", orders=orders, messages_by_order=messages_by_order)'''

@app.route("/Bmyorders")
def buyer_orders():
    if "username" not in session or session.get("role") != "buyer":
        return redirect("/signin")

    buyer_email = session.get("username")
    print("DEBUG: session['username'] =", buyer_email)

    orders = list(app.db.orders.find({"buyer_email": buyer_email}))
    print("DEBUG: orders found =", orders)

    order_ids = [str(order["_id"]) for order in orders]
    messages_by_order = {}

    for order_id in order_ids:
        msgs = list(app.db.chats.find({"room": order_id}))
        messages_by_order[order_id] = msgs

    return render_template("Bmyorders.html", orders=orders, messages_by_order=messages_by_order)

# === BUYER SETTINGS ===
@app.route("/Bsettings", methods=["GET", "POST"])
def buyer_settings():
    if "username" not in session or session.get("role") != "buyer":
        return redirect("/signin")
    
    user = app.db.users.find_one({"email": session["username"]})
    if request.method == "POST":
        name = request.form.get("name")
        profile_photo = request.files.get("profile_photo")
        update_data = {}

        if name:
            update_data["name"] = name
            session["name"] = name

        if profile_photo and allowed_file(profile_photo.filename):
            filename = secure_filename(profile_photo.filename)
            path = os.path.join(app.config['UPLOAD_FOLDER'], filename)
            profile_photo.save(path)
            update_data["profile_photo"] = f"/static/uploads/{filename}"

        if update_data:
            app.db.users.update_one({"email": session["username"]}, {"$set": update_data})
            flash("Profile updated successfully!")

        # Password change
        current = request.form.get("current_password")
        new = request.form.get("new_password")
        confirm = request.form.get("confirm_password")

        if current and new and confirm:
            if not check_password_hash(user["password"], current):
                flash("Current password is incorrect.")
            elif new != confirm:
                flash("New passwords do not match.")
            else:
                hashed = generate_password_hash(new)
                app.db.users.update_one({"email": session["username"]}, {"$set": {"password": hashed}})
                flash("Password updated successfully!")

        return redirect("/Bsettings")

    return render_template("Bsettings.html", user=user)

# === CLEAR CART ===
@app.route("/clear-cart")
def clear_cart():
    session.pop("cart", None)
    flash("Cart cleared.")
    return redirect("/buyerdash")


@app.route("/update-quantity/<product_id>", methods=["POST"])
def update_quantity(product_id):
    if "username" not in session or session.get("role") != "buyer":
        return redirect("/signin")

    try:
        quantity = int(request.form.get("quantity"))
        if quantity <= 0:
            raise ValueError
    except:
        flash("Invalid quantity.")
        return redirect("/Bmycart")

    cart = session.get("cart", {})
    if product_id in cart:
        cart[product_id]["quantity"] = quantity
        session["cart"] = cart
        session.modified = True
        flash("Quantity updated.")

    return redirect("/Bmycart")
