export function formatPrice(cents:number){
const dollars=cents/100
    const label = "USD"
  return "$"+dollars.toFixed(2)+" "+ label
}
