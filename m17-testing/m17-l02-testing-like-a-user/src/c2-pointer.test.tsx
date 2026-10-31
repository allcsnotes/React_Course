import { fireEvent, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { expect, test, vi } from 'vitest'

function Covered({ onClick }: { onClick: () => void }) {
  return (
    <button style={{ pointerEvents: 'none' }} onClick={onClick}>
      Enroll now
    </button>
  )
}

test('fireEvent clicks it anyway', () => {
  const onClick = vi.fn()
  render(<Covered onClick={onClick} />)
  fireEvent.click(screen.getByRole('button', { name: 'Enroll now' }))
  expect(onClick).toHaveBeenCalled()
})

test('userEvent refuses', async () => {
  const onClick = vi.fn()
  render(<Covered onClick={onClick} />)
  await userEvent.click(screen.getByRole('button', { name: 'Enroll now' }))
  expect(onClick).toHaveBeenCalled()
})
