import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import Head from 'next/head';
import ReminderForm from '../components/ReminderForm';
import Layout from '../components/Layout';

export default function RemindersPage() {
  const [reminders, setReminders] = useState([]);
  
  useEffect(() => {
    // Fetch existing reminders
    const fetchReminders = async () => {
      try {
        const res = await fetch('http://localhost:8000/reminders');
        const data = await res.json();
        if (data.success) {
          setReminders(data.reminders);
        }
      } catch (error) {
        console.error('Error fetching reminders:', error);
        toast.error('Failed to load reminders');
      }
    };
    
    fetchReminders();
  }, []);
  
  const handleAddReminder = async (newReminder) => {
    try {
      const res = await fetch('http://localhost:8000/reminders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newReminder),
      });
      
      const data = await res.json();
      if (data.success) {
        setReminders([...reminders, data.reminder]);
        toast.success('Reminder added successfully!');
      } else {
        toast.error(data.message || 'Failed to add reminder');
      }
    } catch (error) {
      console.error('Error adding reminder:', error);
      toast.error('Failed to add reminder');
    }
  };
  
  const handleDeleteReminder = async (id) => {
    try {
      const res = await fetch(`http://localhost:8000/reminders/${id}`, {
        method: 'DELETE',
      });
      
      const data = await res.json();
      if (data.success) {
        setReminders(reminders.filter(reminder => reminder.id !== id));
        toast.success('Reminder deleted successfully!');
      } else {
        toast.error(data.message || 'Failed to delete reminder');
      }
    } catch (error) {
      console.error('Error deleting reminder:', error);
      toast.error('Failed to delete reminder');
    }
  };
  
  return (
    <Layout>
      <Head>
        <title>Reminders | Utility Aggregator</title>
      </Head>
      <h1 className="text-3xl font-bold mb-6">Reminders</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <h2 className="text-xl font-semibold mb-4">Add New Reminder</h2>
          <ReminderForm onAddReminder={handleAddReminder} />
        </div>
        
        <div>
          <h2 className="text-xl font-semibold mb-4">Your Reminders</h2>
          {reminders.length === 0 ? (
            <p className="text-gray-500">You don't have any reminders yet.</p>
          ) : (
            <ul className="space-y-3">
              {reminders.map((reminder) => (
                <li key={reminder.id} className="bg-white p-4 rounded-md shadow-sm border border-gray-200">
                  <div className="flex justify-between">
                    <div>
                      <h3 className="font-medium">{reminder.title}</h3>
                      <p className="text-sm text-gray-600">{new Date(reminder.datetime).toLocaleString()}</p>
                      {reminder.description && <p className="mt-1 text-sm">{reminder.description}</p>}
                    </div>
                    <button 
                      onClick={() => handleDeleteReminder(reminder.id)}
                      className="text-red-500 hover:text-red-700"
                    >
                      Delete
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </Layout>
  );
}
