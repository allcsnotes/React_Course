function debounce(fn, ms) {
  let timer;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), ms);
  };
}

const search = debounce(q => {
  console.log('search called with:', q);
}, 250);

let typed = '';
for (const key of 'react') {
  typed += key;
  console.log('typed:', typed);
  search(typed);
  await new Promise(r => setTimeout(r, 80));
}
