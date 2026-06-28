async function request(path, options = {}) {
  const response = await fetch(path, {
    headers: { 'Content-Type': 'application/json', ...options.headers },
    ...options,
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(data.error || `Request failed: ${response.status}`);
  }

  return data;
}

export function fetchSubjects() {
  return request('/api/subjects');
}

export function submitChat(body) {
  return request('/api/chat', {
    method: 'POST',
    body: JSON.stringify(body),
  });
}

export function fetchHistory(limit = 5) {
  return request(`/api/history?limit=${limit}`);
}
