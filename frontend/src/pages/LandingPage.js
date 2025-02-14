import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function LandingPage() {
  const [eventCode, setEventCode] = useState('');
  const [showCodeInput, setShowCodeInput] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleCreateEvent = () => {
    navigate('/create');
  };

  const handleParticipate = () => {
    setShowCodeInput(true);
  };

  const handleSubmitCode = async () => {
    try {
      const response = await axios.get(`/api/events/${eventCode}`);
      if (response.data) {
        navigate(`/event/${eventCode}`, { state: { message: 'Event found!' } });
      }
    } catch (error) {
      setError('No event found with the given code');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="max-w-md w-full space-y-8 p-10 bg-white rounded-xl shadow-lg">
        <div className="text-center">
          <h2 className="mt-6 text-3xl font-bold text-gray-900">
            Welcome to Let's Meet. Let's Meet! 
          </h2>
        </div>
        <div className="mt-8 space-y-6">
          <div className="flex flex-col gap-4">
            <button
              onClick={handleCreateEvent}
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700"
            >
              Generate new event
            </button>
            <button
              onClick={handleParticipate}
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700"
            >
              Participate in an event
            </button>
          </div>
          
          {showCodeInput && (
            <div className="mt-4">
              <input
                type="text"
                value={eventCode}
                onChange={(e) => setEventCode(e.target.value)}
                placeholder="Enter event code"
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              />
              {error && <p className="mt-2 text-red-600 text-sm">{error}</p>}
              <button
                onClick={handleSubmitCode}
                className="mt-4 w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
              >
                Submit
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default LandingPage; 