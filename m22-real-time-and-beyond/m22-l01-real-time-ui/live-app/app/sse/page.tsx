"use client";
import { useEffect, useState } from "react";
import { API, type Note, type Status } from "@/lib/api";
import { Panel } from "@/components/Panel";

export default function Page() {
  const [items, setItems] = useState<Note[]>([]);
  const [status, setStatus] = useState<Status>("connecting");
  useEffect(() => {
    const source = new EventSource(`${API}/events`);
    source.onopen = () => setStatus("live");
    source.onmessage = (e) => setItems((old) => [JSON.parse(e.data), ...old]);
    source.onerror = () => setStatus("reconnecting");
    return () => source.close();
  }, []);
  return <Panel items={items} status={status} />;
}
