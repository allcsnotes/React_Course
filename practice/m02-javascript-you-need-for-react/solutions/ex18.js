// Exercise 18 - Ternary, ?? and ?.
const free = { id: 2, title: 'Python from Zero', teacher: { name: 'Meera' }, price: 0 };
const draft = { id: 5, title: 'Git Basics' };

// 1) ternary
const label = (c) => (c.price === 0 ? 'Free' : `Rs ${c.price}`);
console.log(label(free));
console.log(label({ price: 499 }));

// 2) || against ??
console.log(free.price || 'price soon');
console.log(free.price ?? 'price soon');
console.log(draft.price || 'price soon');
console.log(draft.price ?? 'price soon');

// 3) ?. looks inside safely
console.log(free.teacher.name);
console.log(draft.teacher?.name);
console.log(draft.teacher?.name ?? 'to be announced');

// 4) a whole card line
const cardLine = (c) =>
  `${c.title} - ${c.teacher?.name ?? 'to be announced'} - ${c.price === undefined ? 'price soon' : label(c)}`;
console.log(cardLine(free));
console.log(cardLine(draft));

// 5) brackets when you mix ?? and ||
console.log((draft.price ?? 0) || 'price soon');
