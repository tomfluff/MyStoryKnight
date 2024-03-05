import os, sys
import uuid
from flask import Flask, jsonify, request, send_file, Response, stream_with_context
from flask_cors import CORS
from dotenv import load_dotenv

sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
from utils import save_base64_image, logger_setup
from config import *
from llm import Storyteller

load_dotenv()

# Specify the static folder path
app = Flask(__name__)
CORS(app)

# Get the environment variables
PORT = os.environ.get("PORT")
HOST = os.environ.get("FLASK_HOST")
OPENAI_API_KEY = os.environ.get("OPENAI_API_KEY")
OPENAI_ORG_ID = os.environ.get("OPENAI_ORG_ID")

DEBUG = FLASK_DEBUG

logger = logger_setup("app", os.path.join(LOG_FOLDER, "app.log"), debug=DEBUG)

STORAGE_PATH = "static"
os.makedirs(STORAGE_PATH, exist_ok=True)

# Initialize the storyteller
llm = Storyteller(OPENAI_API_KEY, OPENAI_ORG_ID)


@app.route("/api")
def index():
    # Return a json response representing the API, with the available endpoints
    response = dict(
        {
            "prefix": "/api",
            "endpoints": {
                "image": {
                    "methods": ["POST", "GET"],
                    "description": "Save and retrieve images",
                },
                "character": {
                    "methods": ["POST", "GET"],
                    "description": "Generate and retrieve characters",
                },
                "session": {
                    "methods": ["GET"],
                    "description": "Initialize and retrieve sessions",
                },
                "story/premise": {
                    "methods": ["POST"],
                    "description": "Generate a story premise",
                },
                "story/part": {
                    "methods": ["POST"],
                    "description": "Generate a story part",
                },
                "story": {
                    "methods": ["GET"],
                    "description": "Initialize a story",
                },
                "story/actions": {
                    "methods": ["POST"],
                    "description": "Generate story actions",
                },
                "read": {
                    "methods": ["POST"],
                    "description": "Read text using the API",
                },
            },
        }
    )
    # Sort the endpoints by name
    response["endpoints"] = dict(sorted(response["endpoints"].items()))
    return jsonify(type="success", message="API available", status=200, data=response)


@app.route("/api/image", methods=["POST"])
def image_save():
    # Save the base64 image
    data = request.get_json()

    base64_url = data["image"]
    img_data = base64_url.split(",", 1)[1]
    img_type = data["type"]

    if not base64_url:
        logger.error("No image found in the request!")
        logger.debug(data)
        return jsonify(type="error", message="No image found!", status=400)

    if img_type not in APP_IMAGE_EXT:
        logger.error("Invalid image type!")
        logger.debug(data)
        return jsonify(type="error", message="Invalid image type!", status=400)

    img_fname = f"img_{uuid.uuid4().hex}.{img_type}"
    img_path = os.path.join(STORAGE_PATH, img_fname)
    save_base64_image(img_data, img_path)

    logger.info(f"Image saved: {img_path}")
    return jsonify(type="success", message="Image saved!", status=200, name=img_fname)


@app.route("/api/image/<img_name>", methods=["GET"])
def image_get(img_name):
    # Get the base64 image
    img_path = os.path.join(STORAGE_PATH, img_name)
    img_type = img_name.split(".")[-1]

    if not os.path.exists(img_path):
        logger.error(f"Image not found: {img_path}")
        return jsonify(type="error", message="Image not found!", status=404)

    logger.info(f"Image sent: {img_path}")
    return send_file(img_path, mimetype=f"image/{img_type}")


@app.route("/api/character", methods=["POST"])
def character_gen():
    try:
        data = request.get_json()
        image = data.get("image", None)

        if not image:
            logger.error("No image found in the request!")
            logger.debug(data)
            return jsonify(type="error", message="No image found!", status=400)

        result = llm.generate_character(image)
        return jsonify(
            type="success",
            message="Character generated!",
            status=200,
            data={
                "id": uuid.uuid4(),
                "image": {"src": image, **result["image"]},
                "character": {**result["character"]},
            },
        )
    except Exception as e:
        logger.error(str(e))
        return jsonify({"error": str(e)}), 500


@app.route("/api/character/<char_id>", methods=["GET"])
def character_get(char_id):
    pass


@app.route("/api/session", methods=["GET"])
def session_init():
    try:
        session_id = uuid.uuid4()
        logger.info(f"Session initialized: {session_id}")
        return jsonify(
            type="success",
            message="Session initialized!",
            status=200,
            data={"id": session_id},
        )
    except Exception as e:
        logger.error(str(e))
        return jsonify({"error": str(e)}), 500


@app.route("/api/session/<session_id>", methods=["GET"])
def session_get(session_id):
    pass


@app.route("/api/story/premise", methods=["POST"])
def premise_gen():
    try:
        data = request.get_json()
        context = {
            "name": data.get("name", None),
            "about": data.get("backstory", None),
        }
        result = llm.generate_premise(context, PREMISE_GEN_COUNT)
        logger.debug(f"Story premise generated: {result}")
        return jsonify(
            type="success",
            message="Story premise generated!",
            status=200,
            data={**result},
        )
    except Exception as e:
        logger.error(str(e))
        return jsonify({"error": str(e)}), 500


@app.route("/api/story/part", methods=["POST"])
def storypart_gen():
    try:
        data = request.get_json()
        if not data:
            logger.error("No data found in the request!")
            return jsonify(type="error", message="No data found!", status=400)

        result = llm.generate_story_part(data)
        part_id = uuid.uuid4()
        logger.debug(f"Story part generated: {result}")
        return jsonify(
            type="success",
            message="Story part generated!",
            status=200,
            data={"id": part_id, **result},
        )
    except Exception as e:
        logger.error(str(e))
        return jsonify({"error": str(e)}), 500


@app.route("/api/story/init", methods=["POST"])
def story_init():
    try:
        data = request.get_json()
        if not data:
            logger.error("No data found in the request!")
            return jsonify(type="error", message="No data found!", status=400)

        context = {
            "setting": data.get("setting", None),
            "protagonist": {
                "name": data.get("fullname", None),
                "about": data.get("backstory", None),
            },
        }
        result = llm.initialize_story(context)
        story_id = uuid.uuid4()
        part_id = uuid.uuid4()
        logger.info(f"Story initialized!")
        return jsonify(
            type="success",
            message="Story initialized!",
            status=200,
            data={"id": story_id, "parts": [{"id": part_id, **result}]},
        )
    except Exception as e:
        logger.error(str(e))
        return jsonify({"error": str(e)}), 500


@app.route("/api/story/actions", methods=["POST"])
def actions_gen():
    try:
        data = request.get_json()
        if not data:
            logger.error("No data found in the request!")
            return jsonify(type="error", message="No data found!", status=400)

        result = llm.generate_actions(data)
        action_list = [
            {"id": uuid.uuid4(), **a, "active": True} for a in result["list"]
        ]
        logger.debug(f"Story actions generated: {result}")
        return jsonify(
            type="success",
            message="Story actions generated!",
            status=200,
            data={"list": action_list},
        )
    except Exception as e:
        logger.error(str(e))
        return jsonify({"error": str(e)}), 500


@app.route("/api/story/image", methods=["POST"])
def storyimage_gen():
    try:
        data = request.get_json()
        if not data:
            logger.error("No data found in the request!")
            return jsonify(type="error", message="No data found!", status=400)

        result = llm.generate_story_image(data)
        logger.debug(f"Story image generated: {result}")
        return jsonify(
            type="success",
            message="Story image generated!",
            status=200,
            data={**result},
        )
    except Exception as e:
        logger.error(str(e))
        return jsonify({"error": str(e)}), 500


@app.route("/api/read", methods=["POST"])
def read_text():
    try:
        data = request.get_json()
        text = data["text"]
        logger.debug(f"Generating speech for: {text}")
        return Response(
            stream_with_context(llm.send_tts_request(text)),
            mimetype="audio/mp3",
        )
    except Exception as e:
        logger.error(str(e))
        return jsonify({"error": str(e)}), 500


@app.errorhandler(404)
def not_found(e):
    return jsonify(type="error", message="Not found!", status=404)


if __name__ == "__main__":
    app.run(host=HOST, port=PORT, debug=DEBUG)
