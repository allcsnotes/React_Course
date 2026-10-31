import { marked } from "marked";
import type { Course } from "@/lib/courses";
import EnrollButton from "./enroll-button";

export default function CourseCard({ course }: { course: Course }) {
  const html = marked.parse(course.about, { async: false });
  const about = { __html: html };
  return (
    <article>
      <h2>{course.title}</h2>
      <p className="by">by {course.teacher}</p>
      <div className="about" dangerouslySetInnerHTML={about} />
      <EnrollButton title={course.title} />
    </article>
  );
}
