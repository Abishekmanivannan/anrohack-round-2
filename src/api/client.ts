const BASE_URL = import.meta.env.VITE_API_URL || '';

export const isMockMode = () => !BASE_URL || BASE_URL.trim() === '';

// Generic HTTP fetch wrapper for future backend integration
export async function apiFetch<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const token = localStorage.getItem('careflow_auth_token');

  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers,
  };

  const response = await fetch(`${BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || `API Error (${response.status}): ${response.statusText}`);
  }

  return response.json();
}
