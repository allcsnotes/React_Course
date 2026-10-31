import Image from 'next/image'

export default function After() {
  return (
    <main>
      <h1>React for Beginners</h1>
      <Image
        src="/banner.jpg"
        alt="Course banner"
        width={2400}
        height={1350}
        sizes="480px"
        style={{ width: '100%', maxWidth: 480, height: 'auto' }}
        preload
      />
      <p>Build your first React app, from zero.</p>
    </main>
  )
}
