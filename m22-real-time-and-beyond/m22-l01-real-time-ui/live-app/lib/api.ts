export const API = "http://localhost:8221";
export const WS_URL = "ws://localhost:8221/ws";
export type Note = { id: number; title: string; by: string; at: string };
export type Status = "connecting" | "live" | "reconnecting" | "offline";
