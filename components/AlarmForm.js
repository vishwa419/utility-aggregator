import { useState } from 'react';

export default function AlarmForm({ onAddAlarm }) {
  const [time, setTime] = useState('');
  const [label, setLabel] = useState('');
  const [repeatDays, setRepeatDays] = useState({
    monday: false,
    tuesday: false,
    wednesday: false,
    thursday: false,
    friday: false,
    saturday: false,
    sunday: false,
  });
  
  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!time) {
      return;
    }
    
    onAddAlarm({
      time,
      label: label || 'Alarm',
      repeatDays,
      isActive: true,
    });
    
    // Reset form
    setTime('');
    setLabel('');
    setRepeatDays({
      monday: false,
      tuesday: false,
      wednesday: false,
      thursday: false,
      friday: false,
      saturday: false,
      sunday: false,
    });
  };
  
  const toggleDay = (day) => {
    setRepeatDays({
      ...repeatDays,
      [day]: !repeatDays[day],
    });
  };
  
  return (
    <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md">
      <div className="mb-4">
        <label htmlFor="alarm-time" className="block text-sm font-medium text-gray-700 mb-1">
          Time
        </label>
        <input
          id="alarm-time"
          type="time"
          value={time}
          onChange={(e) => setTime(e.target.value)}
          required
          className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
        />
      </div>
      
      <div className="mb-4">
        <label htmlFor="alarm-label" className="block text-sm font-medium text-gray-700 mb-1">
          Label (optional)
        </label>
        <input
          id="alarm-label"
          type="text"
          value={label}
          onChange={(e) => setLabel(e.target.value)}
          className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          placeholder="Wake up"
        />
      </div>
      
      <div className="mb-6">
        <span className="block text-sm font-medium text-gray-700 mb-2">
          Repeat
        </span>
        <div className="flex flex-wrap gap-2">
          {['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'].map((day) => (
            <button
              key={day}
              type="button"
              onClick={() => toggleDay(day)}
              className={`px-2 py-1 text-xs font-medium rounded-full ${
                repeatDays[day]
                  ? 'bg-blue-100 text-blue-800'
                  : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
              }`}
            >
              {day.charAt(0).toUpperCase() + day.slice(1, 3)}
            </button>
          ))}
        </div>
      </div>
      
      <button
        type="submit"
        className="w-full px-4 py-2 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
      >
        Add Alarm
      </button>
    </form>
  );
}

