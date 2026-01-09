// Error handler utility
export const handleAPIError = (error, setError) => {
  console.error('API Error:', error);
  
  if (error.message.includes('Network error') || error.message.includes('Failed to fetch')) {
    setError('Cannot connect to server. Please make sure the backend is running on port 5000.');
  } else if (error.message.includes('401') || error.message.includes('403')) {
    setError('Session expired. Please login again.');
    // Redirect to login after a delay
    setTimeout(() => {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/#/login';
    }, 2000);
  } else {
    setError(error.message || 'An error occurred. Please try again.');
  }
};
