"use client";
import { useState } from "react";
import Widget from "./Widget";
import type { Role } from "@/lib/classroom";

export default function Classroom() {
  const [who, setWho] = useState<{ name: string; role: Role } | null>(null);
  if (who) return <Widget name={who.name} role={who.role} />;
  return (
    <form
      className="join"
      action={(data) =>
        setWho({ name: String(data.get("name")), role: data.get("role") as Role })
      }
    >
      <h1>Join the class</h1>
      <input name="name" placeholder="Your name" aria-label="Your name" required />
      <select name="role" aria-label="Your role">
        <option value="student">Student</option>
        <option value="teacher">Teacher</option>
      </select>
      <button type="submit">Join</button>
    </form>
  );
}
