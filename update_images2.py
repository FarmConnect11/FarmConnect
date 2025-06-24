from app import app

# Update only for Mango (Kent)
name = "Mango (Kent)"
clean_name = name.lower().replace("(", "").replace(")", "").replace(" ", "-")
image_path = f"/static/images/{clean_name}.jpg"

result = app.db.products.update_one(
    {"name": name},
    {"$set": {"image": image_path}}
)

print(f"✔ Updated '{name}' → {image_path} | Matched: {result.matched_count}, Modified: {result.modified_count}")
