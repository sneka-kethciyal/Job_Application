import os

from datetime import (
    datetime,
    timezone
)

from flask import (

    Flask,
    request,
    jsonify
)

from flask_cors import CORS

from werkzeug.utils import (
    secure_filename
)

# =========================================================
# FIREBASE
# =========================================================

import firebase_admin

from firebase_admin import (

    credentials,
    firestore
)

# =========================================================
# CLOUDINARY
# =========================================================

import cloudinary
import cloudinary.uploader

from cloudinary_config import *

# =========================================================
# AUTH
# =========================================================

from routes.auth_routes import (

    auth_bp,
    token_required,
    admin_required
)

# =========================================================
# FLASK APP
# =========================================================

app = Flask(__name__)
CORS(app, origins=[
    "http://localhost:5173",
    "http://127.0.0.1:5173",
    "https://job-frontend-849912006935.asia-south1.run.app"
])

# =========================================================
# FIREBASE SETUP
# =========================================================

try:

    cred = credentials.Certificate(
        "firebase-adminsdk.json"
    )

    firebase_admin.initialize_app(
        cred
    )

    db = firestore.client()

    print(
        "[OK] Firebase Connected Successfully"
    )

except Exception as e:

    print(
        "[ERROR] Firebase Error:",
        e
    )

    db = None

# =========================================================
# REGISTER BLUEPRINTS
# =========================================================

app.register_blueprint(auth_bp)

# =========================================================
# CLOUDINARY FILE UPLOAD
# =========================================================

def upload_to_cloudinary(file_obj, folder_name, resource_type="auto"):
    if not file_obj:
        return None

    result = cloudinary.uploader.upload(
        file_obj,
        folder=folder_name,
        resource_type=resource_type
    )

    return result.get("secure_url")
# =========================================================
# FIELD FORMAT
# =========================================================

def field(

    text_value,
    audio_path
):

    return {

        "text":
            text_value
            if text_value else "",

        "audio":
            audio_path
    }

# =========================================================
# ROOT
# =========================================================

@app.route("/")
def root():

    return jsonify({

        "status":
            "running",

        "project":
            "Job Application System",

        "database":
            "Firebase Firestore",

        "storage":
            "Cloudinary",

        "security":
            "JWT + RBAC Enabled"
    })

# =========================================================
# HEALTH
# =========================================================

@app.route("/health")
def health():

    return jsonify({

        "status":
            "ok",

        "firebase":
            "connected",

        "cloudinary":
            "connected"
    })

# =========================================================
# GET ALL USERS
# ADMIN ONLY
# =========================================================

@app.route(
    "/users",
    methods=["GET"]
)

@token_required
@admin_required

def get_users():

    try:

        docs = db.collection(
            "users"
        ).stream()

        users = []

        for doc in docs:

            data = doc.to_dict()

            data["id"] = doc.id

            data.pop(
                "password",
                None
            )

            users.append(data)

        return jsonify({

            "success": True,

            "count":
                len(users),

            "data":
                users
        })

    except Exception as e:

        print(
            "GET USERS ERROR:",
            e
        )

        return jsonify({

            "success": False,

            "message":
                str(e)
        }), 500

# =========================================================
# GET SINGLE USER
# ADMIN ONLY
# =========================================================

@app.route(
    "/users/<user_id>",
    methods=["GET"]
)

@token_required
@admin_required

def get_single_user(user_id):

    try:

        doc = db.collection(
            "users"
        ).document(
            user_id
        ).get()

        if not doc.exists:

            return jsonify({

                "success": False,

                "message":
                    "User not found"
            }), 404

        user_data = doc.to_dict()

        user_data["id"] = doc.id

        user_data.pop(
            "password",
            None
        )

        return jsonify({

            "success": True,

            "data":
                user_data
        })

    except Exception as e:

        print(
            "GET SINGLE USER ERROR:",
            e
        )

        return jsonify({

            "success": False,

            "message":
                str(e)
        }), 500

# =========================================================
# SUBMIT APPLICATION
# =========================================================

# =========================================================
# SUBMIT APPLICATION
# =========================================================

@app.route(
    "/submit-application",
    methods=["POST"]
)

@token_required

def submit_application():

    try:

        current_user = request.user

        # =====================================================
        # HELPER
        # =====================================================

        def get(name):

            return request.form.get(
                name,
                ""
            )

        # =====================================================
        # TEXT FIELDS
        # =====================================================

        job_code = get("job_code")

        first_name = get("first_name")
        last_name = get("last_name")
        dob = get("dob")

        tenth_mark = get("tenth_mark")
        twelfth_mark = get("twelfth_mark")

        ug_cgpa = get("ug_cgpa")

        ug_project_name = get(
            "ug_project_name"
        )

        ug_project_domain = get(
            "ug_project_domain"
        )

        ug_project_about = get(
            "ug_project_about"
        )

        has_pg = get("has_pg")

        pg_cgpa = get("pg_cgpa")

        pg_project_name = get(
            "pg_project_name"
        )

        pg_project_domain = get(
            "pg_project_domain"
        )

        pg_project_about = get(
            "pg_project_about"
        )

        about_yourself = get(
            "about_yourself"
        )

        comfortable_technology = get(
            "comfortable_technology"
        )

        # =====================================================
        # AUDIO HELPER
        # =====================================================

        def audio(field_name):

            file_obj = request.files.get(
                field_name
            )

            if not file_obj:

                return None

            return upload_to_cloudinary(

                file_obj,

                "job_application/audio",

                resource_type="auto"
            )

        # =====================================================
        # AUDIO FILES
        # =====================================================

        first_name_audio = audio(
            "first_name_audio"
        )

        last_name_audio = audio(
            "last_name_audio"
        )

        dob_audio = audio(
            "dob_audio"
        )

        tenth_mark_audio = audio(
            "tenth_mark_audio"
        )

        twelfth_mark_audio = audio(
            "twelfth_mark_audio"
        )

        ug_cgpa_audio = audio(
            "ug_cgpa_audio"
        )

        ug_project_name_audio = audio(
            "ug_project_name_audio"
        )

        ug_project_domain_audio = audio(
            "ug_project_domain_audio"
        )

        ug_project_about_audio = audio(
            "ug_project_about_audio"
        )

        pg_cgpa_audio = audio(
            "pg_cgpa_audio"
        )

        pg_project_name_audio = audio(
            "pg_project_name_audio"
        )

        pg_project_domain_audio = audio(
            "pg_project_domain_audio"
        )

        pg_project_about_audio = audio(
            "pg_project_about_audio"
        )

        about_yourself_audio = audio(
            "about_yourself_audio"
        )

        comfortable_technology_audio = audio(
            "comfortable_technology_audio"
        )

        # =====================================================
        # RESUME
        # =====================================================

        resume_file = request.files.get(
            "resume"
        )

        resume_path = None

        if (

            resume_file and
            resume_file.filename

        ):

           result = cloudinary.uploader.upload(
               resume_file,
               resource_type="auto",
               folder="job_application/resumes",
               format="pdf"
           )
           resume_path = result.get(
                "secure_url"
            )

        # =====================================================
        # CHECK EXISTING APPLICATION
        # =====================================================

        existing_query = (

            db.collection("applications")

            .where(
                "user_id",
                "==",
                current_user["id"]
            )

            .where(
                "job_code",
                "==",
                job_code
            )

            .limit(1)

            .stream()
        )

        existing_docs = list(
            existing_query
        )

        # =====================================================
        # CURRENT TIME
        # =====================================================

        now_time = (

            datetime.now(
                timezone.utc
            ).isoformat()
        )

        # =====================================================
        # FINAL DOCUMENT
        # =====================================================

        document = {

            "user_id":
                current_user["id"],

            "user_email":
                current_user["email"],

            "group":
                current_user["group"],

            "job_code":
                job_code,

            "first_name":
                field(
                    first_name,
                    first_name_audio
                ),

            "last_name":
                field(
                    last_name,
                    last_name_audio
                ),

            "dob":
                field(
                    dob,
                    dob_audio
                ),

            "tenth_mark":
                field(
                    tenth_mark,
                    tenth_mark_audio
                ),

            "twelfth_mark":
                field(
                    twelfth_mark,
                    twelfth_mark_audio
                ),

            "ug_cgpa":
                field(
                    ug_cgpa,
                    ug_cgpa_audio
                ),

            "ug_project_name":
                field(
                    ug_project_name,
                    ug_project_name_audio
                ),

            "ug_project_domain":
                field(
                    ug_project_domain,
                    ug_project_domain_audio
                ),

            "ug_project_about":
                field(
                    ug_project_about,
                    ug_project_about_audio
                ),

            "has_pg":
                has_pg,

            "pg_cgpa":
                field(
                    pg_cgpa,
                    pg_cgpa_audio
                ),

            "pg_project_name":
                field(
                    pg_project_name,
                    pg_project_name_audio
                ),

            "pg_project_domain":
                field(
                    pg_project_domain,
                    pg_project_domain_audio
                ),

            "pg_project_about":
                field(
                    pg_project_about,
                    pg_project_about_audio
                ),

            "about_yourself":
                field(
                    about_yourself,
                    about_yourself_audio
                ),

            "comfortable_technology":
                field(
                    comfortable_technology,
                    comfortable_technology_audio
                ),

            "resume_path":
                resume_path,

            "updated_at":
                now_time
        }

        # =====================================================
        # UPDATE EXISTING
        # =====================================================

        if existing_docs:

            existing_doc = existing_docs[0]

            old_data = existing_doc.to_dict()

            document["created_at"] = (

                old_data.get(
                    "created_at",
                    now_time
                )
            )

            if not resume_path:

                document["resume_path"] = (

                    old_data.get(
                        "resume_path"
                    )
                )

            db.collection(
                "applications"
            ).document(
                existing_doc.id
            ).update(document)

            return jsonify({

                "success": True,

                "message":
                    "Application Updated Successfully"
            })

        # =====================================================
        # CREATE NEW
        # =====================================================

        else:

            document["created_at"] = (
                now_time
            )

            db.collection(
                "applications"
            ).add(document)

            return jsonify({

                "success": True,

                "message":
                    "Application Submitted Successfully"
            })

    except Exception as e:

        print(
            "SUBMIT APPLICATION ERROR:",
            e
        )

        return jsonify({

            "success": False,

            "message":
                str(e)
        }), 500
# =========================================================
# GET APPLICATIONS
# ADMIN ONLY
# =========================================================

@app.route(
    "/applications",
    methods=["GET"]
)

@token_required
@admin_required

def get_applications():

    try:

        docs = db.collection(
            "applications"
        ).stream()

        applications = []

        for doc in docs:

            data = doc.to_dict()

            data["id"] = doc.id

            applications.append(data)

        return jsonify({

            "success": True,

            "count":
                len(applications),

            "data":
                applications
        })

    except Exception as e:

        print(
            "GET APPLICATIONS ERROR:",
            e
        )

        return jsonify({

            "success": False,

            "message":
                str(e)
        }), 500
    

    # =========================================================
# MY APPLICATIONS
# USER SAFE API
# =========================================================

@app.route(
    "/my-applications",
    methods=["GET"]
)

@token_required

def my_applications():

    try:

        current_user = request.user

        docs = (

            db.collection("applications")

            .where(
                "user_id",
                "==",
                current_user["id"]
            )

            .stream()
        )

        applications = []

        for doc in docs:

            data = doc.to_dict()

            data["id"] = doc.id

            # =========================================
            # REMOVE RESUME
            # =========================================

            data.pop(
                "resume_path",
                None
            )

            # =========================================
            # REMOVE AUDIOS
            # =========================================

            fields = [

                "first_name",
                "last_name",
                "dob",
                "tenth_mark",
                "twelfth_mark",
                "ug_cgpa",
                "ug_project_name",
                "ug_project_domain",
                "ug_project_about",
                "pg_cgpa",
                "pg_project_name",
                "pg_project_domain",
                "pg_project_about",
                "about_yourself",
                "comfortable_technology"
            ]

            for field_name in fields:

                if (

                    field_name in data and

                    isinstance(
                        data[field_name],
                        dict
                    )

                ):

                    data[field_name].pop(
                        "audio",
                        None
                    )

            applications.append(data)

        return jsonify({

            "success": True,

            "data":
                applications
        })

    except Exception as e:

        print(
            "MY APPLICATIONS ERROR:",
            e
        )

        return jsonify({

            "success": False,

            "message":
                str(e)
        }), 500

# =========================================================
# MAIN
# =========================================================

if __name__ == "__main__":

    print("[START] Flask Server Running")

    port = int(os.environ.get("PORT", 8080))

    app.run(
        debug=False,
        host="0.0.0.0",
        port=port
    )