"use client";
import { useEffect, useRef, useState } from "react";
import { WS_URL, type Note, type Status } from "@/lib/api";

export function useSocket() {
  const [items, setItems] = useState<Note[]>([]);
  const [read, setRead] = useState<number[]>([]);
  const [status, setStatus] = useState<Status>("connecting");
  const ws = useRef<WebSocket | null>(null);
  useEffect(() => {
    let retry = 0;
    let stopped = false;
    let timer: ReturnType<typeof setTimeout>;
    function open() {
      const socket = new WebSocket(WS_URL);
      ws.current = socket;
      socket.onopen = () => { retry = 0; setStatus("live"); };
      socket.onmessage = (e) => {
        const msg = JSON.parse(e.data);
        if (msg.type === "notification") setItems((old) => [msg.note, ...old]);
        if (msg.type === "ack") setRead((old) => [...old, msg.id]);
      };
      socket.onclose = () => {
        if (stopped) return;
        const wait = Math.min(1000 * 2 ** retry++, 8000);
        console.log(`socket closed, trying again in ${wait} ms`);
        setStatus("reconnecting");
        timer = setTimeout(open, wait);
      };
    }
    open();
    return () => { stopped = true; clearTimeout(timer); ws.current?.close(); };
  }, []);
  const markRead = (id: number) => ws.current?.send(JSON.stringify({ type: "read", id }));
  return { items, read, status, markRead };
}
