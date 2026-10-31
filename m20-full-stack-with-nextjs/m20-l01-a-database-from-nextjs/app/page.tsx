import { Suspense } from "react";
import CoursePage from "./course-page";

export default function Home() {
  return (
    <main>
      <Suspense fallback={<p>Loading…</p>}>
        <CoursePage />
      </Suspense>
    </main>
  );
}
