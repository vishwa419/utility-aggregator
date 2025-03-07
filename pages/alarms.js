import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import Head from 'next/head';
import AlarmForm from '../components/AlarmForm';
import Layout from '../components/Layout';

export default function AlarmsPage() {
  const [alarms, setAlarms] = useState([]);
  
  useEffect(() => {
    // Fetch existing alarms
    const fetchAlarms = async () => {
      try {
        const res = await fetch('http://localhost:8000/alarms');
        const data = await res.json();
        if (data.success) {
          setAlarms(data.alarms);
        }
      } catch (error) {
        console.error('Error fetching alarms:', error);
        toast.error('Failed to load alarms');
      }
    };
    
    fetchAlarms();
  }, []);
  
  const handleAddAlarm = async (newAlarm) => {
    try {
      const res = await fetch('http://localhost:8000/alarms', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newAlarm),
      });
      
      const data = await res.json();
      if (data.success) {
        setAlarms([...alarms, data.alarm]);
        toast.success('Alarm added successfully!');
      } else {
        toast.error(data.message || 'Failed to add alarm');
      }
    } catch (error) {
      console.error('Error adding alarm:', error);
      toast.error('Failed to add alarm');
    }
  };
  
  const handleDeleteAlarm = async (id) => {
    try {
      const res = await fetch(`http://localhost:8000/alarms/${id}`, {
        method: 'DELETE',
      });
      
      const data = await res.json();
      if (data.success) {
        setAlarms(alarms.filter(alarm => alarm.id !== id));
        toast.success('Alarm deleted successfully!');
      } else {
        toast.error(data.message || 'Failed to delete alarm');
      }
    } catch (error) {
      console.error('Error deleting alarm:', error);
      toast.error('Failed to delete alarm');
    }
  };
  
  const handleToggleAlarm = async (id, isActive) => {
    try {
      const res = await fetch(`http://localhost:8000/alarms/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ isActive }),
      });
      
      const data = await res.json();
      if (data.success) {
        setAlarms(alarms.map(alarm => 
          alarm.id === id ? { ...alarm, isActive } : alarm
        ));
        toast.success(`Alarm ${isActive ? 'activated' : 'deactivated'} successfully!`);
      } else {
        toast.error(data.message || 'Failed to update alarm');
      }
    } catch (error) {
      console.error('Error updating alarm:', error);
      toast.error('Failed to update alarm');
    }
  };
  
  return (
    <Layout>
      <Head>
        <title>Alarms | Utility Aggregator</title>
      </Head>
      <div className="container mx-auto px-6 py-10">
        <h1 className="text-3xl font-bold text-center mb-12">Alarms</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          {/* Add Alarm Section */}
          <div className="bg-white p-8 rounded-lg shadow-md">
            <h2 className="text-2xl font-semibold mb-6">Add New Alarm</h2>
            <AlarmForm onAddAlarm={handleAddAlarm} />
          </div>
          
          {/* Alarms List Section */}
          <div className="bg-white p-8 rounded-lg shadow-md">
            <h2 className="text-2xl font-semibold mb-6">Your Alarms</h2>
            {alarms.length === 0 ? (
              <p className="text-gray-500">You don't have any alarms yet.</p>
            ) : (
              <ul className="space-y-6">
                {alarms.map((alarm) => (
                  <li key={alarm.id} className="bg-gray-50 p-6 rounded-md shadow-sm border border-gray-200">
                    <div className="flex justify-between items-center">
                      <div>
                        <h3 className="font-medium text-lg">{alarm.label}</h3>
                        <p className="text-sm text-gray-600">{alarm.time}</p>
                      </div>
                      <div className="flex items-center space-x-6">
                        <label className="inline-flex items-center">
                          <input 
                            type="checkbox" 
                            checked={alarm.isActive}
                            onChange={(e) => handleToggleAlarm(alarm.id, e.target.checked)}
                            className="form-checkbox h-5 w-5 text-blue-600"
                          />
                          <span className="ml-2 text-sm">Active</span>
                        </label>
                        <button 
                          onClick={() => handleDeleteAlarm(alarm.id)}
                          className="text-red-500 hover:text-red-700 text-sm"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
}

