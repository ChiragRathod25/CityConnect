from datetime import datetime
from collections import Counter

# Given orderHistory data (copied from your JS array)
orderHistory = [
    {
        "id": "ORD-2024-001",
        "date": "2024-10-28",
        "status": "delivered",
        "total": 4096,
        "items": [
            {"name": "Artisan Coffee House Blend", "quantity": 2,
                "price": 299, "category": "Electronics"},
            {"name": "Premium Wireless Headphones", "quantity": 1,
                "price": 2499, "category": "Café & Restaurant"},
        ],
    },
    {
        "id": "ORD-2024-002",
        "date": "2024-10-25",
        "status": "processing",
        "total": 1299,
        "items": [
            {"name": "Handcrafted Leather Wallet", "quantity": 1,
                "price": 1299, "category": "Fashion & Accessories"},
        ],
    },
    {
        "id": "ORD-2024-003",
        "date": "2024-10-20",
        "status": "delivered",
        "total": 3598,
        "items": [
            {"name": "Artisan Coffee House Blend", "quantity": 3,
                "price": 299, "category": "Café & Restaurant"},
            {"name": "Premium Wireless Headphones", "quantity": 1,
                "price": 2499, "category": "Electronics"},
        ],
    },
    {
        "id": "ORD-2024-004",
        "date": "2024-10-18",
        "status": "cancelled",
        "total": 598,
        "items": [
            {"name": "Artisan Coffee House Blend", "quantity": 2,
                "price": 299, "category": "Café & Restaurant"},
        ],
    },
    {
        "id": "ORD-2024-005",
        "date": "2024-10-15",
        "status": "delivered",
        "total": 2499,
        "items": [
            {"name": "Premium Wireless Headphones", "quantity": 1,
                "price": 2499, "category": "Electronics"},
        ],
    },
    {
        "id": "ORD-2024-006",
        "date": "2024-09-12",
        "status": "delivered",
        "total": 1897,
        "items": [
            {"name": "Handcrafted Leather Wallet", "quantity": 1,
                "price": 1299, "category": "Fashion & Accessories"},
            {"name": "Artisan Coffee House Blend", "quantity": 2,
                "price": 299, "category": "Café & Restaurant"},
        ],
    },
    {
        "id": "ORD-2024-007",
        "date": "2024-08-10",
        "status": "delivered",
        "total": 897,
        "items": [
            {"name": "Artisan Coffee House Blend", "quantity": 3,
                "price": 299, "category": "Electronics"},
        ],
    },
]

# Step 1: Filter delivered orders
delivered_orders = [
    order for order in orderHistory if order["status"] == "delivered"]

# Step 2: Sort by date (latest first)
delivered_orders.sort(key=lambda x: datetime.strptime(
    x["date"], "%Y-%m-%d"), reverse=True)

# Step 3: Limit to latest N orders (e.g., 15 or 20)
N = 20
recent_orders = delivered_orders[:N]

# Step 4: Count category frequencies (weighted by quantity)
category_counter = Counter()
for order in recent_orders:
    for item in order["items"]:
        category_counter[item["category"]] += item["quantity"]

# Step 5: If multiple categories have the same top count, pick the most recent one
if category_counter:
    max_count = max(category_counter.values())
    top_categories = [cat for cat,
                      count in category_counter.items() if count == max_count]

    if len(top_categories) == 1:
        most_ordered_category = top_categories[0]
    else:
        # Find which top category appeared most recently
        most_recent_category = None
        latest_date = datetime.min
        for order in recent_orders:
            order_date = datetime.strptime(order["date"], "%Y-%m-%d")
            order_categories = {item["category"] for item in order["items"]}
            for cat in top_categories:
                if cat in order_categories and order_date > latest_date:
                    most_recent_category = cat
                    latest_date = order_date
        most_ordered_category = most_recent_category

    print("🛒 Recommendation System Result:")
    print(
        f"Based on your latest {len(recent_orders)} orders, you might like more from the '{most_ordered_category}' category!")
else:
    print("No delivered orders found to generate recommendations.")
