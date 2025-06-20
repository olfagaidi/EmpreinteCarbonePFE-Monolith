

/**
 * Helper function to safely handle response data with proper error handling
 * @param errorData The error object from a caught exception
 * @param fallback A fallback object to use if the error can't be processed properly
 * @returns A properly formatted error object with a message
 */
export const typeSafeResponseData = (
    errorData: unknown, 
    fallback: { message: string }
  ): { message: string } => {
    if (errorData && typeof errorData === 'object') {
      // Check if the error is an axios error response with data
      if ('response' in errorData && 
          errorData.response && 
          typeof errorData.response === 'object' && 
          'data' in errorData.response) {
        const responseData = errorData.response.data;
        
        // Check if response data has a message property
        if (responseData && typeof responseData === 'object' && 'message' in responseData && typeof responseData.message === 'string') {
          return { message: responseData.message };
        }
      }
      
      // Check if the error object itself has a message
      if ('message' in errorData && typeof errorData.message === 'string') {
        return { message: errorData.message };
      }
    }
    
    // Return the fallback if we couldn't extract a proper message
    return fallback;
  };
  