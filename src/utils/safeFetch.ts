export async function safeFetch<T>(url: string, options?: RequestInit): Promise<T> {
  try {
    const response = await fetch(url, options);

    // Check if the response status is OK (status code 200-299)
    if (!response.ok) {
      throw Error(`HTTP error: ${url} - ${response.status}, ${response.statusText}`);
    }

    // Parse the response as JSON
    const data: T = await response.json();
    return data;
  } catch (error) {
    // Catch any network errors or exceptions thrown by fetch
    throw Error(`Network error: ${url} - ${error}`);
  }
}
