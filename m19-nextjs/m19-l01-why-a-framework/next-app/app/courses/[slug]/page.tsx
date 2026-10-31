import Link from "next/link";
import { notFound } from "next/navigation";
import { getCourses } from "@/lib";

export async function generateStaticParams() {
  const courses = await getCourses();
  return courses.map((c) => ({ slug: c.slug }));
}

export default async function Course({ params }: PageProps<"/courses/[slug]">) {
  const { slug } = await params;
  const course = (await getCourses()).find((c) => c.slug === slug);
  if (!course) notFound();

  return (
    <>
      <h1>{course.title}</h1>
      <p>
        {course.teacher} · {course.level} · {course.rating} stars
      </p>
      <Link className="back" href="/">
        Back to courses
      </Link>
    </>
  );
}
