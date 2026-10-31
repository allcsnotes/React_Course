import { connection } from 'next/server'

export async function GET() {
  await connection()
  return Response.json({
    environment: process.env.DEPLOY_ENV ?? 'not set',
    brand: process.env.NEXT_PUBLIC_BRAND,
  })
}
