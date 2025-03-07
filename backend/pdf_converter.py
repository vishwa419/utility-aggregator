import os
from pypdf import PdfReader as Document
import asyncio
from typing import Optional
import subprocess

async def convert_to_pdf(file_path: str) -> Optional[str]:
    """
    Convert a file to PDF format
    
    Args:
        file_path: Path to the file to convert
        
    Returns:
        Path to the converted PDF file, or None if conversion fails
    """
    try:
        file_name = os.path.basename(file_path)
        file_name_without_ext = os.path.splitext(file_name)[0]
        output_path = f"uploads/pdf/{file_name_without_ext}.pdf"
        
        file_extension = os.path.splitext(file_path)[1].lower()
        
        if file_extension in ['.doc', '.docx', '.xls', '.xlsx', '.ppt', '.pptx']:
            # Use LibreOffice or similar for Office documents
            # This is a simplified example - in production, you would need LibreOffice installed
            process = await asyncio.create_subprocess_exec(
                'libreoffice', '--headless', '--convert-to', 'pdf', 
                '--outdir', 'uploads/pdf', file_path,
                stdout=asyncio.subprocess.PIPE,
                stderr=asyncio.subprocess.PIPE
            )
            await process.communicate()
            
            if os.path.exists(output_path):
                return output_path
            return None
            
        elif file_extension in ['.txt', '.html', '.md']:
            # Create a simple PDF from text-based files
            doc = Document()
            with open(file_path, 'r', encoding='utf-8') as f:
                content = f.read()
            
            doc.add_page()
            doc.add_text(content)
            doc.save(output_path)
            return output_path
            
        elif file_extension in ['.jpg', '.jpeg', '.png']:
            # Convert image to PDF
            doc = Document()
            doc.add_page()
            doc.add_image(file_path)
            doc.save(output_path)
            return output_path
            
        elif file_extension == '.pdf':
            # Already a PDF, just copy it
            with open(file_path, 'rb') as src, open(output_path, 'wb') as dst:
                dst.write(src.read())
            return output_path
            
        else:
            # Unsupported format
            return None
            
    except Exception as e:
        print(f"Error converting file to PDF: {e}")
        return None

