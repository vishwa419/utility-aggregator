from fastapi import FastAPI, UploadFile, File, HTTPException, BackgroundTasks
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse
from pydantic import BaseModel
from typing import Dict, List, Optional, Union
import uvicorn
import uuid
import os
from datetime import datetime

from pdf_converter import convert_to_pdf
from reminder_service import ReminderService
from alarm_service import AlarmService

app = FastAPI(title="Utility Aggregator API")

# CORS middleware to allow frontend to call API
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, replace with actual frontend domain
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize services
reminder_service = ReminderService()
alarm_service = AlarmService()

# Create uploads directory if it doesn't exist
os.makedirs("uploads", exist_ok=True)
os.makedirs("uploads/pdf", exist_ok=True)

# PDF Conversion endpoint
@app.post("/convert-pdf")
async def convert_pdf(file: UploadFile = File(...)):
    try:
        # Save uploaded file
        file_extension = file.filename.split(".")[-1]
        temp_file_path = f"uploads/{str(uuid.uuid4())}.{file_extension}"
        
        with open(temp_file_path, "wb") as buffer:
            content = await file.read()
            buffer.write(content)
        
        # Convert to PDF
        pdf_path = await convert_to_pdf(temp_file_path)
        
        if not pdf_path:
            raise HTTPException(status_code=400, detail="Could not convert file to PDF")
        
        # Return path to the PDF file
        return {
            "success": True,
            "message": "File converted successfully",
            "pdfUrl": f"/download/{os.path.basename(pdf_path)}"
        }
    except Exception as e:
        print(f"Error converting to PDF: {e}")
        raise HTTPException(status_code=500, detail=str(e))

# Download endpoint for converted PDFs
@app.get("/download/{filename}")
async def download_file(filename: str):
    file_path = f"uploads/pdf/{filename}"
    if not os.path.exists(file_path):
        raise HTTPException(status_code=404, detail="File not found")
    return FileResponse(file_path, media_type="application/pdf")

# Reminder API models
class ReminderCreate(BaseModel):
    title: str
    datetime: str
    description: Optional[str] = None

class Reminder(ReminderCreate):
    id: str

# Reminder endpoints
@app.get("/reminders")
async def get_reminders():
    try:
        reminders = reminder_service.get_all_reminders()
        return {"success": True, "reminders": reminders}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/reminders")
async def create_reminder(reminder: ReminderCreate, background_tasks: BackgroundTasks):
    try:
        new_reminder = reminder_service.create_reminder(reminder.dict())
        # Schedule reminder in background
        reminder_time = datetime.fromisoformat(reminder.datetime.replace('Z', '+00:00'))
        background_tasks.add_task(
            reminder_service.schedule_reminder, 
            new_reminder["id"], 
            reminder_time
        )
        return {"success": True, "reminder": new_reminder}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.delete("/reminders/{reminder_id}")
async def delete_reminder(reminder_id: str):
    try:
        reminder_service.delete_reminder(reminder_id)
        return {"success": True, "message": "Reminder deleted successfully"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# Alarm API models
class AlarmCreate(BaseModel):
    time: str
    label: str = "Alarm"
    repeatDays: Dict[str, bool]
    isActive: bool = True

class Alarm(AlarmCreate):
    id: str

# Alarm endpoints
@app.get("/alarms")
async def get_alarms():
    try:
        alarms = alarm_service.get_all_alarms()
        return {"success": True, "alarms": alarms}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/alarms")
async def create_alarm(alarm: AlarmCreate, background_tasks: BackgroundTasks):
    try:
        new_alarm = alarm_service.create_alarm(alarm.dict())
        # Schedule alarm if active
        if alarm.isActive:
            background_tasks.add_task(
                alarm_service.schedule_alarm,
                new_alarm["id"],
                alarm.time,
                alarm.repeatDays
            )
        return {"success": True, "alarm": new_alarm}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.delete("/alarms/{alarm_id}")
async def delete_alarm(alarm_id: str):
    try:
        alarm_service.delete_alarm(alarm_id)
        return {"success": True, "message": "Alarm deleted successfully"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.patch("/alarms/{alarm_id}")
async def update_alarm(alarm_id: str, update_data: dict, background_tasks: BackgroundTasks):
    try:
        updated_alarm = alarm_service.update_alarm(alarm_id, update_data)
        
        # If alarm is toggled to active, schedule it
        if "isActive" in update_data and update_data["isActive"]:
            alarm = alarm_service.get_alarm(alarm_id)
            background_tasks.add_task(
                alarm_service.schedule_alarm,
                alarm_id,
                alarm["time"],
                alarm["repeatDays"]
            )
        
        return {"success": True, "alarm": updated_alarm}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)

