import { eq, sql } from "drizzle-orm";
import { db } from "../db";
import { courses, enrollments } from "../db/schema";

const courseId = 4; // Git Live Cohort: 0 seats left

async function enrollLoose(student: string) {
  await db.insert(enrollments).values({ courseId, student });
  await db
    .update(courses)
    .set({ seatsLeft: sql`${courses.seatsLeft} - 1` })
    .where(eq(courses.id, courseId));
}

async function enrollSafe(student: string) {
  await db.transaction(async (tx) => {
    await tx.insert(enrollments).values({ courseId, student });
    await tx
      .update(courses)
      .set({ seatsLeft: sql`${courses.seatsLeft} - 1` })
      .where(eq(courses.id, courseId));
  });
}

for (const [label, run, student] of [
  ["no transaction:", enrollLoose, "Lukas"],
  ["transaction:", enrollSafe, "Priya"],
] as const) {
  try {
    await run(student);
  } catch (e: any) {
    console.log(label, e.cause.message);
  }
}

await db.$client.end();
