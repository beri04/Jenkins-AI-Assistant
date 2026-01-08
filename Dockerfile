# =========================
# Stage 1: Builder
# =========================
FROM python:3.11-slim AS builder

WORKDIR /app

RUN apt-get update && apt-get install -y \
    build-essential \
    gcc \
    && rm -rf /var/lib/apt/lists/*

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

RUN apt-get update && apt-get install -y \
    libstdc++6 \
    && rm -rf /var/lib/apt/lists/*

COPY --from=builder /wheels /wheels
RUN pip install --no-cache-dir /wheels/*

# 🔴 APPLICATION CODE
COPY src /app/src
COPY runtime_data /app/data

# 🔥 FAISS ARTIFACTS (THIS WAS MISSING)
COPY embeddings /app/embeddings

EXPOSE 8000

CMD ["uvicorn", "src.database.main_db:app", "--host", "0.0.0.0", "--port", "8000"]
