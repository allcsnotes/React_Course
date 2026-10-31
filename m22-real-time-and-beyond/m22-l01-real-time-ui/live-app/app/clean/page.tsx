"use client";
import Link from "next/link";
import { useEffect } from "react";
import { WS_URL } from "@/lib/api";

export default function Page() {
  useEffect(() => {
    const ws = new WebSocket(WS_URL);
    return () => ws.close();
  }, []);
  return <div className="wrap"><span className="page">page: clean</span><p><Link href="/away">go away</Link></p></div>;
}
