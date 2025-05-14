# DeepFake Audio Detector API

This API provides a backend service for the DeepFake Audio Detector application.

## Setup

1. Create a virtual environment (recommended)
   ```
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

2. Install dependencies
   ```
   pip install -r requirements.txt
   ```

3. Model Files Required:
   - Place the following files in the `models/` directory:
     - `model.keras` - The TensorFlow model file
     - `scaler.pkl` - The fitted MinMaxScaler
     - `label_encoder.pkl` - The fitted LabelEncoder

4. Run the API
   ```
   python app.py
   ```

## API Endpoints

- `POST /api/detect` - Upload an audio file for classification
- `GET /api/health` - Check if the API is running

## Development Notes

- The API is configured to run in debug mode by default
- CORS is enabled for all origins
- Maximum file size is limited to 10MB