import os

from dotenv import load_dotenv

load_dotenv()

# =========================================================
# UPLOAD FOLDERS
# =========================================================

UPLOAD_FOLDER = os.getenv(
    "UPLOAD_FOLDER",
    "uploads"
)

AUDIO_FOLDER = os.getenv(
    "AUDIO_FOLDER",
    "uploads/audios"
)

RESUME_FOLDER = os.getenv(
    "RESUME_FOLDER",
    "uploads/resumes"
)

# =========================================================
# JWT CONFIG
# =========================================================

JWT_SECRET_KEY = os.getenv(
    "JWT_SECRET_KEY"
)

JWT_ALGORITHM = "HS256"

JWT_EXPIRE_HOURS = 24

# =========================================================
# CREATE FOLDERS
# =========================================================

os.makedirs(
    UPLOAD_FOLDER,
    exist_ok=True
)

os.makedirs(
    AUDIO_FOLDER,
    exist_ok=True
)

os.makedirs(
    RESUME_FOLDER,
    exist_ok=True
)