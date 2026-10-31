"use server";

import { eq, sql } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { db } from "@/db";
import { courses, enrollments, reviews } from "@/db/schema";

export async function postReview(formData: FormData) {
  await db.insert(reviews).values({
    courseId: Number(formData.get("courseId")),
    name: String(formData.get("name")),
    body: String(formData.get("body")),
  });
  revalidatePath("/");
}

export async function enroll(formData: FormData) {
  const courseId = Number(formData.get("courseId"));
  const student = String(formData.get("student"));

  await db.transaction(async (tx) => {
    await tx.insert(enrollments).values({ courseId, student });
    await tx
      .update(courses)
      .set({ seatsLeft: sql`${courses.seatsLeft} - 1` })
      .where(eq(courses.id, courseId));
  });
  revalidatePath("/");
}
