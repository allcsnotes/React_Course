# M14-L02 · Identity, Keys and State Preservation

> Video: Module 14, Lesson 2. Watch it first, then follow along here.

Asha is building a message box for the allcsvideos team: two tabs (Lukas and Priya) and one chat box with a draft and a sent counter. She types a message for Lukas, clicks the Priya tab, and the draft is still there. One click on Send and Priya gets a message written for Lukas. React followed its rules exactly. In this lesson you learn those rules: when React keeps a component's memory and when it throws it away.

## What you'll learn

- State belongs to a place in the tree (a room), not to the props you pass in (the guest)
- Rule 1: same type, same position, same key keeps the state, whatever the props say
- Rule 2: a different type in the same place destroys the state (unmount, then mount)
- Positions are slots counted from the top, and an empty slot (`false`) still counts
- A `key` is part of a component's identity: it resets the whole branch on purpose
- Two ways to choose: a key to start fresh, or hiding to keep the memory
- Two mistakes: a component defined inside another component, and a key in the wrong place

## Before you start

- Node 24 (`node --version`; recorded with v24.16.0).
- You did [M14-L01](../m14-l01-the-virtual-dom-and-reconciliation/README.md), and know keys (Module 5, lesson 2), effects (Module 7, lesson 2) and lifting state (Module 4, lesson 5).
- Docker is not used.

## Files in this folder

| File | What it is |
|---|---|
| `package.json` | Pinned: React 19.3.1, Vite 8.3.5, TypeScript 7.0.2 |
| `src/App.tsx` | The finished app: `<ChatBox key={to.id} ... />` (stage v5) |
| `src/ChatBox.tsx` | `draft` and `sent` state, plus a spy effect that logs `ChatBox mounted` and `ChatBox unmounted` |
| `src/Tabs.tsx`, `src/contacts.ts` | The two tabs and the contact list |
| `src/main.tsx`, `src/index.css` | Entry point (Strict Mode is off, so each log prints once) and styles |
| `versions/` | `base` (shared files), `v1-bug` (no key), `v2-types`, `v3-slots`, `v4-tip`, `v5-key` (same as `src/`), `v6-keep`, `m1-inner`, `m1-fixed`, `m2-wrongkey` |

Every stage is the base files, then `v1-bug`, then the stage on top. To try a stage:

```bash
find src -type f -delete
cp versions/base/* versions/v1-bug/* src/
cp versions/v2-types/* src/        # the stage you want
```

Vite reloads on its own. Put `versions/v5-key` on top at the end.

## Follow along

### 1. Install and start

```bash
npm install
npm run dev
```

```text
  VITE v8.3.5  ready in ... ms

  ➜  Local:   http://localhost:5142/
```

Open http://localhost:5142/ and the browser console.

### 2. Rule 1: same type, same place (stage v1-bug)

Switch to `v1-bug` (`cp versions/base/* versions/v1-bug/* src/` after emptying `src/`). `App` keeps one piece of state, who the message is for, and draws the tabs and one chat box:

```tsx
export default function App() {
  const [to, setTo] = useState(contacts[0])

  return (
    <main>
      <h1>Message a teammate</h1>
      <Tabs to={to} onPick={setTo} />
      <ChatBox contact={to} />
    </main>
  )
}
```

`ChatBox` has two pieces of memory, `draft` and `sent`, and a spy effect from Module 7:

```tsx
useEffect(() => {
  console.log('ChatBox mounted')
  return () => console.log('ChatBox unmounted')
}, [])
```

Type `Hi Lukas, the notes are ready.` and click the Priya tab. Real result:

```text
title: To: Priya
draft: Hi Lukas, the notes are ready.
console: (nothing new)
```

The title changed (the prop), but the draft stayed, and the console printed no new lines. The chat box was never removed. It was only drawn again with a new prop. Same type, same position: the same room, so the suitcase stays.

### 3. Rule 2: a different type destroys the state (stage v2-types)

Wrap the chat box in a `div` for Lukas and a `section` for Priya:

```tsx
{to.id === 'lukas' ? (
  <div><ChatBox contact={to} /></div>
) : (
  <section><ChatBox contact={to} /></section>
)}
```

Guess: type the message for Lukas and click Priya. Is the draft still there? And what does the console print? Real result: the draft is gone, the counter says `Sent: 0`, and the console shows:

```text
ChatBox unmounted
ChatBox mounted
```

React compared a `div` with a `section` at that place, saw different types, and did not even look inside. It removed the whole old branch, memory included, and built a new one.

### 4. What is a place? Slots (stage v3-slots)

```tsx
{to.id === 'lukas' && <ChatBox contact={to} />}
{to.id === 'priya' && <ChatBox contact={to} />}
```

Same type, but two lines, so two slots. Type, click Priya: the draft is gone and the console prints `ChatBox unmounted`, then `ChatBox mounted`. A different slot is a different room.

Now the opposite (stage `v4-tip`). A tip sits above the chat box, with a button that shows and hides it:

```tsx
{showTip && <p className="tip">Tip: name the person.</p>}
<ChatBox contact={to} />
```

Type a message and click Show tip. The tip appears and the draft is still there, with no new console lines. When `showTip` is `false`, React still keeps an empty slot for it. Slots are counted in order, and the empty ones count too. The tip only fills its own slot, and the chat box stays in the same slot as before.

### 5. Start fresh with a key (stage v5-key)

A key is part of the identity: same type, same place, but a different key is a different room. One change:

```tsx
<ChatBox key={to.id} contact={to} />
```

Type a message for Lukas and click Send (`Sent: 1`), type a second message, and click Priya. Real result: the title says `To: Priya`, the box is empty, the counter says `Sent: 0`, and the console shows `ChatBox unmounted` then `ChatBox mounted`. Everything inside the chat box started fresh: the draft, the counter, and the state of anything inside it. A key resets the whole branch.

Click Lukas again: the box is empty and the counter is `Sent: 0`. His message is gone for good. A key does not move a room, it throws the old room away.

### 6. Keep the memory: hide, do not remove (stage v6-keep)

Draw a chat box for every contact, all the time, and hide the ones that are not selected:

```tsx
{contacts.map(c => (
  <div key={c.id} className={c.id === to.id ? '' : 'hid'}>
    <ChatBox contact={c} />
  </div>
))}
```

Type a message for Lukas, click Priya, type `Hi Priya, see you at six`, click Lukas. Real result: his message is still there, and so is hers (in the hidden box). The console shows `ChatBox mounted` once per box when the page opens and nothing after that.

The price: both chat boxes stay alive all the time, are drawn again with the page, and their effects keep running. For two tabs that is nothing; for fifty heavy tabs it is. Another way is to lift the drafts into `App` (Module 4, lesson 5). So you choose: a key to start fresh, hiding to keep.

## Common mistakes

1. **A component defined inside another component** (stage `m1-inner`). To save a file, `Box` is written inside `App`:

   ```tsx
   export default function App() {
     const [draft, setDraft] = useState('')

     function Box() {
       useEffect(() => {
         console.log('Box mounted')
         return () => console.log('Box unmounted')
       }, [])
       return <input value={draft} onChange={e => setDraft(e.target.value)} />
     }

     return (<main><h1>Write a message</h1><Box /></main>)
   }
   ```

   Click in the box and type `abc`. Real result: only `a` arrives, the cursor is gone, and after that one letter the console shows `Box unmounted` and `Box mounted` again. Every time `App` is drawn again, the line `function Box` runs again and makes a brand new function, and to React a new function is a new type. A different type in the same place is rule 2: the old input is destroyed, and a new input does not have the focus.

   The fix (stage `m1-fixed`): move `Box` out, above `App`, and pass the draft in as props. Now `abc` all arrives, the cursor stays in the box, and `Box mounted` prints once. Define components at the top of the file, never inside another component.
2. **The key in the wrong place** (stage `m2-wrongkey`). The key goes inside `ChatBox`, on the `section` it returns:

   ```tsx
   <section key={contact.id}>
   ```

   Type, click Priya: the draft is still there, and no `unmounted` line appears. Only the `section` is a new room; the `ChatBox`, which holds the memory, is the same one as before. Put the key on the component that owns the state, where `App` uses it: `<ChatBox key={to.id} ... />`.

## Clean up

Press Ctrl+C in the terminal. Put `versions/base`, `v1-bug` and `v5-key` back into `src/` if you tried other stages. Delete `node_modules` and `dist` if you like.

## Try it yourself

In the version without a key (`v1-bug`), add a Clear button that empties the draft. Then remove it, and fix the whole thing with a key. Which needs less code? And which extra things does the key reset? (Answer: the key is one attribute and needs no button; it also resets `sent` and the state of anything inside the chat box, while Clear resets only the draft.)

Interview tip. "How does React know whether to keep the state of a component?" It compares the old and new tree by position. The same type, at the same position, with the same key, keeps its state. A different type or a different key unmounts the old one and mounts a new one. That is why a key is the way to reset state on purpose.

## Next

[M14-L03 · Why a Component Re-renders](../m14-l03-why-a-component-re-renders/README.md)
