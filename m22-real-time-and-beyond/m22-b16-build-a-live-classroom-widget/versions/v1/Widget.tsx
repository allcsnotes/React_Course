"use client";
import { useOptimistic } from "react";
import { AnimatePresence, MotionConfig, motion } from "motion/react";
import { onlineLabel, type Role } from "@/lib/classroom";
import { useClassroom } from "@/lib/useClassroom";

type Props = { name: string; role: Role };

export default function Widget({ name, role }: Props) {
  const { state, status, ask, vote, notify } = useClassroom(name, role);
  const [questions, addQuestion] = useOptimistic(
    state.questions,
    (list, text: string) => [
      ...list,
      { id: -1, author: name, text, votes: 0, sending: true },
    ],
  );

  async function submit(data: FormData) {
    const text = String(data.get("text") ?? "").trim();
    if (!text) return;
    addQuestion(text);
    await ask(text);
  }

  function announce(data: FormData) {
    const text = String(data.get("notice") ?? "").trim();
    if (text) notify(text);
  }

  return (
    <MotionConfig reducedMotion="user">
      <section className="widget" aria-label="Live classroom">
        <header>
          <h1>Live classroom</h1>
          <span className="online">{onlineLabel(state.online)}</span>
        </header>
        <p role="status" className="status">
          {status === "open" ? "" : "Reconnecting…"}
        </p>
        <div
          role="log"
          aria-live="polite"
          aria-label="Notices"
          className="notices"
        >
          <AnimatePresence initial={false}>
            {state.notices.map((n) => (
              <motion.p
                key={n.id}
                className="notice"
                layout
                initial={{ opacity: 0, y: -16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
              >
                {n.text}
              </motion.p>
            ))}
          </AnimatePresence>
        </div>
        <ul className="questions">
          {[...questions].sort((a, b) => b.votes - a.votes).map((q) => (
            <motion.li key={q.id} layout className={q.sending ? "sending" : ""}>
              <button
                onClick={() => vote(q.id)}
                disabled={q.sending}
                aria-label={`Vote for: ${q.text}`}
              >
                ▲ {q.votes}
              </button>
              <span>{q.text}</span>
              <small>{q.sending ? "sending…" : q.author}</small>
            </motion.li>
          ))}
        </ul>
        <form action={submit}>
          <input
            name="text"
            placeholder="Ask a question"
            aria-label="Your question"
          />
          <button type="submit">Ask</button>
        </form>
        {role === "teacher" && (
          <form action={announce}>
            <input
              name="notice"
              placeholder="Tell the class"
              aria-label="Notice for the class"
            />
            <button type="submit">Send</button>
          </form>
        )}
      </section>
    </MotionConfig>
  );
}
