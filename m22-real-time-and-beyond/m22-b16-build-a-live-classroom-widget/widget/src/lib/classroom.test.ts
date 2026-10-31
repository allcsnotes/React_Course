import test from "node:test";
import assert from "node:assert/strict";
import { empty, onlineLabel, reduce } from "./classroom.ts";

const q = (id: number, votes = 0) => ({ id, author: "Lukas", text: `question ${id}`, votes });

test("hello carries the role the server decided and the list", () => {
  const s = reduce(empty, { type: "hello", role: "teacher", questions: [q(1)] });
  assert.equal(s.role, "teacher");
  assert.equal(s.questions.length, 1);
});

test("an online message replaces the count", () => {
  assert.equal(reduce(empty, { type: "online", count: 3 }).online, 3);
});

test("a new question goes to the end of the list", () => {
  const s = reduce({ ...empty, questions: [q(1)] }, { type: "question", question: q(2) });
  assert.deepEqual(s.questions.map((x) => x.id), [1, 2]);
});

test("votes change only the matching question", () => {
  const s = reduce({ ...empty, questions: [q(1), q(2)] }, { type: "votes", id: 2, votes: 5 });
  assert.deepEqual(s.questions.map((x) => x.votes), [0, 5]);
});

test("only the newest three notices are kept, newest first", () => {
  let s = empty;
  for (const id of [1, 2, 3, 4]) s = reduce(s, { type: "notice", id, text: `n${id}` });
  assert.deepEqual(s.notices.map((n) => n.id), [4, 3, 2]);
});

test("the online label says person for one and people for the rest", () => {
  assert.equal(onlineLabel(1), "1 person online");
  assert.equal(onlineLabel(2), "2 people online");
  assert.equal(onlineLabel(0), "0 people online");
});
