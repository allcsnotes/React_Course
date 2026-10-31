import { addReview } from "./reviews-file.ts";

await Promise.all([
  addReview("Lukas", "Clear and calm."),
  addReview("Priya", "Great labs."),
]);
