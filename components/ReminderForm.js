import { useState } from 'react';

export default function ReminderForm({ onAddReminder }) {
  const [title, setTitle] = useState('');
  const [datetime, setDatetime] = useState('');
  const [description, setDescription] = useState('');
  
  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!title || !datetime) {
      return;
    }
    
    onAddReminder({
      title,
      datetime,
      description,
    });
    
    // Reset form
    setTitle('');
    setDatetime('');
    setDescription('');
  };
  
  return (
    <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md">
      <div className="mb-4">
        <label htmlFor="reminder-title" className="block text-sm font-medium text-gray-700 mb-1">
          Title
        </label>
        <input
          id="reminder-title"
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
          className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          placeholder="Meeting with team"
        />
      </div>
      
      <div className="mb-4">
        <label htmlFor="reminder-datetime" className="block text-sm font-medium text-gray-700 mb-1">
          Date & Time
        </label>
        <input
          id="reminder-datetime"
          type="datetime-local"
          value={datetime}
          onChange={(e) => setDatetime(e.target.value)}
          required
          className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
        />
      </div>
      
      <div className="mb-6">
        <label htmlFor="reminder-description" className="block text-sm font-medium text-gray-700 mb-1">
          Description (optional)
        </label>
        <textarea
          id="reminder-description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows="3"
          className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          placeholder="Discuss project timeline and tasks"
        ></textarea>
      </div>
      
      <button
        type="submit"
        className="w-full px-4 py-2 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
      >
        Add Reminder
      </button>
    </form>
  );
}

