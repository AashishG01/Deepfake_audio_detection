from flask import Flask, request, jsonify
from flask_cors import CORS
import os
import tempfile
import pickle
import numpy as np
import librosa
import tensorflow as tf
from werkzeug.utils import secure_filename

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

# Paths that will need to be updated when model files are provided
MODEL_PATH = 'models/model.keras'
SCALER_PATH = 'models/scaler.pkl'
LABEL_ENCODER_PATH = 'models/label_encoder.pkl'

# Constants
ALLOWED_EXTENSIONS = {'mp3', 'wav', 'ogg'}
MAX_CONTENT_LENGTH = 10 * 1024 * 1024  # 10MB max

# Create models directory if it doesn't exist
os.makedirs('models', exist_ok=True)

def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

# This function will be used once the model is available
def load_model_and_preprocessors():
    try:
        # Placeholder for when actual model files are provided
        if os.path.exists(MODEL_PATH):
            model = tf.keras.models.load_model(MODEL_PATH)
        else:
            # For testing without model files
            model = None
            
        if os.path.exists(SCALER_PATH):
            with open(SCALER_PATH, 'rb') as f:
                scaler = pickle.load(f)
        else:
            scaler = None
            
        if os.path.exists(LABEL_ENCODER_PATH):
            with open(LABEL_ENCODER_PATH, 'rb') as f:
                label_encoder = pickle.load(f)
        else:
            label_encoder = None
            
        return model, scaler, label_encoder
    except Exception as e:
        print(f"Error loading model: {e}")
        return None, None, None

# Extract MFCC features from audio
def extract_features(audio_path, n_mfcc=26):
    try:
        # Load the audio file
        y, sr = librosa.load(audio_path, sr=None)
        
        # Extract MFCCs
        mfccs = librosa.feature.mfcc(y=y, sr=sr, n_mfcc=n_mfcc)
        
        # Take the mean of each coefficient over time
        mfccs_mean = np.mean(mfccs, axis=1)
        
        # Check if we got the expected number of coefficients
        if len(mfccs_mean) != n_mfcc:
            print(f"Warning: Expected {n_mfcc} MFCCs, got {len(mfccs_mean)}")
            return None
            
        return mfccs_mean
    except Exception as e:
        print(f"Error extracting features: {e}")
        return None

# Classify audio using the model
def classify_audio(features, model, scaler, label_encoder):
    try:
        # For testing without model files
        if model is None or scaler is None or label_encoder is None:
            # Return mock result for development
            import random
            is_real = random.choice([True, False])
            confidence = random.uniform(0.65, 0.98)
            
            if is_real:
                label = "Real"
                explanation = "This audio appears to be genuine with natural vocal characteristics."
            else:
                label = "Deepfake"
                explanation = "This audio shows patterns consistent with AI-generated speech."
                
            return {
                "label": label,
                "probability": float(confidence),
                "explanation": explanation
            }
        
        # With actual model
        # Scale features
        scaled_features = scaler.transform(features.reshape(1, -1))
        
        # Reshape for LSTM (create sliding windows if that's what the model expects)
        # This might need adjustment based on the actual model architecture
        window_size = 5
        n_features = scaled_features.shape[1]
        n_windows = n_features - window_size + 1
        
        windows = np.zeros((1, n_windows, window_size))
        for i in range(n_windows):
            windows[0, i, :] = scaled_features[0, i:i+window_size]
        
        # Make prediction
        pred_prob = model.predict(windows, verbose=0)[0][0]
        pred_class = round(pred_prob)
        
        # Get the text label
        label = label_encoder.inverse_transform([pred_class])[0]
        
        # Generate explanation based on the prediction
        if label == "Real":
            explanation = "This audio shows natural vocal characteristics consistent with human speech."
        else:
            explanation = "This audio contains patterns and artifacts commonly found in AI-generated speech."
        
        return {
            "label": label,
            "probability": float(pred_prob),
            "explanation": explanation
        }
    except Exception as e:
        print(f"Error classifying audio: {e}")
        return None

@app.route('/api/detect', methods=['POST'])
def detect_audio():
    # Check if a file was uploaded
    if 'audio' not in request.files:
        return jsonify({"error": "No file uploaded"}), 400
        
    file = request.files['audio']
    
    # Check if the file is empty
    if file.filename == '':
        return jsonify({"error": "No file selected"}), 400
        
    # Check if the file is allowed
    if not allowed_file(file.filename):
        return jsonify({"error": "File type not supported. Please upload MP3, WAV, or OGG."}), 400
    
    try:
        # Create a temporary file
        temp_dir = tempfile.mkdtemp()
        temp_path = os.path.join(temp_dir, secure_filename(file.filename))
        file.save(temp_path)
        
        # Extract features
        features = extract_features(temp_path)
        if features is None:
            return jsonify({"error": "Could not extract features from the audio file"}), 400
            
        # Load model and preprocessors
        model, scaler, label_encoder = load_model_and_preprocessors()
        
        # Classify audio
        result = classify_audio(features, model, scaler, label_encoder)
        if result is None:
            return jsonify({"error": "Error during classification"}), 500
            
        # Clean up the temporary file
        os.remove(temp_path)
        os.rmdir(temp_dir)
        
        return jsonify(result), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/api/health', methods=['GET'])
def health_check():
    return jsonify({"status": "ok", "message": "API is running"}), 200

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)