const cards = [
  {
    id: 1,
    question: 'What does useState return?',
    answer: 'An array: the value and a setter.',
    hard: false,
  },
  {
    id: 2,
    question: 'Can a component change its own props?',
    answer: 'No. Props are read-only. The parent sends new ones.',
    hard: false,
  },
  {
    id: 3,
    question: 'What is wrong with onClick={save()}?',
    answer: 'It calls save while rendering. Pass save itself.',
    hard: false,
  },
  {
    id: 4,
    question: 'Why does a list item need a key?',
    answer: 'So React can tell the items apart.',
    hard: false,
  },
  {
    id: 5,
    question: 'What does setCount(c => c + 1) fix?',
    answer: 'It uses the latest count, not an old one.',
    hard: true,
  },
  {
    id: 6,
    question: 'Can you push into a state array?',
    answer: 'No. Make a new array: [...items, item].',
    hard: true,
  },
  {
    id: 7,
    question: 'How do two siblings share state?',
    answer: 'Lift it up to their closest common parent.',
    hard: false,
  },
  {
    id: 8,
    question: 'What happens after state changes?',
    answer: 'React renders the component again.',
    hard: false,
  },
]

export default cards
