// Demo users. The password is FAKE ("fake-demo-pass").
// Only its bcrypt hash is stored.
const HASH =
  '$2b$10$snJ6bzcv9Xk86rVRywwu0.B.ogsJh7Ne2eSX3EQhh29N5n1bNs662'

export const USERS = [
  { id: 'u1', email: 'lukas@example.test', name: 'Lukas', hash: HASH },
  { id: 'u2', email: 'priya@example.test', name: 'Priya', hash: HASH },
]
