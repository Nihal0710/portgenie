# AI Detection Service

This service uses a Hugging Face transformer model to detect AI-generated content with high accuracy.

## Setup Instructions

### Prerequisites
- Python 3.9+
- Docker and Docker Compose (for containerized setup)
- At least 4GB of RAM available

### Option 1: Local Setup

1. Install the required packages:
   ```bash
   pip install -r requirements.txt
   ```

2. Run the FastAPI service:
   ```bash
   uvicorn ai_detection_service:app --host 0.0.0.0 --port 8000
   ```

### Option 2: Docker Setup (Recommended)

1. Build and run the Docker container:
   ```bash
   docker-compose up -d
   ```

2. To stop the service:
   ```bash
   docker-compose down
   ```

## API Usage

The service exposes a FastAPI endpoint at `http://localhost:8000/detect` that accepts POST requests with the following JSON body:

```json
{
  "text": "Text to analyze for AI generation",
  "threshold": 0.5
}
```

Example response:

```json
{
  "probability": 0.8732,
  "is_ai_generated": true,
  "processing_time": 0.423
}
```

## Model Information

This service uses the `desklib/ai-text-detector-v1.01` model from Hugging Face, which is a fine-tuned transformer model specialized in detecting AI-generated text.

## Integration with Next.js App

The Next.js application communicates with this service through the `/api/ai-detection` endpoint. Make sure the environment variable `AI_DETECTION_SERVICE_URL` is set properly in your `.env` file.

## Troubleshooting

- If you encounter CUDA-related errors, the model will fall back to CPU processing.
- If the model fails to download, check your internet connection or manually download it from Hugging Face.
- For memory-related issues, adjust the memory limit in `docker-compose.yml`. 