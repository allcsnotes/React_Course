# M04-B02 · Build a Flashcard Quiz

> Video: Module 4, Build 2. Watch it first, then follow along here.

A quiz you can play, to test yourself on this very course. A card shows a question about React. You think of the answer, press Show answer, and say honestly "I knew it" or "Not yet". The score goes up and the next card comes. Everything from this module is inside: events, state, updater functions, objects in state and lifting state up.

## What you'll learn

- How to sketch a screen, cut it into components, and decide which component owns which state
- Lifting state up to the closest parent of everyone who needs it (`Quiz`), with data down as props and events up as function props
- An object in state, updated with spread, and the updater form to avoid a stale score
- Why an index that runs past the end of a list crashes, and how a ternary picks the whole screen
- What would break in production, and two extensions to try yourself

## Before you start

- Node 24 (`node --version`). All of Module 4, Lessons [01](../m04-l01-handling-events/) to [05](../m04-l05-lifting-state-up/).
- The finished project is `allcsvideos-web/` here. To build it yourself, start from a fresh Vite React project (as in [M01-L03](../../m01-getting-started/m01-l03-setting-up-your-tools/)) and clean the starter.
- No Docker needed.

## Files in this folder

| File or folder | What it is |
|----------------|------------|
| `allcsvideos-web/` | The finished project (run it with `npm install` then `npm run dev`) |
| `allcsvideos-web/src/App.jsx` | Returns the `Quiz` |
| `allcsvideos-web/src/components/` | `Quiz.jsx` (owns the state), `Flashcard.jsx`, `ScoreBar.jsx`, `Controls.jsx` |
| `allcsvideos-web/src/data/cards.js` | The eight flashcards |
| `allcsvideos-web/src/index.css` | The styles |
| `edits/01-...` to `edits/15-...` | The numbered snapshots from the video, including the two mistakes. The name says which file each replaces |

## Run it

```bash
cd allcsvideos-web
npm install
npm run dev
```

Open the address Vite prints (port 5173 unless busy). You see the first card: at the top `1 of 8`, `0 points`, `0 to review` and a progress bar; in the middle the label QUESTION, the question "What does useState return?" and a Show answer button; under it three buttons: I knew it and Not yet (grey until you press Show answer) and Next card. `npm run build` and `npm run lint` pass with no warnings or errors.

## Build it step by step

### The plan

**The mockup.** A row at the top with the progress and the points. In the middle the card: a small label, the question and a Show answer button. Under it three buttons: I knew it, Not yet, Next card. Details: before the answer is shown, the two answer buttons are grey (you cannot say you knew it before you looked). Show answer flips the card. I knew it and Not yet both change the score and move on. Next card only skips. **Hard cards are worth a bonus point**: answer a hard card right and you get 2 points, not 1. The cards are a list of eight objects in a file: `id`, `question`, `answer` and a flag `hard`, with questions from Modules 1 to 4.

Checklist: show the question; Show answer flips the card; the two answer buttons change the score; Next card skips; the progress line; a result with a restart at the end.

**Bricks.** The top line with progress and points: `ScoreBar`. The card: `Flashcard`. The row of three buttons: `Controls`. Around all of them one brick that holds the quiz together: `Quiz`.

```text
App
└── Quiz
    ├── ScoreBar
    ├── Flashcard
    └── Controls
```

One component, one job: `ScoreBar` shows numbers, `Flashcard` shows one card, `Controls` shows buttons, `Quiz` is the boss and decides what happens. One component, one file: a `components/` folder with four files, a `data/` folder for the cards, and `App`, `main` and the style file.

**What changes, and who owns it?** Three things: which card we are on (`index`), whether the answer is showing (`showAnswer`), and the score. That is all the quiz has to remember. Who needs them? `Flashcard` needs `showAnswer` to choose between the question and the answer. `Controls` needs `showAnswer` too, to grey out the buttons. `ScoreBar` needs the index and the score. `Flashcard` and `Controls` are siblings, and siblings cannot read each other's memory, so (Lesson 5) lift the state up to their closest parent: `Quiz` owns all three and hands them down as props. When a button is pressed the child tells the parent with a function prop. Data goes down as props; events go up as functions. `Quiz` owns `index`, `showAnswer` and `score`; everyone else only receives. One source of truth.

### Step 0: a fresh project

Create the project as in Module 1 and clean the starter. Put a tiny style in `src/index.css` (`edits/02-index-0-small-style.css`) and a placeholder in `src/App.jsx` (`edits/01-App-placeholder.jsx`):

```jsx
function App() {
  return <p>Nothing here yet</p>
}

export default App
```

### Step 1: the data

`src/data/cards.js` (`edits/03-data-cards.js`) is a constant `cards`, a list of eight objects. The first card and the end:

```js
const cards = [
  {
    id: 1,
    question: 'What does useState return?',
    answer: 'An array: the value and a setter.',
    hard: false,
  },
  // ... six more cards, same shape; cards 5 and 6 have hard: true
  {
    id: 8,
    question: 'What happens after state changes?',
    answer: 'React renders the component again.',
    hard: false,
  },
]

export default cards
```

Also paste the style now (`edits/04-index-1-quiz-style.css`, which is the real `src/index.css`): a few lines for the bar, the card and the buttons. Styling is Module 6. Nothing changes on the page yet.

### Step 2: Flashcard

`src/components/Flashcard.jsx` (`edits/05-Flashcard.jsx`): a function with three props, `card`, `showAnswer` and `onFlip`.

```jsx
function Flashcard({ card, showAnswer, onFlip }) {
  return (
    <div className="flash">
      <small>
        {showAnswer ? 'ANSWER' : 'QUESTION'}
      </small>
      <h2>
        {showAnswer ? card.answer : card.question}
      </h2>
      {!showAnswer && (
        <button onClick={onFlip}>
          Show answer
        </button>
      )}
    </div>
  )
}

export default Flashcard
```

The label and the heading use a ternary (M02-L06); the button uses `&&`, drawn only when the answer is not showing. Its `onClick` is the prop `onFlip`: we hand over the function itself, with no brackets (Lesson 1). To see it, a temporary `App` (`edits/06-App-shows-one-card.jsx`): the first card, `showAnswer={false}` and `onFlip={() => {}}`. The page shows the question and the button. (Showing one thing or another with a ternary or `&&` is called **conditional rendering**; Module 5 teaches it properly.) Guess: change `showAnswer` to `true` (`edits/07-App-shows-the-answer.jsx`). The card shows the answer text, the label says ANSWER, and the button is gone. The props decide everything: `Flashcard` has no memory of its own.

### Step 3: Quiz, the first piece with memory

`src/components/Quiz.jsx` (`edits/08-Quiz-first-memory.jsx`):

```jsx
import { useState } from 'react'
import cards from '../data/cards'
import Flashcard from './Flashcard'

function Quiz() {
  const [index, setIndex] = useState(0)
  const [showAnswer, setShowAnswer] = useState(false)

  return (
    <div className="quiz">
      <Flashcard
        card={cards[index]}
        showAnswer={showAnswer}
        onFlip={() => setShowAnswer(true)}
      />
    </div>
  )
}

export default Quiz
```

`useState` gives back an array of two things (Lesson 2); destructuring (Module 2) names them. The `onFlip` is an arrow function because `onClick` needs a function to run later, on the click, not now (the trap from Lesson 1). `App` now returns `<Quiz />` (`edits/15-App-final.jsx`). Click Show answer: the card flips. The click ran the handler, `setShowAnswer` made the state true, React rendered `Quiz` again, and `Flashcard` received the new prop (Lesson 3).

### Step 4: ScoreBar

`src/components/ScoreBar.jsx` (`edits/09-ScoreBar.jsx`): three props, `index`, `total` and `score`. It only draws.

```jsx
function ScoreBar({ index, total, score }) {
  return (
    <div>
      <div className="bar">
        <span>{index + 1} of {total}</span>
        <span>{score.points} points</span>
        <span>{score.missed} to review</span>
      </div>
      <progress value={index + 1} max={total} />
    </div>
  )
}

export default ScoreBar
```

The index starts at 0 and people count from 1, so we add one. In `Quiz` (`edits/10-Quiz-with-score.jsx`) add a third piece of state, `score`, whose first value is an object (an object in state, Lesson 4):

```jsx
const [score, setScore] = useState({
  points: 0,
  missed: 0,
})
```

and put `<ScoreBar index={index} total={cards.length} score={score} />` on top. The page shows `1 of 8`, `0 points`, `0 to review`, and the bar is one eighth full.

### Step 5: Controls, and a real bug

`src/components/Controls.jsx` (`edits/11-Controls.jsx`): four props, `showAnswer` and three handlers.

```jsx
function Controls({
  showAnswer,
  onKnew,
  onNotYet,
  onNext,
}) {
  return (
    <div className="controls">
      <button disabled={!showAnswer} onClick={onKnew}>
        I knew it
      </button>
      <button disabled={!showAnswer} onClick={onNotYet}>
        Not yet
      </button>
      <button className="plain" onClick={onNext}>
        Next card
      </button>
    </div>
  )
}

export default Controls
```

While the answer is hidden the first two are grey (`disabled={!showAnswer}`). The third is always on. Now the handlers in `Quiz`. First a helper `goNext`: `setIndex(i => i + 1)` with an updater function and `setShowAnswer(false)` for the next card. **First attempt** (`edits/12-Quiz-stale-score-bug.jsx`), copying the score object with spread (Lesson 4):

```jsx
function handleKnew() {
  setScore({ ...score, points: score.points + 1 })
  if (card.hard) {
    setScore({ ...score, points: score.points + 1 })
  }
  goNext()
}

function handleNotYet() {
  setScore({ ...score, missed: score.missed + 1 })
  goNext()
}
```

`Controls` gets `onKnew={handleKnew}`, `onNotYet={handleNotYet}` and `onNext={goNext}`. The two answer buttons are grey; click Show answer and they light up. Answer the first four cards: I knew it, I knew it, Not yet, I knew it. The bar says `5 of 8`, `3 points`, `1 to review`: correct. Card 5 is a hard card. Guess: Show answer, I knew it. Four, five, or six points? Four! A hard card should give two points, so five in total. We got only one. A real, silent bug: no error, no warning, only a wrong number.

Why? Lesson 3: a state value is a snapshot. In this render `score.points` is 3. Both lines read the same snapshot: 3 + 1 is 4, and then 3 + 1 is 4 again. The second call just repeats the first.

**The fix** (`edits/13-Quiz-updater-fix.jsx`) is also from Lesson 3: pass an updater function. React hands over the latest score each time. Do the same in `handleNotYet`:

```jsx
function handleKnew() {
  setScore(s => ({ ...s, points: s.points + 1 }))
  if (card.hard) {
    setScore(s => ({ ...s, points: s.points + 1 }))
  }
  goNext()
}

function handleNotYet() {
  setScore(s => ({ ...s, missed: s.missed + 1 }))
  goNext()
}
```

Replay: card 5, I knew it: `6 of 8`, `5 points`. Two points for the hard card. Fixed.

### Step 6: the end of the quiz

Play on: card 6 Not yet, card 7 I knew it, and the last card, 8, I knew it. The page goes blank. The console:

```text
Cannot read properties of undefined (reading 'question')
An error occurred in the <Flashcard> component.
```

After card 8 `goNext` made the index 8, but the list has indexes 0 to 7. `cards[8]` is `undefined`, and `Flashcard` crashed. The quiz must notice that the cards ran out (`edits/14-Quiz-done-and-restart.jsx`). A constant `const done = index >= cards.length`, then in the return a ternary: if `done`, show a small result screen, otherwise the three components inside a fragment (Module 3):

```jsx
function restart() {
  setIndex(0)
  setShowAnswer(false)
  setScore({ points: 0, missed: 0 })
}

return (
  <div className="quiz">
    {done ? (
      <div className="done">
        <h2>All done!</h2>
        <p>Points: {score.points}</p>
        <p>To review: {score.missed}</p>
        <button onClick={restart}>Start again</button>
      </div>
    ) : (
      <>
        <ScoreBar index={index} total={cards.length} score={score} />
        <Flashcard card={card} showAnswer={showAnswer} onFlip={() => setShowAnswer(true)} />
        <Controls showAnswer={showAnswer} onKnew={handleKnew} onNotYet={handleNotYet} onNext={goNext} />
      </>
    )}
  </div>
)
```

(see the real file for the exact layout of the props). Choosing a whole screen like this is conditional rendering again; Module 5 goes deep. `restart` has three setters and one click, and React renders once. Replay: I knew it on the last card: `All done! Points: 7, To review: 2`. Start again: back to `1 of 8`, `0 points`.

## Test it like a user

Play the whole quiz from the first card to the last. Card 1: question, then answer, I knew it. Card 2 the same. Card 3 Not yet: the review count moves. Card 4 I knew it. Card 5 is hard and I knew it: 2 points. Card 6 Not yet. Card 7 I knew it. Card 8 I knew it. All done: 7 points, 2 to review. Check the sum: 1, 1, 1, 2, 1, 1 = 7. The console is clean, with no warnings and no errors.

```text
All done!
Points: 7
To review: 2
```

## What would break in production

1. **Nothing is saved.** You are on card 5 with 3 points; you refresh the page; it is card 1 and 0 points. State lives in memory, and a refresh clears memory. In Module 5 the study planner saves its tasks in the browser.
2. **The cards are hard-coded.** They sit in a file. To add a question a developer edits the file and publishes the site again. In a real site the cards come from an API, with `fetch` (Module 2). We do that in Module 7.

## Your turn

**Task 1: shuffle the cards**, so every round has a new order. Hint: never shuffle the original list from the file. Copy it first with spread, and shuffle the copy (in Module 2 you saw what happens when you change the original).

**Task 2: keyboard shortcuts.** Space shows the answer, and the keys 1 and 2 mean I knew it and Not yet. Listening to the keyboard is a job for an effect (Module 7), so treat this as a stretch goal.

## Common mistakes

- Two `setScore({ ...score, ... })` calls in one handler: both read the same snapshot, so the second repeats the first. Use the updater form `setScore(s => ({ ...s, ... }))`.
- Letting an index run past the end of a list: `cards[8]` is `undefined` and the child crashes.
- Passing `onClick={handler()}` instead of the function (Lesson 1).

## Recap

1. State lives in the parent of everyone who needs it. `Quiz` owns `index`, `showAnswer` and `score`. Children receive props and tell the parent with function props.
2. When the new value depends on the old one, pass an updater function. An object in state is never changed: copy it with spread. The stale score was a silent bug: no error, only a wrong number.
3. Check the end of every list. A ternary chooses the screen (Module 5 teaches it).

## Clean up

Press `Ctrl+C` to stop the dev server. If you ran `npm install` in this repo's `allcsvideos-web`, delete its `node_modules` and `dist` folders when you are done.

## Next

You finished Module 4. Next is Module 5: [M05-L01 · Conditional Rendering](../../m05-lists-conditions-and-forms/m05-l01-conditional-rendering/), the first lesson of Module 5: what shows, and what hides, depending on state.
