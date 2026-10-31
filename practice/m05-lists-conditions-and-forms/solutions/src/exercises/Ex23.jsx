import { useState } from 'react'
import { courses } from '../courses'

export default function Ex23() {
  const [cart, setCart] = useState([])

  function add(course) {
    const found = cart.find((line) => line.id === course.id)
    if (found) {
      setCart(cart.map((line) => (line.id === course.id ? { ...line, qty: line.qty + 1 } : line)))
    } else {
      setCart([...cart, { id: course.id, title: course.title, price: course.price, qty: 1 }])
    }
  }

  function change(id, diff) {
    setCart(
      cart
        .map((line) => (line.id === id ? { ...line, qty: line.qty + diff } : line))
        .filter((line) => line.qty > 0),
    )
  }

  function remove(id) {
    setCart(cart.filter((line) => line.id !== id))
  }

  const seats = cart.reduce((sum, line) => sum + line.qty, 0)
  const total = cart.reduce((sum, line) => sum + line.price * line.qty, 0)

  return (
    <div>
      <h2>
        Shop {seats > 0 && <span className="badge">{seats}</span>}
      </h2>
      {courses.map((c) => (
        <div key={c.id} className="card row">
          <span>
            {c.title} · {c.price === 0 ? 'Free' : 'Rs ' + c.price}
          </span>
          <button onClick={() => add(c)}>Add to cart</button>
        </div>
      ))}
      <div className="card">
        <h3>Cart</h3>
        {cart.length === 0 ? (
          <p>Your cart is empty</p>
        ) : (
          <>
            {cart.map((line) => (
              <div key={line.id} className="row">
                <span>
                  {line.title} x {line.qty} = Rs {line.price * line.qty}
                </span>
                <button onClick={() => change(line.id, 1)}>+</button>
                <button onClick={() => change(line.id, -1)}>-</button>
                <button onClick={() => remove(line.id)}>Remove</button>
              </div>
            ))}
            <p>Total: Rs {total}</p>
            <button onClick={() => setCart([])}>Clear cart</button>
          </>
        )}
      </div>
    </div>
  )
}
