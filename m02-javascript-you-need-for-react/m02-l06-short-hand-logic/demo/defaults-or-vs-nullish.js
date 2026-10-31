const python = { title: 'Python from Zero', price: 0 };
const draft = { title: 'Git for Beginners' };

console.log(python.price || 'Price soon');
console.log(python.price ?? 'Price soon');
console.log(draft.price || 'Price soon');
console.log(draft.price ?? 'Price soon');
