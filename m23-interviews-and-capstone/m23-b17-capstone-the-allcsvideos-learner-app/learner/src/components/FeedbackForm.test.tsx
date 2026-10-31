import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import FeedbackForm from './FeedbackForm'

vi.mock('@/app/actions', () => ({ sendFeedback: vi.fn() }))

describe('FeedbackForm', () => {
  it('shows our message for a short text and does not send', async () => {
    const user = userEvent.setup()
    const onSend = vi.fn()
    render(<FeedbackForm onSend={onSend} />)
    await user.type(screen.getByLabelText('Email'), 'lukas@example.test')
    await user.type(screen.getByLabelText('Message'), 'Nice')
    await user.click(screen.getByRole('button', { name: 'Send feedback' }))
    const msg = await screen.findByText('Write at least 10 characters')
    expect(msg).toBeInTheDocument()
    expect(onSend).not.toHaveBeenCalled()
  })
  it('sends a good message', async () => {
    const user = userEvent.setup()
    const onSend = vi.fn().mockResolvedValue({ ok: true })
    render(<FeedbackForm onSend={onSend} />)
    await user.type(screen.getByLabelText('Email'), 'lukas@example.test')
    await user.type(screen.getByLabelText('Message'), 'Very clear lessons.')
    await user.click(screen.getByRole('button', { name: 'Send feedback' }))
    const thanks = await screen.findByText('Thank you! Your feedback was sent.')
    expect(thanks).toBeInTheDocument()
    expect(onSend).toHaveBeenCalledOnce()
  })
})
