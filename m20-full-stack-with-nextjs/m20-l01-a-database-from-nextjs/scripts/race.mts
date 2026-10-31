import { db } from "../db";
import { reviews } from "../db/schema";

await Promise.all([
  db.insert(reviews).values({ courseId: 2, name: "Lukas", body: "Clear and calm." }),
  db.insert(reviews).values({ courseId: 2, name: "Priya", body: "Great labs." }),
]);

await db.$client.end();
