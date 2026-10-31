import Image from 'next/image'

export default function Page() {
  return (
    <Image
      src="https://images.example.com/banner.jpg"
      alt="Course banner"
      width={1200}
      height={675}
    />
  )
}
