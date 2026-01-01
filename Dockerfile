FROM python:3.11

# 1. Set workdir
WORKDIR /app

# 2. Install system deps (if needed)
RUN apt-get update && apt-get install -y \
    build-essential \
    && rm -rf /var/lib/apt/lists/*

# 3. Copy requirements first (cache optimization)
COPY requirements.txt .

# 4. Install python deps
RUN pip install --no-cache-dir -r requirements.txt

# 5. Copy backend code
COPY . .

# 6. Expose port
EXPOSE 8000

# 7. Run app
CMD ["uvicorn", "src.database.main_db:app", "--host", "0.0.0.0", "--port", "8000"]
