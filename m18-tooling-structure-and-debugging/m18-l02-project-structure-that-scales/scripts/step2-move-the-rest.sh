mkdir -p src/app src/features/auth src/features/catalog src/features/my-courses src/shared/api src/shared/lib
git mv src/App.tsx src/app/App.tsx
git mv src/components/RootLayout.tsx src/app/RootLayout.tsx
git mv src/index.css src/app/index.css
git mv src/context/AuthContext.tsx src/features/auth/AuthContext.tsx
git mv src/pages/LoginPage.tsx src/features/auth/LoginPage.tsx
git mv src/pages/Login.test.tsx src/features/auth/LoginPage.test.tsx
git mv src/pages/Catalog.tsx src/features/catalog/CatalogPage.tsx
git mv src/pages/Catalog.test.tsx src/features/catalog/CatalogPage.test.tsx
git mv src/components/CourseCard.tsx src/features/catalog/CourseCard.tsx
git mv src/pages/MyCourses.tsx src/features/my-courses/MyCoursesPage.tsx
git mv src/utils/formatPrice.ts src/shared/lib/formatPrice.ts
git mv src/api.ts src/shared/api/client.ts
