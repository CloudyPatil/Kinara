import requests

# ---------------------------------------------------------
# PASTE YOUR WEBHOOK URL INSIDE THE QUOTES BELOW 👇
# ---------------------------------------------------------
DISCORD_WEBHOOK_URL = "https://discordapp.com/api/webhooks/1455621116734214311/jiGUZtj09PLrgoGYyh2_Giv8c_MTiqKzQdIBHVmydZRX6pz7LUAz0dRBddaBrl3uSWr2"

def send_new_owner_alert(owner_name: str, owner_email: str, owner_phone: str):
    try:
        print(f"🔔 Attempting to notify Discord about {owner_name}...")
        
        # This is the message format Discord expects
        data = {
            "content": "@everyone 🚨 **New Host Waiting for Verification!**",
            "embeds": [
                {
                    "title": "New Signup Details",
                    "color": 16753920, # This creates an Orange sidebar color
                    "fields": [
                        {"name": "👤 Name", "value": owner_name, "inline": True},
                        {"name": "📧 Email", "value": owner_email, "inline": True},
                        {"name": "📞 Phone", "value": owner_phone, "inline": False}
                    ],
                    "footer": {
                        "text": "Login to Admin Dashboard to verify."
                    }
                }
            ]
        }

        # Send the message to the URL
        response = requests.post(DISCORD_WEBHOOK_URL, json=data)
        
        # Check if it worked
        if response.status_code == 204:
            print("✅ Discord Notification Sent Successfully!")
        else:
            print(f"⚠️ Discord Error Code: {response.status_code}")
            print(f"⚠️ Error Details: {response.text}")

    except Exception as e:
        print(f"❌ Notification Failed: {e}")