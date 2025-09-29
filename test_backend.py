#!/usr/bin/env python3
"""
Quick test to verify backend is working
"""
import requests
import json

def test_backend():
    try:
        # Test if backend is running
        response = requests.get("http://localhost:8000/docs")
        if response.status_code == 200:
            print("✅ Backend is running!")
            return True
        else:
            print(f"❌ Backend responded with status {response.status_code}")
            return False
    except Exception as e:
        print(f"❌ Cannot connect to backend: {e}")
        print("Start backend with: uvicorn main:app --reload")
        return False

def test_question_generation():
    try:
        # Test question generation endpoint
        request_data = {
            "settings": {
                "job_title": "Software Engineer",
                "company_name": "Tech Corp",
                "job_description": "Build web apps",
                "interview_type": "Technical",
                "difficulty": "Easy",
                "number_of_questions": 2,
                "answer_length": "Short",
                "prep_time": 30,
                "mid_interview_tips": True
            },
            "resume_text": None
        }
        
        response = requests.post(
            "http://localhost:8000/generate-questions",
            json=request_data,
            timeout=60
        )
        
        if response.status_code == 200:
            data = response.json()
            questions = data.get('questions', [])
            print(f"✅ Generated {len(questions)} questions!")
            for i, q in enumerate(questions[:2], 1):
                print(f"  {i}. {q.get('question', 'No question')}")
            return True
        else:
            print(f"❌ Question generation failed: {response.status_code}")
            return False
            
    except Exception as e:
        print(f"❌ Question generation error: {e}")
        return False

if __name__ == "__main__":
    print("🚀 Testing Backend API\n")
    
    if test_backend():
        print("✅ Backend is accessible")
    else:
        exit(1)
    
    if test_question_generation():
        print("\n🎉 Backend is working correctly!")
        print("\n📋 Frontend should now work with:")
        print("- Voice mode toggle")
        print("- Question generation")
        print("- Feedback system")
    else:
        print("\n❌ Backend has issues")
        exit(1)
