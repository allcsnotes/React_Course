"use client";
import { useEffect, useRef, useState } from "react";
import { API, type Note } from "@/lib/api";
import { Panel } from "@/components/Panel";

export default function Page() {
  const [items, setItems] = useState<Note[]>([]);
  const last = useRef(0);
  useEffect(() => {
    const timer = setInterval(async () => {
      const res = await fetch(`${API}/notifications?after=${last.current}`);
      const fresh: Note[] = await res.json();
      if (fresh.length) {
        last.current = fresh[0].id;
        setItems((old) => [...fresh, ...old]);
      }
    }, 2000);
    return () => clearInterval(timer);
  }, []);
  return <Panel items={items} status="polling" />;
}
