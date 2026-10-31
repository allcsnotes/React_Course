import { sql } from "drizzle-orm";
import {
  check,
  integer,
  pgTable,
  serial,
  text,
  timestamp,
  unique,
} from "drizzle-orm/pg-core";

export const courses = pgTable(
  "courses",
  {
    id: serial("id").primaryKey(),
    slug: text("slug").notNull().unique(),
    title: text("title").notNull(),
    teacher: text("teacher").notNull(),
    price: integer("price").notNull(),
    seatsLeft: integer("seats_left").notNull(),
  },
  (t) => [
    check(
      "seats_not_negative",
      sql`${t.seatsLeft} >= 0`,
    ),
  ],
);

export const reviews = pgTable("reviews", {
  id: serial("id").primaryKey(),
  courseId: integer("course_id")
    .notNull()
    .references(() => courses.id),
  name: text("name").notNull(),
  body: text("body").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const enrollments = pgTable(
  "enrollments",
  {
    id: serial("id").primaryKey(),
    courseId: integer("course_id")
      .notNull()
      .references(() => courses.id),
    student: text("student").notNull(),
  },
  (t) => [unique("student_course").on(t.student, t.courseId)],
);
