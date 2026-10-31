const app = document.getElementById('app')
const courses = ['React for Beginners', 'Python from Zero', 'DevOps Basics']
const li = c => '<li>' + c + '</li>'

function draw() {
  let html = '<h1>Course shelf</h1>'
  html += '<input placeholder="note">'
  html += '<button onclick="add()">Add course</button>'
  html += '<ul>' + courses.map(li).join('') + '</ul>'
  app.innerHTML = html
}
function add() {
  courses.push('Git Basics')
  draw()
}
draw()
