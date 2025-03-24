from flask import Flask, request, jsonify
from evaluator import Evaluator

app = Flask(__name__)

@app.route("/")
def home():
    return jsonify({"message": "Hello, Flask!"})


@app.route('/evaluate', methods=['POST'])
def evaluate():
    try:
        # Get input JSON from request body
        data = request.get_json()

        if not data or not isinstance(data, dict):
            return jsonify({"error": "Invalid input, expected a dictionary"}), 400

        # Initialize Evaluator and run evaluation
        evaluator = Evaluator(data)
        evaluation_result = evaluator.run()

        return jsonify(evaluation_result), 200

    except Exception as e:
        print(e)
        return jsonify({"error": str(e)}), 500


if __name__ == "__main__":
    app.run(debug=True)
