export type CourseData = {
  slug: string;
  title: string;
  teacher: string;
  level: string;
  price: number;
  rating: number;
  free: boolean;
};

export async function getCourses(): Promise<CourseData[]> {
  "use cache";
  const res = await fetch("http://localhost:8191/api/courses");
  return res.json();
}

export async function getCoursesNow(): Promise<CourseData[]> {
  const res = await fetch("http://localhost:8191/api/courses");
  return res.json();
}
