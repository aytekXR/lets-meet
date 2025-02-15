import React, { useState, useEffect } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import axios from 'axios';

function Confirmation() {
  const { eventCode } = useParams();
  const location = useLocation();
  const [email, setEmail] = useState(location.state?.email || '');
  const [stats, setStats] = useState(null);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [event, setEvent] = useState(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await axios.get(`/api/events/${eventCode}/stats`);
        setStats(response.data);
      } catch (error) {
        setError('Failed to load event statistics');
      }
    };

    fetchStats();
  }, [eventCode]);

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const response = await axios.get(`/api/events/${eventCode}`);
        setEvent(response.data);
      } catch (error) {
        setError('Failed to load event details');
      }
    };

    fetchEvent();
  }, [eventCode]);

  const handleCalendarInvite = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`/api/events/${eventCode}/calendar-invite`, { email });
      setMessage('Calendar invite sent successfully!');
      setEmail('');
    } catch (error) {
      setError('Failed to send calendar invite');
    }
  };

  const handleDownloadCalendar = async () => {
    try {
      const response = await axios.get(`/api/events/${eventCode}/calendar-file`, {
        responseType: 'blob'
      });
      
      // Create a blob from the response data
      const blob = new Blob([response.data], { type: 'text/calendar' });
      const url = window.URL.createObjectURL(blob);
      
      // Create a temporary link and trigger download
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `${event?.name || 'event'}.ics`);
      document.body.appendChild(link);
      link.click();
      
      // Cleanup
      link.parentNode.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      setError('Failed to download calendar file');
    }
  };

  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8 bg-gray-100">
      <div className="max-w-md mx-auto bg-white p-8 rounded-lg shadow">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-green-600">
            Availability Submitted Successfully!
          </h2>
        </div>

        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-medium mb-2">Get Calendar Invite</h3>
            <form onSubmit={handleCalendarInvite} className="space-y-4">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                className="block w-full border border-gray-300 rounded-md shadow-sm p-2"
              />
              <button
                type="submit"
                className="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700"
              >
                Send Calendar Invite
              </button>
            </form>
          </div>

          <div>
            <button
              onClick={handleDownloadCalendar}
              className="w-full py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
            >
              Download Calendar File
            </button>
          </div>

          {stats && (
            <div className="mt-6 p-4 bg-gray-50 rounded">
              <h3 className="text-lg font-medium mb-2">Event Statistics</h3>
              <p>Total Responses: {stats.total_responses}</p>
              <p>Most Popular Time: {new Date(stats.most_popular_time).toLocaleString()}</p>
              <p>Available People: {stats.available_people}</p>
            </div>
          )}

          {message && (
            <div className="p-4 bg-green-100 text-green-700 rounded">
              {message}
            </div>
          )}

          {error && (
            <div className="p-4 bg-red-100 text-red-700 rounded">
              {error}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Confirmation; 