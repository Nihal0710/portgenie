FROM python:3.9-slim

WORKDIR /app

# Install system dependencies
RUN apt-get update && apt-get install -y --no-install-recommends \
    build-essential \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*

# Copy requirements file separately to leverage Docker caching
COPY requirements.txt .

# Install Python dependencies
RUN pip install --no-cache-dir -r requirements.txt

# Copy model scripts
COPY ai_detection_model.py ai_detection_service.py ./

# Expose port
EXPOSE 8000

# Run the FastAPI service
CMD ["uvicorn", "ai_detection_service:app", "--host", "0.0.0.0", "--port", "8000"] 