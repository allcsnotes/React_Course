import { Suspense } from "react";
import CourseList from "./course-list";

export default function Home() {
  return (
    <main>
      <h1>allcsvideos</h1>
      <Suspense fallback={<p>Loading courses…</p>}>
        <CourseList />
      </Suspense>
    </main>
  );
}
