from datetime import datetime
from collections import Counter
from pymongo import MongoClient
from dotenv import load_dotenv
from bson import ObjectId
import os

load_dotenv()

client = MongoClient(os.getenv("MONGODB_URI"))
db = client["CityConnect"]
orders_collection = db["orderhistories"]

user_id = "68f47901d8d1e7275a2c99c8"
orders = list(orders_collection.find({"userId": ObjectId(user_id)}))

delivered_orders = [o for o in orders if o["status"] == "processing" or o["status"] == "delivered"]

delivered_orders.sort(key=lambda x: x["orderDate"], reverse=True)

recent_orders = delivered_orders[:20]

category_counter = Counter()
for order in recent_orders:
    for item in order["items"]:
        category_counter[item["category"]] += item["quantity"]

top_two = category_counter.most_common(2)

if len(top_two) == 0:
    print("No delivered orders")
else:
    print("🛒 Recommendation System Result:")
    print("Most delivered categories:")
    for cat, qty in top_two:
        print(f" - {cat} ({qty} items ordered)")

    recommended_categories = [c[0] for c in top_two]
    print("\nRecommended :", recommended_categories)
