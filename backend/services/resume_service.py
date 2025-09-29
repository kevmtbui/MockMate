import os
from typing import Optional
import PyPDF2
from docx import Document
import io

class ResumeService:
    @staticmethod
    def extract_text_from_file(file_path: str) -> Optional[str]:
        """Extract text from PDF or DOCX file"""
        try:
            if file_path.lower().endswith('.pdf'):
                return ResumeService._extract_from_pdf(file_path)
            elif file_path.lower().endswith(('.doc', '.docx')):
                return ResumeService._extract_from_docx(file_path)
            else:
                return None
        except Exception as e:
            print(f"Error extracting text from file: {e}")
            return None
    
    @staticmethod
    def extract_text_from_upload(file_content: bytes, filename: str) -> Optional[str]:
        """Extract text from uploaded file content"""
        try:
            if filename.lower().endswith('.pdf'):
                return ResumeService._extract_from_pdf_content(file_content)
            elif filename.lower().endswith(('.doc', '.docx')):
                return ResumeService._extract_from_docx_content(file_content)
            else:
                return None
        except Exception as e:
            print(f"Error extracting text from upload: {e}")
            return None
    
    @staticmethod
    def _extract_from_pdf(file_path: str) -> str:
        """Extract text from PDF file"""
        with open(file_path, 'rb') as file:
            pdf_reader = PyPDF2.PdfReader(file)
            text = ""
            for page in pdf_reader.pages:
                text += page.extract_text() + "\n"
        return text.strip()
    
    @staticmethod
    def _extract_from_pdf_content(file_content: bytes) -> str:
        """Extract text from PDF content"""
        pdf_reader = PyPDF2.PdfReader(io.BytesIO(file_content))
        text = ""
        for page in pdf_reader.pages:
            text += page.extract_text() + "\n"
        return text.strip()
    
    @staticmethod
    def _extract_from_docx(file_path: str) -> str:
        """Extract text from DOCX file"""
        doc = Document(file_path)
        text = ""
        for paragraph in doc.paragraphs:
            text += paragraph.text + "\n"
        return text.strip()
    
    @staticmethod
    def _extract_from_docx_content(file_content: bytes) -> str:
        """Extract text from DOCX content"""
        doc = Document(io.BytesIO(file_content))
        text = ""
        for paragraph in doc.paragraphs:
            text += paragraph.text + "\n"
        return text.strip()
    
    @staticmethod
    def summarize_resume(resume_text: str) -> str:
        """Create a summary of the resume for AI context"""
        # This could be enhanced with AI summarization
        # For now, return a truncated version
        if len(resume_text) > 1000:
            return resume_text[:1000] + "..."
        return resume_text
