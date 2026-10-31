import type { Note } from "@/lib/api";

export function Bell({ count }: { count: number }) {
  return (
    <div className="bell" aria-label={`${count} notifications`}>
      <svg viewBox="0 0 24 24" width="38" height="38" fill="none" stroke="#14213d" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M6 9a6 6 0 0 1 12 0c0 6 2 7 2 7H4s2-1 2-7" /><path d="M10 20a2 2 0 0 0 4 0" /></svg>
      {count > 0 && <span className="badge">{count}</span>}
    </div>
  );
}

export function Header({ count, status }: { count: number; status: string }) {
  return (
    <div className="top">
      <span className="logo">allcsvideos</span>
      <div className="right">
        <span className={`chip ${status}`}>{status}</span>
        <Bell count={count} />
      </div>
    </div>
  );
}

export function List({ items, read = [], onRead }: { items: Note[]; read?: number[]; onRead?: (id: number) => void }) {
  return (
    <>
      <div role="status" className="strip">{items[0] ? `Just now: ${items[0].title}` : ""}</div>
      {items.length === 0 && <p className="empty">No notifications yet.</p>}
      <ul className="list">
        {items.slice(0, 3).map((n) => (
          <li key={n.id} className="note">
            <span><b>{n.title}</b><small>{n.by} · #{n.id}</small></span>
            {onRead && (read.includes(n.id) ? <span className="done">read ✓</span> : <button onClick={() => onRead(n.id)}>Mark read</button>)}
          </li>
        ))}
      </ul>
    </>
  );
}

export function Panel({ items, status, read, onRead }: { items: Note[]; status: string; read?: number[]; onRead?: (id: number) => void }) {
  return (
    <div className="wrap">
      <Header count={items.length} status={status} />
      <h1>Notifications</h1>
      <List items={items} read={read} onRead={onRead} />
    </div>
  );
}
