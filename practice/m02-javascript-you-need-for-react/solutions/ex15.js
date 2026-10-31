// Exercise 15 - JSON, and fetch from a local server
import { startServer, stopServer } from './server.js';

// Part 1: JSON is text. stringify makes text, parse makes objects.
const course = { id: 1, title: 'React for Beginners', price: 499, free: false };
const text = JSON.stringify(course);
console.log(text);
console.log(typeof text);
const back = JSON.parse(text);
console.log(back.title, typeof back);

// Part 2: fetch. Two buzzers: the reply, then the data.
const main = async () => {
  const { server, url } = await startServer();

  const res = await fetch(`${url}/api/courses`);
  console.log(res.status, res.ok);
  const courses = await res.json();
  console.log(`${courses.length} courses:`);
  console.log(courses.map((c) => c.title));

  // Part 3: a typo in the address. fetch still "works", so check res.ok.
  const bad = await fetch(`${url}/api/course`);
  console.log(bad.status, bad.ok);
  console.log(await bad.json());

  // Part 4: forgetting await on res.json()
  const res2 = await fetch(`${url}/api/courses`);
  const oops = res2.json();
  console.log(oops);
  console.log(oops.length);
  await oops;

  await stopServer(server);
};

main();
