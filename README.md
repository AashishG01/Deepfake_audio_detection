# DeepFake Audio Detector

A web application that uses machine learning to detect if an audio file is real or AI-generated (deepfake).

## Features

- Upload audio files (MP3, WAV, OGG) for analysis
- Real-time classification with confidence scores
- Detailed explanations of detection results
- Clean, intuitive user interface

## Technology Stack

- Frontend: React with TypeScript, Tailwind CSS
- Backend: Flask API
- ML: TensorFlow/Keras, Librosa for audio processing

## Project Structure

```
project/
├── api/                  # Flask backend
│   ├── app.py            # Main API application
│   ├── requirements.txt  # Python dependencies
│   └── models/           # Directory for ML model files
│
├── src/                  # React frontend
│   ├── components/       # React components
│   ├── App.tsx           # Main application component
│   └── main.tsx          # Entry point
│
├── public/               # Static assets
└── package.json          # Node.js dependencies
```

## Setup Instructions

### Frontend

1. Install dependencies:
   ```
   npm install
   ```

2. Start the development server:
   ```
   npm run dev
   ```

### Backend

1. Navigate to the API directory:
   ```
   cd api
   ```

2. Create and activate a virtual environment (recommended):
   ```
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

3. Install dependencies:
   ```
   pip install -r requirements.txt
   ```

4. Add Model Files:
   - Place your trained model files in the `api/models/` directory:
     - `model.keras`: The TensorFlow model
     - `scaler.pkl`: The fitted MinMaxScaler
     - `label_encoder.pkl`: The fitted LabelEncoder

5. Start the Flask server:
   ```
   python app.py
   ```

## Development

- Frontend runs on: http://localhost:5173
- Backend API runs on: http://localhost:5000

## Notes

- Maximum file size for upload is 10MB
- Supported file formats: MP3, WAV, OGG