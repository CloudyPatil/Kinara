import requests

# 1. PASTE YOUR OWNER TOKEN HERE (Inside the quotes)
TOKEN = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxIiwicm9sZSI6Im93bmVyIiwiZXhwIjoxNzY2MzkxNTk5fQ.sp_8Eb_i95rhKkJXhUaT6pEjY7ohsHl0-oLEY3DxW8s"

# 2. The API Endpoint
url = "http://127.0.0.1:8000/api/v1/stays/"

# 3. The Headers (This is what Swagger was missing!)
headers = {
    "Authorization": f"Bearer {TOKEN}",
    "Content-Type": "application/json"
}

# 4. The Data (The Hut)
payload = {
  "name": "Konkan Beach Hut",
  "description": "A lovely wooden hut near the sea.",
  "location": "Malvan Beach",
  "price_per_night": 1500,
  "facilities": ["Wifi", "Parking"]
}

# 5. Send Request
print(f"Sending request to {url}...")
response = requests.post(url, json=payload, headers=headers)

# 6. Print Result
print(f"Status Code: {response.status_code}")
print("Response:", response.json())