import requests

BASE_URL = "http://127.0.0.1:8000/api/v1"

# 1. Login as Admin
print("🔹 Admin Logging in...")
login = requests.post(f"{BASE_URL}/admin/login", json={
    "email": "admin@localstay.com",
    "password": "Admin@123"
})

if login.status_code != 200:
    print(f"❌ Admin Login Failed: {login.text}")
    exit()

token = login.json()["access_token"]
headers = {"Authorization": f"Bearer {token}"}
print("✅ Admin Logged In")

# 2. Get Unverified Owners
print("🔹 Checking unverified owners...")
res = requests.get(f"{BASE_URL}/admin/unverified-owners", headers=headers)
owners = res.json()

if len(owners) == 0:
    print("✅ No unverified owners found (Maybe they are already verified?)")
else:
    print(f"⚠️ Found {len(owners)} unverified owners.")
    
    # 3. Verify ALL of them
    for owner in owners:
        oid = owner["id"]
        print(f"   -> Verifying Owner ID {oid} ({owner['email']})...")
        verify = requests.post(f"{BASE_URL}/admin/verify-owner/{oid}", headers=headers)
        
        if verify.status_code == 200:
            print("      ✅ Verified.")
        else:
            print(f"      ❌ Failed: {verify.text}")

print("✨ Verification Process Complete.")