import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

const LandingPage = () => {
  const [eventCode, setEventCode] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleCreateEvent = () => {
    navigate('/create');
  };

  const handleJoinEvent = async (e) => {
    e.preventDefault();
    if (!eventCode.trim()) {
      setError('Please enter an event code');
      return;
    }

    try {
      await api.get(`/api/events/${eventCode}`);
      navigate(`/event/${eventCode}`);
    } catch (error) {
      setError('No event found with this code');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="max-w-md w-full space-y-8 p-8 bg-white rounded-lg shadow">
        <div className="text-center">
          <h2 className="text-3xl font-extrabold text-gray-900">
            Let's Meet
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Schedule group meetings with ease
          </p>
        </div>

        <div className="mt-8 space-y-6">
          <button
            onClick={handleCreateEvent}
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700"
          >
            Create New Event
          </button>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-gray-500">
                Or join an existing event
              </span>
            </div>
          </div>

          <form onSubmit={handleJoinEvent}>
            <input
              type="text"
              value={eventCode}
              onChange={(e) => setEventCode(e.target.value)}
              placeholder="Enter event code"
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
            />
            {error && (
              <p className="mt-2 text-sm text-red-600">
                {error}
              </p>
            )}
            <button
              type="submit"
              className="mt-4 w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700"
            >
              Join Event
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default LandingPage; 