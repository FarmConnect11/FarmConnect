from app import app

# List of products you want to update
product_names = [
    "Wildflower Honey", "Acacia Honey", "Manuka Honey", "Clover Honey", "Buckwheat Honey", "Eucalyptus Honey", "Orange Blossom Honey",
    "Chicken Eggs", "Duck Eggs", "Quail Eggs", "Organic Eggs", "Free-Range Eggs",
    "Dragon Fruit", "Passion Fruit", "Chia seeds", "Basmati Rice", "Brown Rice",
    "Arborio Rice", "Jasmine Rice", "Wild Rice", "Papaya (Maradol)"
]

# Go through each name and build the image path
for name in product_names:
    # Clean filename: lowercase, hyphens instead of spaces/parens
    clean_name = name.lower().replace("(", "").replace(")", "").replace(" ", "-")
    image_path = f"/static/images/{clean_name}.jpg"

    # Update MongoDB product entry
    result = app.db.products.update_one(
        {"name": name},
        {"$set": {"image": image_path}}
    )

    print(f"✔ Updated '{name}' → {image_path} | Matched: {result.matched_count}, Modified: {result.modified_count}")
