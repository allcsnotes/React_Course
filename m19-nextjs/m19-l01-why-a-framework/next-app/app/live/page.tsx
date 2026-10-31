import Link from "next/link";
import { getCoursesNow } from "@/lib";

export const instant = false;

export default async function Catalog() {
  const courses = await getCoursesNow();

  return (
    <>
      <h1>Courses</h1>
      <ul className="grid">
        {courses.map((c) => (
          <li key={c.slug} className="card">
            <h2>
              <Link href={`/courses/${c.slug}`}>{c.title}</Link>
            </h2>
            <p>
              {c.teacher} · {c.level}
            </p>
            <p className="price">{c.free ? "Free" : `₹${c.price}`}</p>
          </li>
        ))}
      </ul>
    </>
  );
}
