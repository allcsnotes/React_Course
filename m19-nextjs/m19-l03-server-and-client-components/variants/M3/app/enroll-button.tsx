"use client";

import { useState } from "react";
import { getCourses } from "@/lib/courses";

export default function EnrollButton({ title }: { title: string }) {
  const [enrolled, setEnrolled] = useState(false);
  async function enroll() {
    await getCourses();
    setEnrolled(true);
  }
  return (
    <button className={enrolled ? "done" : ""} onClick={enroll}>
      {enrolled ? "Enrolled ✓" : "Enroll"}
    </button>
  );
}
