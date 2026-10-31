"use client";

import { useState } from "react";

type Props = { label: string; children: React.ReactNode };

export default function Details({ label, children }: Props) {
  const [open, setOpen] = useState(true);
  console.log("[client] Details renders:", label);
  return (
    <div className="details">
      <button className="link" onClick={() => setOpen(!open)}>
        {open ? "Hide" : "Show"} {label}
      </button>
      {open && children}
    </div>
  );
}
