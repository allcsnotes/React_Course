import type { Meta, StoryObj } from '@storybook/react-vite'
import { CourseCard } from './CourseCard.tsx'

const meta = {
  component: CourseCard,
  args: { title: 'React for Beginners', teacher: 'Meera', lessons: 4, price: 499 },
} satisfies Meta<typeof CourseCard>

export default meta
type Story = StoryObj<typeof meta>

export const Paid: Story = {}

export const Free: Story = {
  args: { title: 'Python from Zero', price: 0 },
}

export const LongTitle: Story = {
  args: { title: 'Docker for Developers: Images, Volumes and Compose' },
}
