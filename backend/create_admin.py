from firebase_admin import credentials, firestore, initialize_app
from werkzeug.security import generate_password_hash

cred = credentials.Certificate("firebase-adminsdk.json")
initialize_app(cred)

db = firestore.client()

admin = {
    "first_name": "Admin",
    "last_name": "User",
    "email": "admin@gmail.com",
    "mobile": "9999999999",
    "password": generate_password_hash("admin123"),
    "group": "admin",
    "created_at": "2026-05-18"
}

db.collection("users").add(admin)

print("Admin created")