/**
 * Utility function for making authenticated API calls with automatic token refresh
 * This handles 401 errors by attempting to refresh the access token
 */

interface AuthFetchOptions extends RequestInit {
  skipAuthCheck?: boolean;
}

export async function authFetch(url: string, options: AuthFetchOptions = {}): Promise<Response> {
  const { skipAuthCheck = false, ...fetchOptions } = options;

  try {
    // First attempt with current token
    const response = await fetch(url, fetchOptions);

    // If successful or we're skipping auth checks, return the response
    if (response.ok || skipAuthCheck) {
      return response;
    }

    // If 401 Unauthorized, try to refresh token
    if (response.status === 401) {
      console.log('Request failed with 401, attempting token refresh...');

      const refreshResponse = await fetch('/api/auth/refresh', {
        method: 'POST',
      });

      if (refreshResponse.ok) {
        console.log('Token refreshed successfully, retrying original request');
        // Retry the original request with new token
        return await fetch(url, fetchOptions);
      } else {
        console.error('Token refresh failed');
        // Return the original error response
        return response;
      }
    }

    return response;
  } catch (error) {
    console.error('Auth fetch error:', error);
    throw error;
  }
}

/**
 * Helper function for POST requests
 */
export async function authPost(url: string, data: any): Promise<Response> {
  return authFetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });
}

/**
 * Helper function for PUT requests
 */
export async function authPut(url: string, data: any): Promise<Response> {
  return authFetch(url, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });
}

/**
 * Helper function for DELETE requests
 */
export async function authDelete(url: string): Promise<Response> {
  return authFetch(url, {
    method: 'DELETE',
  });
}

/**
 * Helper function for GET requests
 */
export async function authGet(url: string): Promise<Response> {
  return authFetch(url, {
    method: 'GET',
  });
}