// A tiny local server that plays the allcsvideos API. No internet needed.
// Other files: import { startServer, stopServer } from './server.js'
// Or run it alone: node server.js   (then open http://localhost:5125/api/courses)
import http from 'node:http';
import courses from './courses.js';

// Same data, but teacher is an object, and one course is a draft with no teacher and no price.
const catalog = [
  { id: 1, title: 'React for Beginners', teacher: { name: 'Meera' }, price: 499, free: false },
  { id: 2, title: 'Python from Zero', teacher: { name: 'Meera' }, price: 0, free: true },
  { id: 3, title: 'System Design', teacher: { name: 'Rahul' }, price: 999, free: false },
  { id: 4, title: 'DevOps Basics', teacher: { name: 'Asha' }, price: 0, free: true },
  { id: 5, title: 'Git Basics', free: false },
];

const send = (res, status, body) => {
  res.writeHead(status, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify(body));
};

export const startServer = (port = 0) =>
  new Promise((resolve) => {
    const server = http.createServer((req, res) => {
      // Wait a little before answering, so you can see the waiting.
      setTimeout(() => {
        if (req.url === '/api/courses') return send(res, 200, courses);
        if (req.url === '/api/catalog') return send(res, 200, catalog);
        return send(res, 404, { detail: 'Not Found' });
      }, 100);
    });
    server.listen(port, '127.0.0.1', () => {
      resolve({ server, url: `http://127.0.0.1:${server.address().port}` });
    });
  });

export const stopServer = (server) =>
  new Promise((resolve) => {
    server.close(() => resolve());
    server.closeAllConnections();
  });

// Run directly: node server.js
if (import.meta.url === `file://${process.argv[1]}`) {
  const { url } = await startServer(5125);
  console.log(`Server running at ${url}  (Ctrl+C to stop)`);
}
