"use client";
import Link from "next/link";
import { useEffect } from "react";
import { WS_URL } from "@/lib/api";

export default function Page() {
  useEffect(() => {
    new WebSocket(WS_URL);
  }, []);
  return <div className="wrap"><span className="page">page: leak</span><p><Link href="/away">go away</Link></p></div>;
}
