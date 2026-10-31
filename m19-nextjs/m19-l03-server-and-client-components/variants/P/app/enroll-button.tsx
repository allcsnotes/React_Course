"use client";

import { useState } from "react";

type Props = {
  title: string;
  price: number;
  free: boolean;
  tags: string[];
  meta: { level: string };
  since: Date;
};

export default function EnrollButton(p: Props) {
  const [enrolled, setEnrolled] = useState(false);
  console.log("[client] EnrollButton renders:", p.title, p.price, p.free, p.tags.length, p.meta.level, p.since.getFullYear());
  return (
    <button
      className={enrolled ? "done" : ""}
      onClick={() => setEnrolled(true)}
    >
      {enrolled ? "Enrolled ✓" : "Enroll"}
    </button>
  );
}
