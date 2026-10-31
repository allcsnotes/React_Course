"use client";
import { useSocket } from "@/lib/useSocket";
import { Panel } from "@/components/Panel";

export default function Page() {
  const { items, read, status, markRead } = useSocket();
  return <Panel items={items} status={status} read={read} onRead={markRead} />;
}
