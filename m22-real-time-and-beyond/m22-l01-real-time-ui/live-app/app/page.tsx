"use client";
import { useEffect, useState } from "react";
import { API, type Note } from "@/lib/api";
import { Panel } from "@/components/Panel";

export default function Page() {
  const [items, setItems] = useState<Note[]>([]);
  useEffect(() => {
    fetch(`${API}/notifications`).then((r) => r.json()).then(setItems);
  }, []);
  return <Panel items={items} status="loaded once" />;
}
