"use client";
import { useEffect, useState } from "react";
import { QueryClient, QueryClientProvider, useQuery, useQueryClient } from "@tanstack/react-query";
import { API, WS_URL, type Note, type Status } from "@/lib/api";
import { Header, List } from "@/components/Panel";

const getNotes = (): Promise<Note[]> => fetch(`${API}/notifications`).then((r) => r.json());

function useLive() {
  const qc = useQueryClient();
  const [status, setStatus] = useState<Status>("connecting");
  useEffect(() => {
    let retry = 0;
    let stopped = false;
    let timer: ReturnType<typeof setTimeout>;
    let socket: WebSocket;
    function open() {
      socket = new WebSocket(WS_URL);
      socket.onopen = () => {
        retry = 0;
        setStatus("live");
        qc.invalidateQueries({ queryKey: ["notifications"] });
      };
      socket.onmessage = (e) => {
        const msg = JSON.parse(e.data);
        qc.setQueryData<Note[]>(["notifications"], (old = []) => [msg.note, ...old]);
      };
      socket.onclose = () => {
        if (stopped) return;
        setStatus("reconnecting");
        timer = setTimeout(open, Math.min(1000 * 2 ** retry++, 8000));
      };
    }
    open();
    return () => { stopped = true; clearTimeout(timer); socket.close(); };
  }, [qc]);
  return status;
}

function Count({ status }: { status: Status }) {
  const { data = [] } = useQuery({ queryKey: ["notifications"], queryFn: getNotes });
  return <Header count={data.length} status={status} />;
}

function Items() {
  const { data = [] } = useQuery({ queryKey: ["notifications"], queryFn: getNotes });
  return <List items={data} />;
}

function Live() {
  const status = useLive();
  return (
    <div className="wrap">
      <Count status={status} />
      <h1>Notifications</h1>
      <Items />
    </div>
  );
}

export default function Page() {
  const [client] = useState(() => new QueryClient());
  return <QueryClientProvider client={client}><Live /></QueryClientProvider>;
}
