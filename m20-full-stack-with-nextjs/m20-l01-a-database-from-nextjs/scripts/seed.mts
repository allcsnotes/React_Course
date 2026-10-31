import { db } from "../db";
import { courses, reviews } from "../db/schema";

await db.insert(courses).values([
  { slug: "react-for-beginners", title: "React for Beginners", teacher: "Meera", price: 499, seatsLeft: 25 },
  { slug: "sql-in-two-weeks", title: "SQL in Two Weeks", teacher: "Meera", price: 399, seatsLeft: 30 },
  { slug: "docker-for-developers", title: "Docker for Developers", teacher: "Meera", price: 599, seatsLeft: 20 },
  { slug: "git-live-cohort", title: "Git Live Cohort", teacher: "Meera", price: 299, seatsLeft: 0 },
]);

await db.insert(reviews).values([
  { courseId: 2, name: "Priya", body: "Joins finally make sense." },
  { courseId: 2, name: "Lukas", body: "Clear and calm. I could follow every step." },
]);

console.log("seeded: 4 courses, 2 reviews");
await db.$client.end();
