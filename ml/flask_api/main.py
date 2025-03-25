import os
from flask import Flask, request, jsonify
# from evaluator import Evaluator
from extraction import process_video, process_audio, process_image, process_text_file

app = Flask(__name__)

UPLOAD_FOLDER = "/home/satwikkaushik/HackLense/userUploads"

@app.route("/")
def home():
    return jsonify({"message": "Hello, Flask!"})


# @app.route('/evaluate', methods=['POST'])
# def evaluate():
#     try:
#         # Get input JSON from request body
#         data = request.get_json()

#         if not data or not isinstance(data, dict):
#             return jsonify({"error": "Invalid input, expected a dictionary"}), 400

#         # Initialize Evaluator and run evaluation
#         evaluator = Evaluator(data)
#         evaluation_result = evaluator.run()

#         return jsonify(evaluation_result), 200

#     except Exception as e:
#         print(e)
#         return jsonify({"error": str(e)}), 500


@app.route('/extract', methods=['POST'])
def extract_content():
    """API to extract semantic descriptions from uploaded files."""
    try:
        data = request.get_json()
        filename = data.get("fileURI") # example: idea.txt

        if not filename:
            return jsonify({"error": "No file found with provided name"}), 400

        file_path = os.path.join(UPLOAD_FOLDER, filename)
        if not os.path.exists(file_path):
            return jsonify({"error": "File not found"}), 404

        semantic_descriptions = {}
        
        # Process the file based on its type
        ext = os.path.splitext(file_path)[-1].lower()
        if ext in [".mp4", ".avi", ".mov"]:  # Video files
            semantic_descriptions = process_video(file_path)
        elif ext in [".wav", ".mp3", ".aac"]:  # Audio files
            semantic_descriptions = process_audio(file_path)
        elif ext in [".jpg", ".jpeg", ".png"]:  # Image files
            semantic_descriptions = process_image(file_path)
        elif ext == ".txt":  # Text files
            semantic_descriptions = process_text_file(file_path)
        else:
            return jsonify({"error": "Unsupported file format"}), 400

    except Exception as e:
        print(e)
        return jsonify({"error": str(e)}), 500

    return jsonify(semantic_descriptions), 200


if __name__ == "__main__":
    app.run(port=3001)
