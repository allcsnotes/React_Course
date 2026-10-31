import { useState } from 'react'
import { courses } from '../courses'

export default function Ex13() {
  const [wishlist, setWishlist] = useState([])

  function add(course) {
    if (wishlist.some((w) => w.id === course.id)) return
    setWishlist([...wishlist, course])
  }

  function remove(id) {
    setWishlist(wishlist.filter((w) => w.id !== id))
  }

  return (
    <div>
      <div className="card">
        <h3>Courses</h3>
        {courses.map((c) => (
          <button key={c.id} onClick={() => add(c)}>
            Add {c.title}
          </button>
        ))}
      </div>
      <div className="card">
        <h3>Priya's wishlist ({wishlist.length})</h3>
        {wishlist.length === 0 && <p>Nothing saved yet</p>}
        <ul>
          {wishlist.map((w) => (
            <li key={w.id}>
              {w.title} <button onClick={() => remove(w.id)}>Remove</button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}
