import requests
import random

# CONFIG
BASE_URL = "http://127.0.0.1:8000/api/v1"
EMAIL = "ownerofkonkan@gmail.com"
PASSWORD = "Konkan@18"

# DATA TO UPLOAD
STAYS_DATA = [
    {
        "name": "Bamboo Bliss Cottage",
        "description": "Eco-friendly bamboo cottage right on Tarkarli beach.",
        "location": "Tarkarli, Malvan",
        "price_per_night": 2500,
        "facilities": ["Wifi", "Breakfast", "Beach View"]
    },
    {
        "name": "The Heritage Villa",
        "description": "A 100-year old Portuguese style villa with modern amenities.",
        "location": "Chivla Beach",
        "price_per_night": 4500,
        "facilities": ["AC", "Parking", "Pool", "Wifi"]
    },
    {
        "name": "Sunset Point Homestay",
        "description": "Simple, clean rooms overlooking the Sindhudurg Fort.",
        "location": "Malvan Jetty",
        "price_per_night": 1200,
        "facilities": ["Breakfast", "Parking"]
    },
    {
        "name": "Coral Reef Resort",
        "description": "Luxury tents with private access to the sea.",
        "location": "Devbagh",
        "price_per_night": 6000,
        "facilities": ["AC", "Wifi", "Pool", "Bar"]
    },
    {
        "name": "Konkan Nest",
        "description": "Authentic Malvani food and stay experience.",
        "location": "Achara",
        "price_per_night": 1800,
        "facilities": ["Parking", "Garden"]
    },
    {
        "name": "Blue Lagoon Studio",
        "description": "Modern studio apartment for digital nomads.",
        "location": "Malvan City",
        "price_per_night": 3000,
        "facilities": ["Wifi", "AC", "Work Desk"]
    }
]

def seed():
    print("🌱 SEEDING DATABASE...")

    # 1. Login as Owner
    print("🔹 Logging in...")
    try:
        login_res = requests.post(f"{BASE_URL}/auth/owner/login", json={"email": EMAIL, "password": PASSWORD})
        if login_res.status_code != 200:
            print("❌ Login Failed. Did you create the owner account?")
            return
        token = login_res.json()["access_token"]
        print("✅ Logged in successfully.")
    except Exception as e:
        print(f"❌ Server not running? Error: {e}")
        return

    # 2. Upload Stays
    headers = {"Authorization": f"Bearer {token}"}
    
    count = 0
    for stay in STAYS_DATA:
        print(f"🔹 Creating: {stay['name']}...")
        res = requests.post(f"{BASE_URL}/stays/", json=stay, headers=headers)
        
        if res.status_code == 200:
            print("   ✅ Created.")
            count += 1
        elif res.status_code == 403:
             print("   ❌ Failed: Owner is NOT VERIFIED. Please verify owner via Admin first.")
             break
        else:
            print(f"   ❌ Failed: {res.text}")

    print(f"\n✨ DONE. Created {count} stays.")

if __name__ == "__main__":
    seed()
    