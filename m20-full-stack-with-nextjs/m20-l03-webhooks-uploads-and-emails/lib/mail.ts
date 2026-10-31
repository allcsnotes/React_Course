import nodemailer from 'nodemailer'
import type { orders } from './schema'

type Order = typeof orders.$inferSelect

// Mailpit takes letters on port 1203
const transport = nodemailer.createTransport({
  host: 'localhost',
  port: 1203,
})

export async function sendReceipt(to: string, order: Order) {
  await transport.sendMail({
    from: 'allcsvideos <hello@allcsvideos.test>',
    to,
    subject: `Your receipt: ${order.course}`,
    text: `Thank you! You now own "${order.course}".\n` +
      `Order ${order.id}, paid Rs ${order.amount} (test mode).`,
  })
}
