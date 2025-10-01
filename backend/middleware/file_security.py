"""File upload security middleware"""
from fastapi import HTTPException, UploadFile
from typing import Set

class FileSecurityConfig:
    # Max file size: 10MB
    MAX_FILE_SIZE = 10 * 1024 * 1024
    
    # Allowed MIME types
    ALLOWED_MIME_TYPES: Set[str] = {
        'application/pdf',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',  # .docx
        'application/msword'  # .doc
    }
    
    # Allowed file extensions
    ALLOWED_EXTENSIONS: Set[str] = {'.pdf', '.doc', '.docx'}

async def validate_upload_file(file: UploadFile) -> None:
    """Validate uploaded file for security"""
    
    # Check file size
    file_content = await file.read()
    file_size = len(file_content)
    
    if file_size > FileSecurityConfig.MAX_FILE_SIZE:
        raise HTTPException(
            status_code=413,
            detail=f"File too large. Maximum size is {FileSecurityConfig.MAX_FILE_SIZE / (1024*1024)}MB"
        )
    
    if file_size == 0:
        raise HTTPException(status_code=400, detail="Empty file uploaded")
    
    # Check MIME type
    if file.content_type not in FileSecurityConfig.ALLOWED_MIME_TYPES:
        raise HTTPException(
            status_code=400,
            detail=f"Invalid file type. Allowed types: PDF, DOC, DOCX"
        )
    
    # Check file extension
    if not any(file.filename.lower().endswith(ext) for ext in FileSecurityConfig.ALLOWED_EXTENSIONS):
        raise HTTPException(
            status_code=400,
            detail="Invalid file extension. Only PDF, DOC, and DOCX files are allowed"
        )
    
    # Reset file pointer for further processing
    await file.seek(0)
    
    return file_content


