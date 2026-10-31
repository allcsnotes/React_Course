const API = 'http://localhost:8131'

export const without = () =>
  fetch(`${API}/api/session/me`)

export const withCookie = () =>
  fetch(`${API}/api/session/me`, {
    credentials: 'include',
  })
