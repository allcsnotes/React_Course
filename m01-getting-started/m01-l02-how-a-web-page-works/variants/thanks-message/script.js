const button = document.querySelector('#enroll');
const count = document.querySelector('#students');
const badge = document.querySelector('#badge');

let students = 1204;
let myCourses = 3;

button.addEventListener('click', () => {
  students = students + 1;
  myCourses = myCourses + 1;
  button.textContent = 'Enrolled';
  count.textContent = students + ' students';
  badge.textContent = myCourses;

  const thanks = document.createElement('p');
  thanks.textContent = 'Welcome aboard, Lukas!';
  document.querySelector('.course').append(thanks);
});
