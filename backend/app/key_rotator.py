import os
import logging
import threading
from dotenv import load_dotenv

# Find .env in the parent root directory (D:\draveon-platform\.env)
current_dir = os.path.dirname(os.path.abspath(__file__))
root_dir = os.path.dirname(os.path.dirname(current_dir)) # Go up from app/ to backend/ to root draveon-platform/
dotenv_path = os.path.join(root_dir, '.env')

load_dotenv(dotenv_path=dotenv_path)
logger = logging.getLogger("uvicorn.error")

class KeyRotator:
    _instance = None
    _lock = threading.Lock()
    
    def __new__(cls, *args, **kwargs):
        with cls._lock:
            if not cls._instance:
                cls._instance = super(KeyRotator, cls).__new__(cls)
                cls._instance._init_rotator()
            return cls._instance
            
    def _init_rotator(self):
        # Read the 6 keys from environment variables
        self.keys = []
        for i in range(1, 7):
            key = os.getenv(f"API_KEY_{i}")
            if key and key.strip():
                self.keys.append(key.strip())
                
        self.index = 0
        self.rotation_lock = threading.Lock()
        
        logger.info("llm_key_rotator_initialized configured=%s", bool(self.keys))
        if len(self.keys) == 0:
            logger.warning("WARNING: No API keys loaded! Chatbot queries will run in simulation mode.")

    def get_next_key(self):
        with self.rotation_lock:
            if not self.keys:
                return None
            key = self.keys[self.index]
            logger.info("llm_provider_key_selected")
            # Rotate to next key
            self.index = (self.index + 1) % len(self.keys)
            return key
            
    def get_key_count(self):
        return len(self.keys)
