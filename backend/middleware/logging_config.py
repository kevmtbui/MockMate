"""Simple logging configuration for production"""
import logging
import sys
from datetime import datetime

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
    handlers=[
        logging.StreamHandler(sys.stdout),  # Console output
    ]
)

# Create logger
logger = logging.getLogger("mockmate")

# Don't log sensitive data
class SensitiveDataFilter(logging.Filter):
    def filter(self, record):
        # Remove sensitive patterns from logs
        if hasattr(record, 'msg'):
            msg = str(record.msg)
            # Don't log full resume text or API keys
            if 'GEMINI_API_KEY' in msg or len(msg) > 500:
                return False
        return True

logger.addFilter(SensitiveDataFilter())


