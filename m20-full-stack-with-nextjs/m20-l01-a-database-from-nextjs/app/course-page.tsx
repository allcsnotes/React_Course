import { desc, eq } from "drizzle-orm";
import { db } from "@/db";
import { courses, reviews } from "@/db/schema";
import { enroll, postReview } from "./actions";

export default async function CoursePage() {
  const [course] = await db
    .select()
    .from(courses)
    .where(eq(courses.slug, "sql-in-two-weeks"));

  const list = await db
    .select()
    .from(reviews)
    .where(eq(reviews.courseId, course.id))
    .orderBy(desc(reviews.createdAt));

  return (
    <>
      <div className="head">
        <div>
          <h1>{course.title}</h1>
          <p className="by">
            by {course.teacher} · ₹{course.price} ·{" "}
            <span className="seats">{course.seatsLeft} seats left</span>
          </p>
        </div>
        <form action={enroll}>
          <input type="hidden" name="courseId" value={course.id} />
          <input type="hidden" name="student" value="Lukas" />
          <button>Enroll as Lukas</button>
        </form>
      </div>
      <h2>Reviews ({list.length})</h2>
      {list.map((r) => (
        <div className="rev" key={r.id}>
          <b>{r.name}</b>
          {r.body}
        </div>
      ))}
      <form action={postReview} className="post">
        <input type="hidden" name="courseId" value={course.id} />
        <input className="n" name="name" placeholder="Name" />
        <input className="t" name="body" placeholder="Your review" />
        <button>Post review</button>
      </form>
    </>
  );
}
