"use client";
import { useState } from "react";
import Widget from "./Widget";
import type { Role } from "@/lib/classroom";

export default function Classroom() {
  const [who, setWho] = useState<{ name: string; role: Role; code: string } | null>(null);
  const [role, setRole] = useState<Role>("student");
  if (who) return <Widget name={who.name} role={who.role} code={who.code} />;
  return (
    <form
      className="join"
      action={(data) =>
        setWho({ name: String(data.get("name")), role, code: String(data.get("code") ?? "") })
      }
    >
      <h1>Join the class</h1>
      <input name="name" placeholder="Your name" aria-label="Your name" required />
      <select value={role} onChange={(e) => setRole(e.target.value as Role)} aria-label="Your role">
        <option value="student">Student</option>
        <option value="teacher">Teacher</option>
      </select>
      {role === "teacher" && (
        <input name="code" type="password" placeholder="Teacher code" aria-label="Teacher code" />
      )}
      <button type="submit">Join</button>
    </form>
  );
}
