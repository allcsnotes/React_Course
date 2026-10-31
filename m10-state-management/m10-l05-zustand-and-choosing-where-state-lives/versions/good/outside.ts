import { useCartStore } from './cartStore'

// plain code: no component, no hook
export function addFromShortcut(slug: string) {
  useCartStore.getState().add(slug)
}
