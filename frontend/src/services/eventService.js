import api from './api';

export const createEvent = async (eventData) => {
  try {
    const response = await api.post('/api/events', eventData);
    return response.data;
  } catch (error) {
    console.error('Error creating event:', error.response?.data || error.message);
    throw error;
  }
};

export const getEvent = async (eventCode) => {
  try {
    const response = await api.get(`/api/events/${eventCode}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching event:', error.response?.data || error.message);
    throw error;
  }
}; 