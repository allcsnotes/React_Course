import { eq } from "drizzle-orm";
import { db } from "../db";
import { courses, enrollments } from "../db/schema";

async function tryIt(label: string, save: () => Promise<unknown>) {
  try {
    await save();
    console.log(label, "saved");
  } catch (e: any) {
    console.log(label, e.cause.code, e.cause.message);
  }
}

const row = { courseId: 1, student: "Priya" };
await tryIt("first time:", () => db.insert(enrollments).values(row));
await tryIt("second time:", () => db.insert(enrollments).values(row));

await tryIt("seats -1:", () =>
  db.update(courses).set({ seatsLeft: -1 }).where(eq(courses.id, 1)),
);

await db.$client.end();
