export const handleApiRequest = async (apiCall, functionName = 'API Call') => {
  try {
    const response = await apiCall();
    return response.data;
  } catch (error) {
    console.error(`Database Service :: ${functionName} :: error`, error);
    console.error("Error message:", error.message);

    // API Response Error
    if (error.response) {
      const { status, data } = error.response;
      throw new Error(`Error ${status}: ${data.message || 'Something went wrong'}`);
    }

    // Network Error
    if (error.request) {
      throw new Error('Network error: No response received from the server');
    }

    // Unexpected Error
    throw new Error('Unexpected error: ' + error.message);
  }
};