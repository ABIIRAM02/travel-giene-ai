export async function api<T>(url: string, options?: RequestInit): Promise<T> {

  const response = await fetch(url, {
    ...options,
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      ...options?.headers,
    },
  });

  const data = await response.json();

  if (!response.ok) {
    throw data;
  }

  return data;
  
}
