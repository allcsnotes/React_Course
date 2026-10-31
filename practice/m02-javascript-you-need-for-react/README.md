# M02 · Practice Sheet

> Practice for Module 2 (JavaScript you need for React). Do it after [M02-L06](../../m02-javascript-you-need-for-react/m02-l06-short-hand-logic/).

20 small exercises, about three or four per lesson, from easy to harder. Some are "predict the output", some are "fix the broken code", and some build a small program. Nothing needs more than Module 2.

## What is here

| File or folder | What it is |
|----------------|------------|
| [`sheet.md`](sheet.md) | The sheet: the 20 exercises, each with a hint and a worked answer with the real output |
| [`solutions/`](solutions/) | The 20 solution files, `ex01.js` to `ex20.js`, plus the helpers they use |
| `solutions/broken/` | The five broken files for exercise 3 (fix the errors) |
| `solutions/helpers/` | A small module for the import exercises |
| `solutions/server.js` | A tiny local server that plays the allcsvideos API (exercises 15 and 20 start it themselves, so no internet is involved) |
| `solutions/courses.js` | The four courses used from exercise 4 on |

## How to use it

1. You need Node 24 (`node --version`).
2. Open [`sheet.md`](sheet.md) and read one exercise.
3. Try it yourself first. Make a file named after the exercise (`Ex01.js`, `Ex02.js`, ...) in a folder of your own that has a `package.json` containing `{ "type": "module" }`, and run it with `node Ex01.js`. For "predict the output" exercises, write your guess on paper before you run anything.
4. Stuck? Open only the hint for that exercise, then try again.
5. When you have an answer (or after a real try), compare it with the worked answer. Your code can be different and still right, as long as the output matches.
6. To run a ready-made solution:

```bash
cd solutions
node ex07.js
```

All 20 solutions were run with Node 24 and finish without errors. The files in `solutions/broken/` fail on purpose.

## Scoring yourself

16 to 20 working programs: you are ready for Module 3. Under 12: rewatch the lessons named above the exercises you missed. Exercises 3, 12 and 15 (reading error messages) are the best practice for every module that follows.

## Next

[M03-L01 · Components as LEGO Bricks](../../m03-jsx-and-components/m03-l01-components-as-lego-bricks/)
