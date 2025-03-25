from flask import Flask, request, jsonify, send_from_directory
import numpy as np
from tensorflow.keras.models import load_model
from tensorflow.keras.preprocessing import image
from PIL import Image
import io
import json
from datetime import datetime
import base64
import os

app = Flask(__name__)

# Load the trained model
model = load_model("DenseNet_Plant_Diseases.h5")

# Load the disease details JSON file
with open("disease_details.json", "r") as f:
    disease_details = json.load(f)

# Define class labels
class_labels = {
    0: "Apple___Apple_scab", 1: "Apple___Black_rot", 2: "Apple___Cedar_apple_rust", 3: "Apple___healthy",
    4: "Blueberry___healthy", 5: "Cherry_(including_sour)___Powdery_mildew", 6: "Cherry_(including_sour)___healthy",
    7: "Corn_(maize)___Cercospora_leaf_spot Gray_leaf_spot", 8: "Corn_(maize)___Common_rust_", 9: "Corn_(maize)___Northern_Leaf_Blight",
    10: "Corn_(maize)___healthy", 11: "Grape___Black_rot", 12: "Grape___Esca_(Black_Measles)", 13: "Grape___Leaf_blight_(Isariopsis_Leaf_Spot)",
    14: "Grape___healthy", 15: "Orange___Haunglongbing_(Citrus_greening)", 16: "Peach___Bacterial_spot", 17: "Peach___healthy",
    18: "Pepper,_bell___Bacterial_spot", 19: "Pepper,_bell___healthy", 20: "Potato___Early_blight", 21: "Potato___Late_blight",
    22: "Potato___healthy", 23: "Raspberry___healthy", 24: "Soybean___healthy", 25: "Squash___Powdery_mildew",
    26: "Strawberry___Leaf_scorch", 27: "Strawberry___healthy", 28: "Tomato___Bacterial_spot", 29: "Tomato___Early_blight",
    30: "Tomato___Late_blight", 31: "Tomato___Leaf_Mold", 32: "Tomato___Septoria_leaf_spot", 33: "Tomato___Spider_mites Two-spotted_spider_mite",
    34: "Tomato___Target_Spot", 35: "Tomato___Tomato_Yellow_Leaf_Curl_Virus", 36: "Tomato___Tomato_mosaic_virus", 37: "Tomato___healthy"
}

# JSON file to store feedback
FEEDBACK_FILE = "feedback.json"

# Ensure the feedback file exists
if not os.path.exists(FEEDBACK_FILE):
    with open(FEEDBACK_FILE, "w") as f:
        json.dump([], f)

# Function to preprocess image
def preprocess_image(img):
    img = img.resize((224, 224))  # Resize to match model input
    img_array = image.img_to_array(img)  # Convert to array
    img_array = np.expand_dims(img_array, axis=0)  # Expand dimensions for batch format
    img_array /= 255.0  # Normalize pixel values
    return img_array

# Function to predict disease
def predict_disease(img):
    img_array = preprocess_image(img)
    predictions = model.predict(img_array)
    predicted_class = np.argmax(predictions)
    confidence = np.max(predictions)
    disease_name = class_labels[predicted_class]
    return disease_name, confidence, predicted_class  # Return predicted_class as well

@app.route("/")
def index():
    return send_from_directory(".", "index.html")

@app.route("/cdisease")
def cdisease():
    return send_from_directory(".", "cdisease.html")

@app.route("/chatbot")
def chatbot():
    return send_from_directory(".", "chatbot.html")

@app.route('/translations/<lang>.json')
def get_translation(lang):
    return send_from_directory("static/translations", f"{lang}.json")


@app.route("/map")
def map():
    return send_from_directory(".", "map.html")

@app.route("/predict", methods=["POST"])
def predict():
    if "file" not in request.files:
        return jsonify({"error": "No file part"}), 400

    file = request.files["file"]

    if file.filename == "":
        return jsonify({"error": "No selected file"}), 400

    if file:
        image_data = Image.open(io.BytesIO(file.read()))
        disease_name, confidence, predicted_class = predict_disease(image_data)  # Get predicted_class
        disease_info = disease_details.get(str(predicted_class), {})  # Use predicted_class to fetch details

        # Convert image to Base64
        buffered = io.BytesIO()
        image_data.save(buffered, format="JPEG")
        img_base64 = base64.b64encode(buffered.getvalue()).decode("utf-8")

        return jsonify({
            "disease_name": disease_name,
            "confidence": float(confidence),
            "disease_info": disease_info,
            "image": img_base64  # Include the Base64 image in the response
        })

@app.route("/submit_feedback", methods=["POST"])
def submit_feedback():
    data = request.json
    predicted_disease = data.get("predicted_disease")
    corrected_disease = data.get("corrected_disease")
    image_base64 = data.get("image")  # Get the Base64 image from the request
    timestamp = datetime.now().strftime("%Y-%m-%d %H:%M:%S")

    try:
        # Load existing feedback
        if os.path.exists(FEEDBACK_FILE) and os.path.getsize(FEEDBACK_FILE) > 0:
            with open(FEEDBACK_FILE, "r") as f:
                feedback_data = json.load(f)
        else:
            feedback_data = []  # Initialize as an empty list if the file is empty or doesn't exist
    except json.JSONDecodeError:
        # Handle invalid JSON (e.g., corrupted file)
        feedback_data = []

    # Add new feedback
    feedback_data.append({
        "predicted_disease": predicted_disease,
        "corrected_disease": corrected_disease,
        "image": image_base64,  # Store the Base64 image
        "timestamp": timestamp
    })

    # Save updated feedback
    with open(FEEDBACK_FILE, "w") as f:
        json.dump(feedback_data, f, indent=4)

    return jsonify({"status": "success", "message": "Feedback submitted successfully!"})

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=7860, debug=os.getenv("FLASK_DEBUG", "False") == "True")
