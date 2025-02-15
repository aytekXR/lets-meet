FROM python:3.9-slim

WORKDIR /app

# Install system dependencies required for psycopg2
RUN apt-get update && apt-get install -y \
    gcc \
    postgresql-client \
    libpq-dev \
    && rm -rf /var/lib/apt/lists/*

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

EXPOSE 8000

# Wait for database to be ready before starting the app
CMD ["sh", "-c", "while ! pg_isready -h db -p 5432; do sleep 1; done && uvicorn app.main:app --host 0.0.0.0 --port 8000"] 