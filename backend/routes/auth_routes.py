from datetime import datetime, timedelta, UTC

import jwt

from functools import wraps

from flask import (
    Blueprint,
    request,
    jsonify
)

from firebase_admin import firestore

from google.cloud.firestore_v1.base_query import FieldFilter

from werkzeug.security import (
    generate_password_hash,
    check_password_hash
)

from config import JWT_SECRET_KEY


# =========================================================
# BLUEPRINT
# =========================================================

auth_bp = Blueprint(
    "auth_bp",
    __name__
)


# =========================================================
# OTP CONFIG
# =========================================================

OTP_CODE = "1234"

OTP_EXPIRY_MINUTES = 5

otp_store = {}


# =========================================================
# FIRESTORE DB
# =========================================================

def get_db():

    return firestore.client()


# =========================================================
# GENERATE JWT TOKEN
# =========================================================

def generate_token(user):

    payload = {

        "id":
            user["id"],

        "email":
            user["email"],

        "group":
            user.get("group", "user"),

        "exp":
            datetime.now(UTC) +
            timedelta(hours=12)
    }

    token = jwt.encode(
        payload,
        JWT_SECRET_KEY,
        algorithm="HS256"
    )

    return token


# =========================================================
# TOKEN REQUIRED
# =========================================================

def token_required(f):

    @wraps(f)

    def decorated(*args, **kwargs):

        token = request.headers.get(
            "Authorization"
        )

        if not token:

            return jsonify({
                "success": False,
                "message": "Token missing"
            }), 401

        try:

            token = token.replace(
                "Bearer ",
                ""
            )

            decoded = jwt.decode(
                token,
                JWT_SECRET_KEY,
                algorithms=["HS256"]
            )

            request.user = decoded

        except jwt.ExpiredSignatureError:

            return jsonify({
                "success": False,
                "message": "Token expired"
            }), 401

        except jwt.InvalidTokenError:

            return jsonify({
                "success": False,
                "message": "Invalid token"
            }), 401

        return f(*args, **kwargs)

    return decorated


# =========================================================
# ADMIN REQUIRED
# =========================================================

def admin_required(f):

    @wraps(f)

    def decorated(*args, **kwargs):

        user = request.user

        if user.get("group") != "admin":

            return jsonify({
                "success": False,
                "message": "Admin access only"
            }), 403

        return f(*args, **kwargs)

    return decorated


# =========================================================
# SEND OTP
# =========================================================

@auth_bp.route(
    "/send-otp",
    methods=["POST"]
)
def send_otp():

    try:

        data = request.get_json() or {}

        mobile = data.get(
            "mobile",
            ""
        ).strip()

        # VALIDATION

        if not mobile:

            return jsonify({
                "success": False,
                "message": "Mobile number required"
            }), 400

        if (
            not mobile.isdigit()
            or len(mobile) != 10
        ):

            return jsonify({
                "success": False,
                "message":
                    "Enter valid 10 digit mobile number"
            }), 400

        # STORE OTP

        otp_store[mobile] = {

            "otp":
                OTP_CODE,

            "expires_at":
                datetime.now(UTC) +
                timedelta(
                    minutes=OTP_EXPIRY_MINUTES
                )
        }

        print(
            f"[OTP SENT] {mobile} => {OTP_CODE}"
        )

        return jsonify({
            "success": True,
            "message": "OTP sent successfully"
        })

    except Exception as e:

        print("SEND OTP ERROR:", e)

        return jsonify({
            "success": False,
            "message": str(e)
        }), 500


# =========================================================
# VERIFY OTP
# =========================================================

@auth_bp.route(
    "/verify-otp",
    methods=["POST"]
)
def verify_otp():

    try:

        data = request.get_json() or {}

        mobile = data.get(
            "mobile",
            ""
        ).strip()

        otp = data.get(
            "otp",
            ""
        ).strip()

        action = data.get(
            "action",
            ""
        ).strip()

        # VALIDATION

        if not mobile or not otp:

            return jsonify({
                "success": False,
                "message":
                    "Mobile and OTP required"
            }), 400

        # CHECK OTP

        record = otp_store.get(mobile)

        if not record:

            return jsonify({
                "success": False,
                "message": "OTP not found"
            }), 400

        if (
            datetime.now(UTC) >
            record["expires_at"]
        ):

            otp_store.pop(
                mobile,
                None
            )

            return jsonify({
                "success": False,
                "message": "OTP expired"
            }), 400

        if record["otp"] != otp:

            return jsonify({
                "success": False,
                "message": "Invalid OTP"
            }), 400

        db = get_db()

        # CHECK USER

        users = db.collection(
            "users"
        ).where(
            filter=FieldFilter(
                "mobile",
                "==",
                mobile
            )
        ).stream()

        user = None

        for u in users:

            user = u.to_dict()

            user["id"] = u.id

        # =====================================================
        # REGISTER FLOW
        # =====================================================

        if action == "register":

            if user:

                return jsonify({
                    "success": False,
                    "message":
                        "User already exists"
                }), 400

            return jsonify({
                "success": True,
                "message":
                    "OTP verified successfully"
            })

        # =====================================================
        # LOGIN FLOW
        # =====================================================

        if action == "login":

            if not user:

                return jsonify({
                    "success": False,
                    "message":
                        "User not found"
                }), 404

            token = generate_token(user)

            return jsonify({

                "success": True,

                "message":
                    "Login successful",

                "token":
                    token,

                "user":
                    user
            })

        return jsonify({
            "success": False,
            "message": "Invalid action"
        }), 400

    except Exception as e:

        print("VERIFY OTP ERROR:", e)

        return jsonify({
            "success": False,
            "message": str(e)
        }), 500


# =========================================================
# SAVE PROFILE
# =========================================================

@auth_bp.route(
    "/save-profile",
    methods=["POST"]
)
def save_profile():

    try:

        db = get_db()

        data = request.get_json() or {}

        # GET VALUES

        first_name = data.get(
            "first_name",
            ""
        ).strip()

        last_name = data.get(
            "last_name",
            ""
        ).strip()

        dob = data.get(
            "dob",
            ""
        ).strip()

        email = data.get(
            "email",
            ""
        ).strip().lower()

        mobile = data.get(
            "mobile",
            ""
        ).strip()

        password = data.get(
            "password",
            ""
        ).strip()

        # VALIDATION

        required_fields = {

            "first_name":
                first_name,

            "last_name":
                last_name,

            "dob":
                dob,

            "email":
                email,

            "mobile":
                mobile,

            "password":
                password
        }

        for field_name, value in required_fields.items():

            if not value:

                return jsonify({
                    "success": False,
                    "message":
                        f"{field_name} required"
                }), 400

        # CHECK EMAIL EXISTS

        existing = db.collection(
            "users"
        ).where(
            filter=FieldFilter(
                "email",
                "==",
                email
            )
        ).stream()

        for _ in existing:

            return jsonify({
                "success": False,
                "message":
                    "Email already exists"
            }), 400

        # HASH PASSWORD

        hashed_password = generate_password_hash(
            password
        )

        # CREATE USER

        user = {

            "first_name":
                first_name,

            "last_name":
                last_name,

            "dob":
                dob,

            "email":
                email,

            "mobile":
                mobile,

            "password":
                hashed_password,

            # ROLE

            "group":
                "user",

            # PASSWORD TRACKING

            "password_updated_at":
                None,

            "password_update_count":
                0,

            "created_at":
                datetime.now(UTC).isoformat()
        }

        # SAVE USER

        ref = db.collection(
            "users"
        ).add(user)

        user["id"] = ref[1].id

        print(
            f"[USER CREATED] {email}"
        )

        return jsonify({

            "success": True,

            "message":
                "Profile saved successfully",

            "user":
                user
        })

    except Exception as e:

        print("SAVE PROFILE ERROR:", e)

        return jsonify({
            "success": False,
            "message": str(e)
        }), 500


# =========================================================
# LOGIN EMAIL
# =========================================================

@auth_bp.route(
    "/login-email",
    methods=["POST"]
)
def login_email():

    try:

        db = get_db()

        data = request.get_json() or {}

        email = data.get(
            "email",
            ""
        ).strip().lower()

        password = data.get(
            "password",
            ""
        ).strip()

        users = db.collection(
            "users"
        ).where(
            filter=FieldFilter(
                "email",
                "==",
                email
            )
        ).stream()

        user_data = None

        for user in users:

            temp = user.to_dict()

            stored_password = temp.get(
                "password"
            )

            if check_password_hash(
                stored_password,
                password
            ):

                user_data = temp

                user_data["id"] = user.id

        if not user_data:

            return jsonify({
                "success": False,
                "message":
                    "Invalid email or password"
            }), 400

        token = generate_token(
            user_data
        )

        return jsonify({

            "success": True,

            "token":
                token,

            "user":
                user_data
        })

    except Exception as e:

        print("LOGIN EMAIL ERROR:", e)

        return jsonify({
            "success": False,
            "message": str(e)
        }), 500


# =========================================================
# RESET PASSWORD
# =========================================================

@auth_bp.route(
    "/reset-password",
    methods=["POST"]
)
def reset_password():

    try:

        db = get_db()

        data = request.get_json() or {}

        email = data.get(
            "email",
            ""
        ).strip().lower()

        password = data.get(
            "password",
            ""
        ).strip()

        if not email or not password:

            return jsonify({
                "success": False,
                "message":
                    "Email and password required"
            }), 400

        users = db.collection(
            "users"
        ).where(
            filter=FieldFilter(
                "email",
                "==",
                email
            )
        ).stream()

        user_doc = None

        for user in users:

            user_doc = user

        if not user_doc:

            return jsonify({
                "success": False,
                "message":
                    "Registered email not found"
            }), 404

        user_data = user_doc.to_dict()

        hashed_password = generate_password_hash(
            password
        )

        password_update_count = (
            user_data.get(
                "password_update_count",
                0
            ) + 1
        )

        user_doc.reference.update({

            "password":
                hashed_password,

            "password_updated_at":
                datetime.now(UTC).isoformat(),

            "password_update_count":
                password_update_count
        })

        return jsonify({
            "success": True,
            "message":
                "Password updated successfully"
        })

    except Exception as e:

        print("RESET PASSWORD ERROR:", e)

        return jsonify({
            "success": False,
            "message": str(e)
        }), 500


# =========================================================
# UPDATE PASSWORD
# =========================================================

@auth_bp.route(
    "/update-password",
    methods=["POST"]
)
@token_required
def update_password():

    try:

        db = get_db()

        data = request.get_json() or {}

        # SECURE USER ID FROM JWT

        user_id = request.user["id"]

        old_password = data.get(
            "old_password",
            ""
        ).strip()

        new_password = data.get(
            "new_password",
            ""
        ).strip()

        if (
            not old_password
            or not new_password
        ):

            return jsonify({
                "success": False,
                "message":
                    "Old and new password required"
            }), 400

        user_ref = db.collection(
            "users"
        ).document(user_id)

        user_doc = user_ref.get()

        if not user_doc.exists:

            return jsonify({
                "success": False,
                "message":
                    "User not found"
            }), 404

        user_data = user_doc.to_dict()

        # VERIFY OLD PASSWORD

        if not check_password_hash(
            user_data["password"],
            old_password
        ):

            return jsonify({
                "success": False,
                "message":
                    "Old password incorrect"
            }), 400

        # HASH NEW PASSWORD

        new_hashed_password = generate_password_hash(
            new_password
        )

        current_count = user_data.get(
            "password_update_count",
            0
        )

        updated_count = (
            current_count + 1
        )

        # UPDATE FIRESTORE

        user_ref.update({

            "password":
                new_hashed_password,

            "password_updated_at":
                datetime.now(UTC).isoformat(),

            "password_update_count":
                updated_count
        })

        return jsonify({

            "success": True,

            "message":
                "Password updated successfully",

            "password_update_count":
                updated_count
        })

    except Exception as e:

        print("UPDATE PASSWORD ERROR:", e)

        return jsonify({
            "success": False,
            "message": str(e)
        }), 500
    