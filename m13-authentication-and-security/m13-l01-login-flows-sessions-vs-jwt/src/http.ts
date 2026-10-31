export type Creds = { email: string; password: string }

export const post = (path: string, data: Creds) =>
  fetch(path, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  })
