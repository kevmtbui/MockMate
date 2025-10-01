"""Initialize database and create tables"""
from database.config import engine, Base
from database.models import User, SavedResume, InterviewHistory

def init_database():
    """Create all database tables"""
    print("🔧 Creating database tables...")
    Base.metadata.create_all(bind=engine)
    print("✅ Database initialized successfully!")
    print("📊 Tables created:")
    print("   - users")
    print("   - saved_resumes")
    print("   - interview_history")
    print("")
    print("🚀 Database ready at: ./mockmate.db")

if __name__ == "__main__":
    init_database()



