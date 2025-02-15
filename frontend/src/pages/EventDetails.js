import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';

const EventDetails = () => {
  const { eventCode } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [event, setEvent] = useState(null);
  const [availability, setAvailability] = useState({
    participant_name: '',
    participant_email: '',
    available_times: [],
    custom_availability: ''
  });
  const [error, setError] = useState('');
  const [message] = useState('');
  const [showAdminInfo, setShowAdminInfo] = useState(true);
  const [copySuccess, setCopySuccess] = useState('');

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const response = await axios.get(`/api/events/${eventCode}`);
        // Convert date strings to Date objects
        const eventData = {
          ...response.data,
          potential_dates: response.data.potential_dates.map(date => 
            typeof date === 'string' ? new Date(date) : date
          )
        };
        setEvent(eventData);
      } catch (error) {
        setError('Failed to load event details');
      }
    };

    fetchEvent();
  }, [eventCode]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setAvailability(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const toggleTimeSlot = (dateTime) => {
    setAvailability(prev => {
      const dateStr = dateTime.toISOString();
      const exists = prev.available_times.some(t => 
        new Date(t).toISOString() === dateStr
      );
      
      return {
        ...prev,
        available_times: exists
          ? prev.available_times.filter(t => 
              new Date(t).toISOString() !== dateStr
            )
          : [...prev.available_times, dateStr]
      };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`/api/events/${eventCode}/availability`, availability);
      navigate(`/confirmation/${eventCode}`, {
        state: { email: availability.participant_email }
      });
    } catch (error) {
      setError('Failed to submit availability');
    }
  };

  const handleCopyLink = async () => {
    const eventLink = `${window.location.origin}/event/${eventCode}`;
    try {
      await navigator.clipboard.writeText(eventLink);
      setCopySuccess('Link copied!');
      setTimeout(() => setCopySuccess(''), 2000);
    } catch (err) {
      setCopySuccess('Failed to copy');
    }
  };

  if (!event) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8 bg-gray-100">
      <div className="max-w-lg mx-auto bg-white p-8 rounded-lg shadow">
        <div className="mb-6">
          <button
            onClick={() => setShowAdminInfo(!showAdminInfo)}
            className="text-sm text-gray-500 hover:text-gray-700"
          >
            {showAdminInfo ? 'Hide Admin Info' : 'Show Admin Info'}
          </button>
          
          {showAdminInfo && (
            <div className="mt-2 p-4 bg-gray-50 rounded-lg">
              <div className="mb-2">
                <span className="font-semibold">Event ID:</span> {event.id}
              </div>
              <div className="mb-2">
                <span className="font-semibold">Event Code:</span> {eventCode}
              </div>
              <div className="relative">
                <span className="font-semibold">Invitation Link:</span>
                <div className="flex items-center mt-1 space-x-2">
                  <input
                    type="text"
                    readOnly
                    value={`${window.location.origin}/event/${eventCode}`}
                    className="block w-full p-2 text-sm border border-gray-300 rounded-md bg-gray-50"
                  />
                  <button
                    onClick={handleCopyLink}
                    className="px-3 py-2 text-sm bg-blue-600 text-white rounded hover:bg-blue-700"
                  >
                    Copy
                  </button>
                </div>
                {copySuccess && (
                  <span className="absolute right-0 -bottom-6 text-sm text-green-600">
                    {copySuccess}
                  </span>
                )}
              </div>
            </div>
          )}
        </div>

        {message && (
          <div className="mb-4 p-4 bg-green-100 text-green-700 rounded">
            {message}
          </div>
        )}
        
        <h2 className="text-2xl font-bold mb-6">{event.name}</h2>
        {event.description && (
          <p className="mb-6 text-gray-600">{event.description}</p>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Your Name
            </label>
            <input
              type="text"
              name="participant_name"
              required
              value={availability.participant_name}
              onChange={handleInputChange}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Your Email (Optional)
            </label>
            <input
              type="email"
              name="participant_email"
              value={availability.participant_email}
              onChange={handleInputChange}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Select Available Times
            </label>
            <div className="space-y-2">
              {event.potential_dates.map((dateTime, index) => {
                const dateStr = new Date(dateTime).toISOString();
                const isSelected = availability.available_times.some(t => 
                  new Date(t).toISOString() === dateStr
                );
                
                return (
                  <button
                    key={index}
                    type="button"
                    onClick={() => toggleTimeSlot(new Date(dateTime))}
                    className={`w-full p-2 rounded ${
                      isSelected
                        ? 'bg-green-600 text-white'
                        : 'bg-gray-200 text-gray-700'
                    }`}
                  >
                    {new Date(dateTime).toLocaleString()}
                  </button>
                );
              })}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Custom Availability (Optional)
            </label>
            <textarea
              name="custom_availability"
              value={availability.custom_availability}
              onChange={handleInputChange}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
              rows="3"
              placeholder="Enter any additional availability information..."
            />
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
            Submit Availability
          </button>
        </form>
      </div>
    </div>
  );
};

export default EventDetails; 