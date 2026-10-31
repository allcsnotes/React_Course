import { marked } from "marked";
import type { Course } from "@/lib/courses";
import Details from "./details";
import EnrollButton from "./enroll-button";

export default function CourseCard({ course }: { course: Course }) {
  console.log("[server] CourseCard renders:", course.title);
  const html = marked.parse(course.about, { async: false });
  const about = { __html: html };
  return (
    <article>
      <h2>{course.title}</h2>
      <p className="by">by {course.teacher}</p>
      <Details label="about">
        <div className="about" dangerouslySetInnerHTML={about} />
      </Details>
      <EnrollButton title={course.title} />
    </article>
  );
}
