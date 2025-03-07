import uuid
from datetime import datetime, timedelta
import asyncio
import json
import os
from typing import Dict, List, Optional
import threading
import time

class ReminderService:
    def __init__(self):
        self.reminders = {}
        self.scheduled_tasks = {}
        self.data_file = "reminders.json"
        self.load_reminders()
        
        # Start the reminder checker thread
        self.checker_thread = threading.Thread(target=self._check_reminders, daemon=True)
        self.checker_thread.start()
    
    def load_reminders(self):
        """Load reminders from file"""
        if os.path.exists(self.data_file):
            try:
                with open(self.data_file, 'r') as f:
                    self.reminders = json.load(f)
            except Exception as e:
                print(f"Error loading reminders: {e}")
                self.reminders = {}
    
    def save_reminders(self):
        """Save reminders to file"""
        try:
            with open(self.data_file, 'w') as f:
                json.dump(self.reminders, f)
        except Exception as e:
            print(f"Error saving reminders: {e}")
    
    def get_all_reminders(self) -> List[Dict]:
        """Get all reminders"""
        return [
            {**reminder, "id": reminder_id} 
            for reminder_id, reminder in self.reminders.items()
        ]
    
    def create_reminder(self, reminder_data: Dict) -> Dict:
        """Create a new reminder"""
        reminder_id = str(uuid.uuid4())
        self.reminders[reminder_id] = reminder_data
        self.save_reminders()
        return {**reminder_data, "id": reminder_id}
    
    def delete_reminder(self, reminder_id: str):
        """Delete a reminder"""
        if reminder_id in self.reminders:
            del self.reminders[reminder_id]
            self.save_reminders()
            # Cancel scheduled task if exists
            if reminder_id in self.scheduled_tasks:
                self.scheduled_tasks[reminder_id].cancel()
                del self.scheduled_tasks[reminder_id]
    
    def schedule_reminder(self, reminder_id: str, reminder_time: datetime):
        """Schedule a reminder to trigger at the specified time"""
        if reminder_id not in self.reminders:
            return
        
        # Calculate seconds until reminder time
        now = datetime.now()
        time_diff = (reminder_time - now).total_seconds()
        
        if time_diff <= 0:
            # Already passed, don't schedule
            return
        
        # Schedule reminder notification
        # In a real app, this would send a notification to the user
        # For this example, we'll just print to console
        def reminder_callback():
            print(f"REMINDER: {self.reminders[reminder_id]['title']}")
            # Here you would send a notification to the user
        
        timer = threading.Timer(time_diff, reminder_callback)
        timer.daemon = True
        timer.start()
        
        self.scheduled_tasks[reminder_id] = timer
    
    def _check_reminders(self):
        """Background thread to check for upcoming reminders"""
        while True:
            try:
                now = datetime.now()
                for reminder_id, reminder in list(self.reminders.items()):
                    reminder_time = datetime.fromisoformat(reminder['datetime'].replace('Z', '+00:00'))
                    
                    # If reminder is within the next minute and not already scheduled
                    time_diff = (reminder_time - now).total_seconds()
                    if 0 < time_diff < 60 and reminder_id not in self.scheduled_tasks:
                        self.schedule_reminder(reminder_id, reminder_time)
            except Exception as e:
                print(f"Error checking reminders: {e}")
            
            # Sleep for a bit before checking again
            time.sleep(30)

