import "server-only";

export type Course = { id: string; title: string; teacher: string; about: string };

export async function getCourses(): Promise<Course[]> {
  const res = await fetch(`${process.env.API_URL}/api/courses`, {
    headers: { "x-api-key": process.env.API_KEY! },
    cache: "no-store",
  });
  return res.json();
}
