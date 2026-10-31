"use client";

import { useState } from "react";

type Props = { title: string; onEnroll: () => void };

export default function EnrollButton({ title, onEnroll }: Props) {
  const [enrolled, setEnrolled] = useState(false);
  return (
    <button
      className={enrolled ? "done" : ""}
      onClick={() => {
        setEnrolled(true);
        onEnroll();
      }}
    >
      {enrolled ? "Enrolled ✓" : "Enroll"}
    </button>
  );
}
