import { getCourses } from "@/lib/courses";
import CourseCard from "./course-card";

export default async function CourseList() {
  const courses = await getCourses();
  console.log("[server] CourseList renders");
  return (
    <div className="grid">
      {courses.map((c) => (
        <CourseCard key={c.id} course={c} />
      ))}
    </div>
  );
}
