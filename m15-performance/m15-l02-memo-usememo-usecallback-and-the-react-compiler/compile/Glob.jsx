let renders = 0

export default function Counter() {
  renders = renders + 1
  return <p>rendered {renders} times</p>
}
