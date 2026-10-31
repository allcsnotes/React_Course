mkdir -p src/features/cart
git mv src/store/cartStore.ts src/features/cart/cartStore.ts
git mv src/store/cartStore.test.ts src/features/cart/cartStore.test.ts
git mv src/store/totals.ts src/features/cart/totals.ts
git mv src/store/totals.test.ts src/features/cart/totals.test.ts
git mv src/components/AddToCartButton.tsx src/features/cart/AddToCartButton.tsx
git mv src/pages/Cart.tsx src/features/cart/CartPage.tsx
git mv src/pages/Cart.test.tsx src/features/cart/CartPage.test.tsx
