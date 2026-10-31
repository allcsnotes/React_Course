export type Role = "student" | "teacher";
export type Question = {
  id: number;
  author: string;
  text: string;
  votes: number;
  sending?: boolean;
};
export type Notice = { id: number; text: string };
export type State = {
  role: Role;
  online: number;
  questions: Question[];
  notices: Notice[];
};

export type Msg =
  | { type: "hello"; role: Role; questions: Question[] }
  | { type: "online"; count: number }
  | { type: "question"; ref?: string; question: Question }
  | { type: "votes"; id: number; votes: number }
  | { type: "notice"; id: number; text: string };

export const empty: State = {
  role: "student",
  online: 0,
  questions: [],
  notices: [],
};

export function reduce(state: State, msg: Msg): State {
  switch (msg.type) {
    case "hello":
      return { ...state, role: msg.role, questions: msg.questions };
    case "online":
      return { ...state, online: msg.count };
    case "question":
      return { ...state, questions: [...state.questions, msg.question] };
    case "votes":
      return {
        ...state,
        questions: state.questions.map((q) =>
          q.id === msg.id ? { ...q, votes: msg.votes } : q,
        ),
      };
    case "notice": {
      const notice = { id: msg.id, text: msg.text };
      const notices = [notice, ...state.notices].slice(0, 3);
      return { ...state, notices };
    }
  }
}

const plural = new Intl.PluralRules("en");
export function onlineLabel(n: number) {
  const one = plural.select(n) === "one";
  return one ? `${n} person online` : `${n} people online`;
}
