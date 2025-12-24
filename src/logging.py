import logging
from logging.handlers import RotatingFileHandler
import os
from src.config.settings import LOGS

# Create logs directory if not exists
if not os.path.exists(LOGS):
    os.makedirs(LOGS)

# ------------------------------
# Handlers
# ------------------------------
app_handler = RotatingFileHandler(
    f"{LOGS}/app.log", maxBytes=5_000_000, backupCount=3
)
app_handler.setLevel(logging.INFO)

error_handler = RotatingFileHandler(
    f"{LOGS}/error.log", maxBytes=5_000_000, backupCount=3
)
error_handler.setLevel(logging.ERROR)

rag_handler = RotatingFileHandler(
    f"{LOGS}/rag.log", maxBytes=5_000_000, backupCount=3
)
rag_handler.setLevel(logging.INFO)

# ------------------------------
# Formatter
# ------------------------------
formatter = logging.Formatter(
    "%(asctime)s | %(levelname)s | %(message)s"
)

app_handler.setFormatter(formatter)
error_handler.setFormatter(formatter)
rag_handler.setFormatter(formatter)

# ------------------------------
# Root Logger
# ------------------------------
logger = logging.getLogger("")  # root logger
logger.setLevel(logging.INFO)

# Attach handlers (IMPORTANT!)
logger.addHandler(app_handler)
logger.addHandler(error_handler)
logger.addHandler(rag_handler)
