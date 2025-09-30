# AI Prompts Configuration

This directory contains centralized AI prompts for the MockMate application.

## File Structure

- `prompts.py` - Centralized AI prompts configuration

## Usage

All AI prompts are now centralized in the `AIPrompts` class in `prompts.py`. This makes it easy to:

1. **Edit prompts** - All prompts are in one place for easy modification
2. **Maintain consistency** - Same prompts used across different AI services
3. **Version control** - Track changes to prompts over time
4. **A/B testing** - Easy to switch between different prompt versions

## Available Prompts

### Question Generation
- `QUESTION_GENERATION_SYSTEM` - System message for question generation
- `QUESTION_GENERATION_USER` - User prompt template for question generation

### Feedback Generation
- `FEEDBACK_SYSTEM` - System message for feedback generation
- `FEEDBACK_USER_GENTLE` - Gentle feedback prompt (OpenAI service)
- `FEEDBACK_USER_HARSH` - Harsh feedback prompt (Local AI service)

### Resume Analysis
- `RESUME_ANALYSIS` - Prompt for analyzing resume content

### Fallback Data
- `FALLBACK_QUESTIONS` - Fallback questions by category
- `TEST_FEEDBACK` - Feedback for nonsensical/test answers
- `POOR_QUALITY_FEEDBACK` - Feedback for incomplete answers
- `FALLBACK_FEEDBACK` - General fallback feedback

## Editing Prompts

To modify any AI prompt:

1. Open `backend/config/prompts.py`
2. Find the prompt you want to modify
3. Edit the prompt text
4. Save the file
5. Restart the backend service

The changes will be applied immediately to all AI services that use the centralized prompts.

## Adding New Prompts

To add a new prompt:

1. Add the prompt as a class variable in the `AIPrompts` class
2. Update the relevant service file to use the new prompt
3. Document the new prompt in this README

## Template Variables

Many prompts use template variables that are filled in at runtime:

- `{number_of_questions}` - Number of questions to generate
- `{context}` - Context information (job details, resume, etc.)
- `{difficulty}` - Interview difficulty level
- `{job_level}` - Job level (entry, mid, senior, etc.)
- `{interview_type}` - Type of interview (technical, behavioral, etc.)
- `{resume_text}` - Resume text content

Make sure to include these variables in your prompt templates when creating new ones.
