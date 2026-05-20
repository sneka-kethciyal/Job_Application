import os

from datetime import (
    datetime,
    timezone
)

from flask import (

    Flask,
    request,
    jsonify,
    send_from_directory
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
# CONFIG
# =========================================================

from config import (

    AUDIO_FOLDER,
    RESUME_FOLDER
)

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

CORS(app)

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
# SAVE FILE HELPER
# =========================================================

def save_file(

    file_obj,
    folder,
    filename_override=None
):

    if file_obj is None:

        return None

    filename = (

        filename_override or
        secure_filename(
            file_obj.filename
        )
    )

    if not filename:

        return None

    os.makedirs(
        folder,
        exist_ok=True
    )

    path = os.path.join(
        folder,
        filename
    )

    file_obj.save(path)

    return path.replace(
        "\\",
        "/"
    )

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

            # REMOVE PASSWORD

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
# USER LOGIN REQUIRED
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
        # TIMESTAMP
        # =====================================================

        timestamp = str(

            int(
                datetime.now(
                    timezone.utc
                ).timestamp()
            )
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

            filename = secure_filename(f"{field_name}_audio.webm")

            return save_file(

                file_obj,

                AUDIO_FOLDER,

                filename
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

            filename = (

                f"{current_user['id']}_"
                f"{timestamp}_"
                f"{secure_filename(resume_file.filename)}"
            )

            resume_path = save_file(

                resume_file,

                RESUME_FOLDER,

                filename
            )

        # =====================================================
        # CHECK EXISTING APPLICATION
        # SAME USER + SAME JOB CODE
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
        # DATES
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

            # USER

            "user_id":
                current_user["id"],

            "user_email":
                current_user["email"],

            "group":
                current_user["group"],

            # JOB

            "job_code":
                job_code,

            # PERSONAL

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

            # ACADEMIC

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

            # UG

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

            # PG

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

            # FINAL

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

            # RESUME

            "resume_path":
                resume_path,

            # UPDATED TIME

            "updated_at":
                now_time
        }

        # =====================================================
        # UPDATE EXISTING APPLICATION
        # =====================================================

        if existing_docs:

            existing_doc = existing_docs[0]

            old_data = existing_doc.to_dict()

            # KEEP OLD CREATED TIME

            document["created_at"] = (

                old_data.get(
                    "created_at",
                    now_time
                )
            )

            # KEEP OLD RESUME IF NEW NOT UPLOADED

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
        # CREATE NEW APPLICATION
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
# AUDIO API
# =========================================================

@app.route(
    "/audio/<filename>"
)
@token_required
def get_audio(filename):

    return send_from_directory(

        AUDIO_FOLDER,
        filename
    )

# =========================================================
# RESUME API
# =========================================================

@app.route(
    "/resume/<filename>"
)
@token_required
@admin_required
def get_resume(filename):

    return send_from_directory(

        RESUME_FOLDER,
        filename
    )

# =========================================================
# MAIN
# =========================================================

if __name__ == "__main__":

    print(
        "[START] Flask Server Running"
    )

    print(
        "http://127.0.0.1:5000"
    )

    app.run(

        debug=True,

        host="0.0.0.0",

        port=5000
    )