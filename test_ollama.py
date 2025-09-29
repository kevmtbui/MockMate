#!/usr/bin/env python3
"""
Test script to verify Ollama is working with our InterviewLab
"""
import requests
import json
from backend.models.interview_settings import InterviewSettings

def test_ollama_connection():
    """Test if Ollama is running and accessible"""
    try:
        response = requests.get("http://localhost:11434/api/tags")
        if response.status_code == 200:
            models = response.json()
            print("✅ Ollama is running!")
            print(f"Available models: {[model['name'] for model in models.get('models', [])]}")
            return True
        else:
            print(f"❌ Ollama responded with status {response.status_code}")
            return False
    except Exception as e:
        print(f"❌ Cannot connect to Ollama: {e}")
        print("Make sure Ollama is running with: ollama serve")
        return False

def test_question_generation():
    """Test question generation with Ollama"""
    try:
        settings = InterviewSettings(
            job_title="Software Engineer",
            company_name="Tech Corp",
            job_description="Build web applications using React and Node.js",
            interview_type="Technical",
            difficulty="Moderate",
            number_of_questions=3,
            answer_length="Medium",
            prep_time=30,
            mid_interview_tips=True
        )
        
        from backend.services.local_ai_service import LocalAIService
        
        print("\n🤖 Testing question generation...")
        questions = LocalAIService.generate_questions(settings, "Software developer with 3 years experience")
        
        print(f"✅ Generated {len(questions)} questions:")
        for i, q in enumerate(questions, 1):
            print(f"  {i}. {q.question}")
        
        return True
        
    except Exception as e:
        print(f"❌ Question generation failed: {e}")
        return False

def test_simple_ollama_call():
    """Test a simple Ollama API call"""
    try:
        response = requests.post(
            "http://localhost:11434/api/generate",
            json={
                "model": "llama3.1:8b",
                "prompt": "Say hello in one word",
                "stream": False
            },
            timeout=30
        )
        
        if response.status_code == 200:
            result = response.json()
            print(f"✅ Simple Ollama test: {result.get('response', 'No response')}")
            return True
        else:
            print(f"❌ Ollama API error: {response.status_code}")
            return False
            
    except Exception as e:
        print(f"❌ Simple Ollama test failed: {e}")
        return False

if __name__ == "__main__":
    print("🚀 Testing Ollama Integration for InterviewLab\n")
    
    # Test 1: Connection
    if not test_ollama_connection():
        exit(1)
    
    # Test 2: Simple API call
    if not test_simple_ollama_call():
        exit(1)
    
    # Test 3: Question generation
    if test_question_generation():
        print("\n🎉 All tests passed! Ollama is ready for InterviewLab!")
        print("\n📋 Next steps:")
        print("1. Start the backend: uvicorn main:app --reload")
        print("2. Start the frontend: npm run dev")
        print("3. Open http://localhost:5173 in your browser")
    else:
        print("\n❌ Some tests failed. Check the errors above.")
        exit(1)
