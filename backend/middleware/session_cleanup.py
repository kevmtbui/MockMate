"""
Session Cleanup Middleware for MockMate

This module provides session management functionality including:
- Session deletion
- Session statistics
- Cleanup utilities
"""

import os
import logging
from typing import Dict, Any, Optional
from datetime import datetime, timedelta

logger = logging.getLogger(__name__)

class SessionManager:
    """
    Manages interview sessions including cleanup and statistics.
    """
    
    def __init__(self):
        self.sessions: Dict[str, Dict[str, Any]] = {}
        self.deleted_sessions: int = 0
        self.created_sessions: int = 0
    
    def create_session(self, session_id: str, user_data: Dict[str, Any] = None) -> bool:
        """
        Create a new session.
        
        Args:
            session_id: Unique session identifier
            user_data: Optional user data to store with session
            
        Returns:
            bool: True if session created successfully
        """
        try:
            self.sessions[session_id] = {
                'created_at': datetime.now(),
                'last_accessed': datetime.now(),
                'user_data': user_data or {},
                'status': 'active'
            }
            self.created_sessions += 1
            logger.info(f"Session {session_id} created successfully")
            return True
        except Exception as e:
            logger.error(f"Failed to create session {session_id}: {e}")
            return False
    
    def delete_session(self, session_id: str) -> bool:
        """
        Delete a session and its associated data.
        
        Args:
            session_id: Session identifier to delete
            
        Returns:
            bool: True if session was deleted, False if not found
        """
        try:
            if session_id in self.sessions:
                # Mark session as deleted
                self.sessions[session_id]['status'] = 'deleted'
                self.sessions[session_id]['deleted_at'] = datetime.now()
                
                # Remove from active sessions
                del self.sessions[session_id]
                self.deleted_sessions += 1
                
                logger.info(f"Session {session_id} deleted successfully")
                return True
            else:
                logger.warning(f"Attempted to delete non-existent session: {session_id}")
                return False
        except Exception as e:
            logger.error(f"Failed to delete session {session_id}: {e}")
            return False
    
    def get_session(self, session_id: str) -> Optional[Dict[str, Any]]:
        """
        Get session data.
        
        Args:
            session_id: Session identifier
            
        Returns:
            Dict with session data or None if not found
        """
        try:
            if session_id in self.sessions:
                # Update last accessed time
                self.sessions[session_id]['last_accessed'] = datetime.now()
                return self.sessions[session_id]
            return None
        except Exception as e:
            logger.error(f"Failed to get session {session_id}: {e}")
            return None
    
    def cleanup_old_sessions(self, hours: int = 24) -> int:
        """
        Clean up sessions older than specified hours.
        
        Args:
            hours: Age threshold in hours
            
        Returns:
            int: Number of sessions cleaned up
        """
        try:
            cutoff_time = datetime.now() - timedelta(hours=hours)
            sessions_to_delete = []
            
            for session_id, session_data in self.sessions.items():
                if session_data['last_accessed'] < cutoff_time:
                    sessions_to_delete.append(session_id)
            
            for session_id in sessions_to_delete:
                self.delete_session(session_id)
            
            if sessions_to_delete:
                logger.info(f"Cleaned up {len(sessions_to_delete)} old sessions")
            
            return len(sessions_to_delete)
        except Exception as e:
            logger.error(f"Failed to cleanup old sessions: {e}")
            return 0
    
    def get_stats(self) -> Dict[str, Any]:
        """
        Get session statistics.
        
        Returns:
            Dict with session statistics
        """
        try:
            active_sessions = len(self.sessions)
            
            return {
                'active_sessions': active_sessions,
                'total_created': self.created_sessions,
                'total_deleted': self.deleted_sessions,
                'current_timestamp': datetime.now().isoformat(),
                'memory_usage_estimate': len(str(self.sessions))  # Rough estimate
            }
        except Exception as e:
            logger.error(f"Failed to get session stats: {e}")
            return {
                'error': str(e),
                'active_sessions': 0,
                'total_created': 0,
                'total_deleted': 0
            }
    
    def list_sessions(self) -> Dict[str, Dict[str, Any]]:
        """
        List all active sessions (for debugging).
        
        Returns:
            Dict of session_id -> session_data
        """
        try:
            # Return a copy without sensitive data
            safe_sessions = {}
            for session_id, session_data in self.sessions.items():
                safe_sessions[session_id] = {
                    'created_at': session_data['created_at'].isoformat(),
                    'last_accessed': session_data['last_accessed'].isoformat(),
                    'status': session_data['status']
                }
            return safe_sessions
        except Exception as e:
            logger.error(f"Failed to list sessions: {e}")
            return {}

# Global session manager instance
session_manager = SessionManager()

# Optional: Set up periodic cleanup (can be enabled if needed)
def setup_periodic_cleanup():
    """Set up periodic cleanup of old sessions."""
    import threading
    import time
    
    def cleanup_worker():
        while True:
            try:
                session_manager.cleanup_old_sessions(hours=24)  # Clean up sessions older than 24 hours
                time.sleep(3600)  # Run every hour
            except Exception as e:
                logger.error(f"Periodic cleanup error: {e}")
                time.sleep(3600)
    
    cleanup_thread = threading.Thread(target=cleanup_worker, daemon=True)
    cleanup_thread.start()
    logger.info("Periodic session cleanup started")

# Uncomment the line below to enable automatic cleanup
# setup_periodic_cleanup()

