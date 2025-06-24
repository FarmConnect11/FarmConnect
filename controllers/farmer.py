from flask import render_template, request, redirect, session, flash
from werkzeug.utils import secure_filename
from bson import ObjectId
import os
from app import app

# ✅ Farmer Dashboard - View All Produce Posted by Farmer
@app.route("/farmerdash")
def farmer_dashboard():
    if "username" not in session or session.get("role") != "farmer":
        return redirect("/signin")

    produces = list(app.db.products.find({"posted_by": session["username"]}))
    return render_template("farmerdash.html", produces=produces)


# ✅ My Listings (Farmer's Own Products)
@app.route("/Fmylistings")
def my_listings():
    if "username" not in session or session.get("role") != "farmer":
        return redirect("/signin")

    listings = list(app.db.products.find({"posted_by": session["username"]}))
    return render_template("Fmylistings.html", listings=listings)


# ✅ View Orders Received by Farmer
@app.route("/Forders")
def view_orders():
    if "username" not in session or session.get("role") != "farmer":
        return redirect("/signin")

    orders = list(app.db.orders.find({"farmer_username": session["username"]}))
    return render_template("Forders.html", orders=orders)


# ✅ Messages Page (Farmer - Placeholder)



# ✅ All Orders (Duplicate route, useful for /orders endpoint)
@app.route("/orders")
def farmer_orders():
    if "username" not in session or session.get("role") != "farmer":
        return redirect("/signin")

    orders = list(app.db.orders.find({"farmer_username": session["username"]}))
    return render_template("Forders.html", orders=orders)


@app.route('/update-order/<order_id>', methods=['GET', 'POST'])
def update_order(order_id):
    if 'username' not in session or session.get("role") != "farmer":
        return redirect('/signin')

    order = app.db.orders.find_one({"_id": ObjectId(order_id)})
    if not order:
        flash("Order not found.")
        return redirect('/farmerdash')

    if request.method == 'POST':
        new_status = request.form.get('status')
        app.db.orders.update_one(
            {"_id": ObjectId(order_id)},
            {"$set": {"status": new_status}}
        )
        flash("Order status updated successfully.")
        return redirect('/Forders')

    return render_template('update_order.html', order=order)
