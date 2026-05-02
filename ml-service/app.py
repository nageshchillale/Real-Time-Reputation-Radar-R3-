from transformers import pipeline
from flask import Flask, request, jsonify

app = Flask(__name__)

sentiment_pipeline = pipeline("sentiment-analysis")

@app.route("/analyze", methods=["POST"])
def analyze():
    data = request.get_json(force=True)
    text = data.get("text", "")

    result = sentiment_pipeline(text)[0]

    return jsonify({
        "label": result["label"],
        "score": result["score"]
    })

if __name__ == "__main__":
    app.run(host="127.0.0.1", port=5000)
