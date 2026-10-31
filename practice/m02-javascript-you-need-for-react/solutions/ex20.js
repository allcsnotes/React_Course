// Exercise 20 - Combine everything: an async loader with three endings
import { startServer, stopServer } from './server.js';

const loadJson = async (url) => {
  try {
    const res = await fetch(url);
    if (!res.ok) {
      throw new Error(`the server said ${res.status}`);
    }
    return await res.json();
  } catch (error) {
    console.log(`Could not load: ${error.message}`);
    return [];
  }
};

const priceText = (price) => (price === 0 ? 'Free' : `Rs ${price}`);

const cardLine = ({ title, teacher, price }) =>
  `${title} | ${teacher?.name ?? 'teacher to be announced'} | ${price === undefined ? 'price soon' : priceText(price)}`;

const main = async () => {
  const { server, url } = await startServer();

  console.log('Loading...');
  const promise = loadJson(`${url}/api/catalog`);
  console.log('(the page is not frozen)');
  const catalog = await promise;

  // 1) one line per course
  for (const c of catalog) {
    console.log(' ', cardLine(c));
  }

  // 2) numbers
  const paid = catalog.filter((c) => (c.price ?? 0) > 0);
  const bill = paid.reduce((sum, c) => sum + c.price, 0);
  console.log(`${catalog.length} courses, ${paid.length} paid, bill Rs ${bill}`);

  // 3) the cheapest paid course, without changing the catalog
  const cheapest = paid.toSorted((a, b) => a.price - b.price)[0];
  console.log('Cheapest paid:', cheapest?.title);
  console.log('First in catalog still:', catalog[0].title);

  // 4) the three endings
  const typo = await loadJson(`${url}/api/catalogue`);
  console.log('After the typo, the list has', typo.length, 'items');

  await stopServer(server);
  const down = await loadJson(`${url}/api/catalog`);
  console.log('After the server stopped, the list has', down.length, 'items');
};

main();
