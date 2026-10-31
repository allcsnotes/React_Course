"use client";
import { useCallback, useEffect, useReducer, useRef, useState } from "react";
import { empty, reduce, type Msg, type Role } from "./classroom";

export type Status = "connecting" | "open" | "reconnecting";

export function useClassroom(name: string, role: Role, code: string) {
  const [state, dispatch] = useReducer(reduce, empty);
  const [status, setStatus] = useState<Status>("connecting");
  const ws = useRef<WebSocket | null>(null);
  const waiting = useRef(new Map<string, () => void>());

  useEffect(() => {
    let stopped = false;
    let tries = 0;
    let timer: ReturnType<typeof setTimeout>;

    function open() {
      const socket = new WebSocket("ws://localhost:8226");
      ws.current = socket;
      socket.onopen = () => {
        tries = 0;
        setStatus("open");
        socket.send(JSON.stringify({ type: "join", name, role, code }));
      };
      socket.onmessage = (event) => {
        const msg: Msg = JSON.parse(event.data);
        if (msg.type === "question" && msg.ref) {
          waiting.current.get(msg.ref)?.();
        }
        dispatch(msg);
      };
      socket.onclose = () => {
        if (stopped) return;
        setStatus("reconnecting");
        timer = setTimeout(open, Math.min(1000 * 2 ** tries++, 8000));
      };
    }

    open();
    return () => {
      stopped = true;
      clearTimeout(timer);
      ws.current?.close();
    };
  }, [name, role, code]);

  const send = useCallback(
    (msg: object) => ws.current?.send(JSON.stringify(msg)),
    [],
  );

  const ask = useCallback(
    (text: string) =>
      new Promise<void>((done) => {
        const ref = crypto.randomUUID();
        waiting.current.set(ref, done);
        send({ type: "ask", text, ref });
        setTimeout(done, 5000);
      }),
    [send],
  );

  return {
    state,
    status,
    ask,
    vote: (id: number) => send({ type: "vote", id }),
    notify: (text: string) => send({ type: "notice", text }),
  };
}
