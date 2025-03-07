import uuid
import json
import os
import threading
import time
from datetime import datetime
from typing import Dict, List, Optional

class AlarmService:
    def __init__(self):
        self.alarms = {}
        self.scheduled_tasks = {}
        self.data_file = "alarms.json"
        self.load_alarms()
        
        # Start the alarm checker thread
        self.checker_thread = threading.Thread(target=self._check_alarms, daemon=True)
        self.checker_thread.start()
    
    def load_alarms(self):
        """Load alarms from file"""
        if os.path.exists(self.data_file):
            try:
                with open(self.data_file, 'r') as f:
                    self.alarms = json.load(f)
            except Exception as e:
                print(f"Error loading alarms: {e}")
                self.alarms = {}
    
    def save_alarms(self):
        """Save alarms to file"""
        try:
            with open(self.data_file, 'w') as f:
                json.dump(self.alarms, f)
        except Exception as e:
            print(f"Error saving alarms: {e}")
    
    def get_all_alarms(self) -> List[Dict]:
        """Get all alarms"""
        return [
            {**alarm, "id": alarm_id} 
            for alarm_id, alarm in self.alarms.items()
        ]
    
    def get_alarm(self, alarm_id: str) -> Optional[Dict]:
        """Get a specific alarm"""
        if alarm_id in self.alarms:
            return {**self.alarms[alarm_id], "id": alarm_id}
        return None
    
    def create_alarm(self, alarm_data: Dict) -> Dict:
        """Create a new alarm"""
        alarm_id = str(uuid.uuid4())
        self.alarms[alarm_id] = alarm_data
        self.save_alarms()
        return {**alarm_data, "id": alarm_id}
    
    def update_alarm(self, alarm_id: str, update_data: Dict) -> Dict:
        """Update an alarm"""
        if alarm_id not in self.alarms:
            raise Exception("Alarm not found")
        
        self.alarms[alarm_id] = {**self.alarms[alarm_id], **update_data}
        self.save_alarms()
        
        # Cancel scheduled task if alarm is deactivated
        if "isActive" in update_data and not update_data["isActive"]:
            if alarm_id in self.scheduled_tasks:
                self.scheduled_tasks[alarm_id].cancel()
                del self.scheduled_tasks[alarm_id]
        
        return {**self.alarms[alarm_id], "id": alarm_id}
    
    def delete_alarm(self, alarm_id: str):
        """Delete an alarm"""
        if alarm_id in self.alarms:
            del self.alarms[alarm_id]
            self.save_alarms()
            # Cancel scheduled task if exists
            if alarm_id in self.scheduled_tasks:
                self.scheduled_tasks[alarm_id].cancel()
                del self.scheduled_tasks[alarm_id]
    
    def schedule_alarm(self, alarm_id: str, alarm_time: str, repeat_days: Dict[str, bool]):
        """Schedule an alarm to trigger at the specified time"""
        if alarm_id not in self.alarms:
            return
        
        # Parse alarm time (format: HH:MM)
        hour, minute = map(int, alarm_time.split(':'))
        
        # Calculate seconds until alarm time
        now = datetime.now()
        alarm_datetime = now.replace(hour=hour, minute=minute, second=0, microsecond=0)
        
        # If the alarm time has already passed today, set it for tomorrow
        if alarm_datetime <= now:
            alarm_datetime = alarm_datetime.replace(day=alarm_datetime.day + 1)
        
        # Check if this alarm should run on the scheduled day
        weekday = alarm_datetime.strftime('%A').lower()
        if repeat_days and not repeat_days.get(weekday, False):
            # Skip this day, we'll check again tomorrow
            return
        
        time_diff = (alarm_datetime - now).total_seconds()
        
        # Schedule alarm notification
        # In a real app, this would send a notification to the user
        def alarm_callback():
            print(f"ALARM: {self.alarms[alarm_id]['label']} at {alarm_time}")
            # Here you would trigger the alarm sound/notification
            
            # Reschedule for next occurrence if this is a repeating alarm
            if any(repeat_days.values()):
                self.schedule_alarm(alarm_id, alarm_time, repeat_days)
        
        timer = threading.Timer(time_diff, alarm_callback)
        timer.daemon = True
        timer.start()
        
        self.scheduled_tasks[alarm_id] = timer
    
    def _check_alarms(self):
        """Background thread to check for upcoming alarms"""
        while True:
            try:
                now = datetime.now()
                for alarm_id, alarm in list(self.alarms.items()):
                    if not alarm.get('isActive', True):
                        continue
                    
                    # Parse alarm time
                    hour, minute = map(int, alarm['time'].split(':'))
                    alarm_datetime = now.replace(hour=hour, minute=minute, second=0, microsecond=0)
                    
                    # If the alarm time has already passed today, set it for tomorrow
                    if alarm_datetime <= now:
                        alarm_datetime = alarm_datetime.replace(day=alarm_datetime.day + 1)
                    
                    # Check if alarm should run on this day
                    weekday = alarm_datetime.strftime('%A').lower()
                    if alarm['repeatDays'] and not alarm['repeatDays'].get(weekday, False):
                        continue
                    
                    # If alarm is within the next minute and not already scheduled
                    time_diff = (alarm_datetime - now).total_seconds()
                    if 0 < time_diff < 60 and alarm_id not in self.scheduled_tasks:
                        self.schedule_alarm(alarm_id, alarm['time'], alarm['repeatDays'])
            except Exception as e:
                print(f"Error checking alarms: {e}")
            
            # Sleep for a bit before checking again
            time.sleep(30)

