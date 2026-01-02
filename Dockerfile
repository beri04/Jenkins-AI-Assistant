# =========================
# Stage 1: Builder
# =========================
FROM python:3.11-slim AS builder

WORKDIR /app

# Install build dependencies ONLY for building wheels
RUN apt-get update && apt-get install -y \
    build-essential \
    gcc \
    && rm -rf /var/lib/apt/lists/*

# Copy requirements and build wheels
COPY requirements.txt .
RUN pip install --upgrade pip \
    && pip wheel --no-cache-dir --no-deps \
       --extra-index-url https://download.pytorch.org/whl/cpu \
       -r requirements.txt -w /wheels

# =========================
# Stage 2: Runtime
# =========================
FROM python:3.11-slim

WORKDIR /app

# Install ONLY runtime system deps (minimal)
RUN apt-get update && apt-get install -y \
    libstdc++6 \
    && rm -rf /var/lib/apt/lists/*

# Copy wheels from builder and install
COPY --from=builder /wheels /wheels
RUN pip install --no-cache-dir /wheels/*

# Copy application code ONLY
COPY src /app/src
COPY data /app/data

# Expose port
EXPOSE 8000

# Run app
CMD ["uvicorn", "src.database.main_db:app", "--host", "0.0.0.0", "--port", "8000"]
