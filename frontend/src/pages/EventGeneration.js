import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";

function EventGeneration() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    creator_name: '',
    creator_email: '',
    potential_dates: []
  });
  const [selectedDate, setSelectedDate] = useState(null);
  const [error, setError] = useState('');

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleAddDate = () => {
    if (selectedDate) {
      if (selectedDate < new Date()) {
        setError('Cannot add dates in the past');
        setTimeout(() => setError(''), 3000);
        return;
      }

      setFormData(prev => ({
        ...prev,
        potential_dates: [...prev.potential_dates, selectedDate.toISOString()]
      }));
      setSelectedDate(null);
      setError('');
    }
  };

  const handleRemoveDate = (index) => {
    setFormData(prev => ({
      ...prev,
      potential_dates: prev.potential_dates.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('/api/events', {
        ...formData,
        potential_dates: formData.potential_dates.map(date => 
          typeof date === 'string' ? date : date.toISOString()
        )
      });
      
      const eventCode = response.data.code;
      const eventLink = `${window.location.origin}/event/${eventCode}`;
      await navigator.clipboard.writeText(eventLink);
      
      navigate(`/event/${eventCode}`, { 
        state: { message: 'Event created! Link copied to clipboard.' } 
      });
    } catch (error) {
      console.error('Error creating event:', error);
      setError('Failed to create event. Please try again.');
    }
  };

  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8 bg-gray-100">
      <div className="max-w-md mx-auto bg-white p-8 rounded-lg shadow">
        <h2 className="text-2xl font-bold mb-6 text-center">Create New Event</h2>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Event Name
            </label>
            <input
              type="text"
              name="name"
              required
              value={formData.name}
              onChange={handleInputChange}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Description (Optional)
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
              rows="3"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Your Name
            </label>
            <input
              type="text"
              name="creator_name"
              required
              value={formData.creator_name}
              onChange={handleInputChange}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Your Email
            </label>
            <input
              type="email"
              name="creator_email"
              required
              value={formData.creator_email}
              onChange={handleInputChange}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Add Potential Dates
            </label>
            <div className="flex gap-2 mt-1">
              <DatePicker
                selected={selectedDate}
                onChange={date => setSelectedDate(date)}
                showTimeSelect
                dateFormat="MMMM d, yyyy h:mm aa"
                className="block w-full border border-gray-300 rounded-md shadow-sm p-2"
                placeholderText="Select date and time"
              />
              <button
                type="button"
                onClick={handleAddDate}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                Add
              </button>
            </div>
            
            <div className="mt-2 space-y-2">
              {formData.potential_dates.map((date, index) => (
                <div key={index} className="flex justify-between items-center bg-gray-50 p-2 rounded">
                  <span>{new Date(date).toLocaleString()}</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveDate(index)}
                    className="text-red-600 hover:text-red-800"
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>
          </div>

          {error && (
            <div className="text-red-600 text-sm">
              {error}
            </div>
          )}

          <button
            type="submit"
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700"
          >
            Generate & Copy Event Link
          </button>
        </form>
      </div>
    </div>
  );
}

export default EventGeneration; 