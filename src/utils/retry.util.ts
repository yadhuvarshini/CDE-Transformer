export async function retryWithBackoff<T>(
  operation: () => Promise<T>,
  maxRetries = 3,
  baseDelay = 1000
): Promise<T> {
  let lastError: Error;
  
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      return await operation();
    } catch (error: any) {
      lastError = error;
      
      if (error.status === 429) {
        const delay = baseDelay * Math.pow(2, attempt - 1); 
        console.warn(`Rate limited. Retrying in ${delay}ms... (Attempt ${attempt}/${maxRetries})`);
        await new Promise(resolve => setTimeout(resolve, delay));
      } 
      else if (error.status === 401) { 
        console.error('Authentication failed. Token may have expired.');
        throw new Error('Authentication failed: ' + error.message);
      }
      else {
        throw error; 
      }
    }
  }
  
  throw lastError!;
}