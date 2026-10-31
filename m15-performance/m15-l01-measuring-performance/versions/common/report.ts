export function report(
  id: string,
  phase: string,
  ms: number,
  base: number,
) {
  console.log(`${id} ${phase}: ${ms.toFixed(1)} ms (base ${base.toFixed(1)})`)
}
