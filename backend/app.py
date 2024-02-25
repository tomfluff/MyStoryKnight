import os
from flask import Flask, jsonify
from flask_cors import CORS
from dotenv import load_dotenv

load_dotenv()

# Specify the static folder path
app = Flask(__name__)
CORS(app)

# Get the environment variables
PORT = os.environ.get("PORT")
DEBUG = os.environ.get("FLASK_DEBUG")


@app.route("/api/hello")
def hello():
    return jsonify(message="Hello from the backend!", status=200)


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=PORT, debug=DEBUG)
