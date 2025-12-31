import requests

BASE_URL = "http://127.0.0.1:8000/api/v1"

# --- STEP 1: GET TOKENS ---
# (You might need to create these accounts first if they don't exist, 
# or just use the ones you created manually)

# Owner Login
owner_login = requests.post(f"{BASE_URL}/auth/owner/login", json={
    "email": "ownerofkonkan@gmail.com", 
    "password": "Konkan@18"
})
owner_token = owner_login.json()["access_token"]
print(f"✅ Owner Logged In")

# User Login (Use the user you created earlier)
user_login = requests.post(f"{BASE_URL}/auth/user/login", json={
    "email": "harshalgenai@gmail.com", 
    "password": "Harshal@321"
})
user_token = user_login.json()["access_token"]
print(f"✅ User Logged In")

# --- STEP 2: USER REQUESTS BOOKING ---
headers_user = {"Authorization": f"Bearer {user_token}"}
booking_payload = {
  "stay_id": 1, 
  "check_in": "2026-01-01",  # <--- Future Date
  "check_out": "2026-01-05", # <--- Future Date
  "guests": 2
}

print("🔹 User requesting booking...")
req = requests.post(f"{BASE_URL}/bookings/", json=booking_payload, headers=headers_user)
if req.status_code == 200:
    booking_id = req.json()["id"]
    print(f"✅ Booking Requested! ID: {booking_id} | Status: {req.json()['status']}")
else:
    print(f"❌ Booking Failed: {req.text}")
    exit()

# --- STEP 3: OWNER ACCEPTS BOOKING ---
headers_owner = {"Authorization": f"Bearer {owner_token}"}
action_payload = {"action": "accept"}

print(f"🔹 Owner accepting booking {booking_id}...")
accept_req = requests.post(f"{BASE_URL}/bookings/{booking_id}/action", json=action_payload, headers=headers_owner)

if accept_req.status_code == 200:
    print(f"✅ Owner Accepted! New Status: {accept_req.json()['status']}")
else:
    print(f"❌ Owner Action Failed: {accept_req.text}")