import { WebSocketServer } from "ws";

const wss = new WebSocketServer({ port: 8226 });
const DELAY = Number(process.env.DELAY_MS ?? 0);
const TEACHER_CODE = process.env.TEACHER_CODE;
if (!TEACHER_CODE) throw new Error("Set TEACHER_CODE first");
const questions = [];
let nextId = 1;

const send = (ws, msg) => ws.send(JSON.stringify(msg));
const members = (gone) =>
  [...wss.clients].filter((c) => c.user && c !== gone);
const broadcast = (msg, gone) =>
  members(gone).forEach((c) => send(c, msg));
const pub = ({ id, author, text, votes }) => ({ id, author, text, votes });

wss.on("connection", (ws) => {
  ws.on("message", (raw) => {
    const msg = JSON.parse(raw);
    if (msg.type === "join") {
      const teacher =
        msg.role === "teacher" && msg.code === TEACHER_CODE;
      ws.user = {
        name: msg.name,
        role: teacher ? "teacher" : "student",
      };
      send(ws, {
        type: "hello",
        role: ws.user.role,
        questions: questions.map(pub),
      });
      const count = members().length;
      broadcast({ type: "online", count });
      console.log(
        `join   ${msg.name} (${ws.user.role}) -> ${count} online`,
      );
      if (msg.role === "teacher" && !teacher) {
        console.log(`refuse ${msg.name}: wrong teacher code`);
      }
    }
    if (msg.type === "ask" && ws.user) {
      const q = {
        id: nextId++,
        author: ws.user.name,
        text: msg.text,
        votes: 0,
        voters: [],
      };
      questions.push(q);
      console.log(`ask    ${q.author}: ${q.text}`);
      setTimeout(() => {
        broadcast({
          type: "question",
          ref: msg.ref,
          question: pub(q),
        });
      }, DELAY);
    }
    if (msg.type === "vote" && ws.user) {
      const q = questions.find((x) => x.id === msg.id);
      if (q && !q.voters.includes(ws.user.name)) {
        q.voters.push(ws.user.name);
        q.votes++;
        broadcast({ type: "votes", id: q.id, votes: q.votes });
        console.log(
          `vote   ${ws.user.name} -> question ${q.id} (${q.votes})`,
        );
      }
    }
    if (msg.type === "notice" && ws.user?.role === "teacher") {
      broadcast({ type: "notice", id: Date.now(), text: msg.text });
      console.log(`notice ${ws.user.name}: ${msg.text}`);
    }
  });
  ws.on("close", () => {
    if (!ws.user) return;
    broadcast({ type: "online", count: members(ws).length }, ws);
    console.log(`leave  ${ws.user.name} -> ${members(ws).length} online`);
  });
});

console.log("classroom server on ws://localhost:8226");
