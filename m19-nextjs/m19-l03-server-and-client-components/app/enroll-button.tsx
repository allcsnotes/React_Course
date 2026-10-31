"use client";

import { useState } from "react";

export default function EnrollButton({ title }: { title: string }) {
  const [enrolled, setEnrolled] = useState(false);
  console.log("[client] EnrollButton renders:", title);
  return (
    <button
      className={enrolled ? "done" : ""}
      onClick={() => setEnrolled(true)}
    >
      {enrolled ? "Enrolled ✓" : "Enroll"}
    </button>
  );
}
