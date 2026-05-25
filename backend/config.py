import os

from dotenv import load_dotenv

load_dotenv()

# =========================================================
# JWT CONFIG
# =========================================================

JWT_SECRET_KEY = os.getenv(
    "JWT_SECRET_KEY",
    "super-secret-key"
)

JWT_ALGORITHM = "HS256"

JWT_EXPIRE_HOURS = 24