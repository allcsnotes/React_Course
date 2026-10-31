function Tag({ text }) {
  return (
    <span className="absolute -top-2.5 right-3 rounded-full bg-green-600 px-3 text-lg text-white">
      {text}
    </span>
  )
}

export default Tag
