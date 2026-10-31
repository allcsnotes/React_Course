// Exercise 17 - Truthy, falsy, && || !, and the lonely zero
// Part 1: what counts as yes?
console.log(Boolean(0), Boolean(''), Boolean(null), Boolean(undefined), Boolean(NaN), Boolean(false));
console.log(Boolean('0'), Boolean('false'), Boolean([]), Boolean({}), Boolean(12));

// Part 2: and, or, not
const isFree = true;
const lessons = 20;
console.log(isFree && lessons > 10);
console.log(isFree && lessons > 30);
console.log(isFree || lessons > 30);
console.log(!isFree);

// Part 3: && gives back a value, not always true or false
const count = 0;
console.log(isFree && 'FREE');
console.log(!isFree && 'FREE');
console.log(count && 'badge');
console.log(count > 0 && 'badge');

// Part 4: the same with two joined courses
const joined = 2;
console.log(joined && 'badge');
console.log(joined > 0 && 'badge');

// Part 5: asking about a list
const list = [];
if (list) {
  console.log('Bug: the empty list counted as yes');
}
if (list.length > 0) {
  console.log('This never prints');
}
console.log('Length of an empty list:', list.length, Boolean(list.length));

// Part 6: one equals sign stores, three compare
let cost = 499;
if ((cost = 0)) {
  console.log('Paid');
} else {
  console.log('Free, because cost is now', cost);
}
