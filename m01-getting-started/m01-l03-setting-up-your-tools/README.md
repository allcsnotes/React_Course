# M01-L03 · Setting Up Your Tools

> Video: Module 1, Lesson 3. Watch it first, then follow along here.

## What you'll learn

- Why React needs a "kitchen" on your computer: Node.js, npm and Vite
- How to install and check Node (`node -v`, `npm -v`), and how to set up VS Code
- Five terminal commands: `pwd`, `ls`, `mkdir`, `cd`, `clear`
- How to create the course project, `allcsvideos-web`, install it and run it
- The four mistakes every beginner makes, and how to read each message

## Before you start

- A computer where you may install programs (Mac, Windows or Linux). No earlier lesson is needed.
- You will install **Node 24** (the LTS version at the time of recording) in step 1. After that, `node --version` should start with `v24`.
- Docker is NOT needed. The video used Docker only to show a fresh Linux computer; that part is optional and marked below.

## Files in this folder

| File or folder | What it is |
|----------------|------------|
| `allcsvideos-web/` | The project that `npm create vite@latest allcsvideos-web -- --template react` makes, as it is at the end of this lesson |
| `allcsvideos-web/package.json` | The shopping list. Exact versions: React 19.3.1, Vite 8.3.5 |
| `allcsvideos-web/package-lock.json` | The exact version of every package, so your install matches the video |
| `allcsvideos-web/index.html` | The one HTML page of the app |
| `allcsvideos-web/vite.config.js` | Vite's settings (it uses the React plugin) |
| `allcsvideos-web/.oxlintrc.json` | Settings for the code checker (`npm run lint`) |
| `allcsvideos-web/src/` | Your code: `main.jsx`, `App.jsx`, `App.css`, `index.css`, `assets/` |
| `allcsvideos-web/public/` | Files served as they are (icons) |

You do not have to copy this folder: in step 5 you create the same project yourself with one command. The folder is here so you can compare, or start from it with `cd allcsvideos-web && npm install`.

## Follow along

### 1. Why we need a kitchen

React runs in the browser, so why install anything? Think of a restaurant. The browser is the dining room: it shows only finished plates. But the React markup (the HTML-like JSX) is not something a browser understands, and a real app is built from many ready-made parts written by other people. A kitchen must convert and assemble all of it first.

- **Node.js** (just "node") runs JavaScript on your own computer, outside the browser. It is the kitchen.
- **npm** (node package manager) delivers the ingredients. A **package** is a folder of ready-made code written by someone else. React itself is a package. npm downloads packages from a big online store into a folder called `node_modules` inside your project.
- **Vite** (said "veet", French for quick) is the main machine in the kitchen: it prepares your files and serves them to the browser.

Node and npm are tools for you, the developer, while you build. Visitors of your website need only a browser.

### 2. Install Node

Go to nodejs.org and click the **LTS** button. LTS means long-term support: a stable version that gets fixes for years. (The other choice, "Current", has the newest features but changes fast.) If the site shows a newer LTS number than 24, take it; the lessons work the same.

On Windows and Mac you download an installer, open it and accept the default choices. After installing, **close your terminal and open a new one**, because an old window does not know about the new program.

Check the installation. `-v` means "print your version, then stop":

```bash
node -v
npm -v
```

The output on the Mac used in the video (yours may be a little newer):

```text
v24.16.0
11.13.0
```

The first number, 24, is what matters. Try one line of JavaScript without a browser:

```bash
node -e "console.log(2 + 3)"
```

```text
5
```

Node ran JavaScript with no browser anywhere.

### 3. Optional: a computer without Node (Linux)

The video used Docker to show a fresh Linux computer. You can skip this step. On a computer without Node, both commands fail:

```bash
node -v
npm -v
```

```text
bash: node: command not found
bash: npm: command not found
```

On Linux, a helper called nvm (node version manager) installs Node. The first command downloads nvm (it ends with "Close and reopen your terminal"); after reopening the terminal, `nvm install 24` installs Node:

```bash
nvm install 24
```

```text
Downloading and installing node v24.22.1...
Downloading https://nodejs.org/dist/v24.22.1/node-v24.22.1-linux-arm64.tar.gz...
Computing checksum with sha256sum
Checksums matched!
Now using node v24.22.1 (npm v11.19.1)
Creating default alias: default -> 24 (-> v24.22.1 *)
```

```bash
node -v
npm -v
```

```text
v24.22.1
11.19.1
```

The last numbers differ from the Mac and that is fine. (Nothing was installed on the Mac for this part: a disposable Docker container acted as the fresh computer.)

### 4. Set up VS Code and the terminal

A code editor colors the words so code is easy to read, lists your files, points out mistakes as you type and has a terminal built in. The most popular one is Visual Studio Code (VS Code), free from code.visualstudio.com. Install it with the default choices.

Three settings, once:

1. Always open the whole project folder: **File > Open Folder**, pick your project folder. Then the file list shows everything in it.
2. Turn on **Auto Save** in the File menu, so you can never forget to save.
3. Open the Extensions tab and install **Prettier**, then turn on **Format On Save** in the settings. Your code is tidied up every time you save.

Open the built-in terminal with `Ctrl` + backtick (the key next to the number 1 on most keyboards). It opens at the bottom, already inside your project folder. You can also use the Terminal app on Mac and Linux, or PowerShell on Windows.

The terminal always stands in exactly one folder, called the current folder. Five commands are enough to start:

```bash
pwd          # print working directory: which folder am I in?
ls           # list: what is in this folder?
mkdir projects   # make a new folder called projects (prints nothing when it works)
cd projects  # change directory: walk into projects
cd ..        # two dots: walk back out to the folder above
clear        # wipe the screen (nothing is deleted)
```

Example (your folder names will differ):

```text
$ pwd
/home/asha
$ ls
Desktop  Documents  Downloads
$ mkdir projects
$ ls
Desktop  Documents  Downloads  projects
$ cd projects
$ pwd
/home/asha/projects
$ cd ..
$ pwd
/home/asha
```

On Windows, PowerShell understands all of these. In the older Command Prompt use `dir` instead of `ls` and `cls` instead of `clear`. Two time savers: the up arrow brings back your last command, and `Tab` finishes a long folder name.

### 5. Create the project

Go to a folder where your projects live (for example `projects`) and run the one command that creates the course project:

```bash
npm create vite@latest allcsvideos-web -- --template react
```

Taking it apart: `npm create vite@latest` runs the official Vite project starter in its newest version. `allcsvideos-web` is the name of the new folder (we choose it). The two dashes `--` mean "everything after this goes to the starter". `--template react` starts from the React starting kit. The real output:

```text
> npx
> "cva" allcsvideos-web --template react


create-vite v9.3.3

│
◇  Scaffolding project in .../projects/allcsvideos-web...
│
└  Done. Now run:

  cd allcsvideos-web
  npm install
  npm run dev
```

(The `...` is the path on your computer.) The tool "scaffolds" the project, like scaffolding around a building: the frame is ready in a moment, and it prints the three next steps.

Walk into the new folder (every command that follows must be typed inside it) and look around:

```bash
cd allcsvideos-web
ls
```

```text
README.md
index.html
package.json
public
src
vite.config.js
```

Open `package.json`. It is the shopping list of the project:

```json
{
  "name": "allcsvideos-web",
  "private": true,
  "version": "0.0.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "lint": "oxlint",
    "preview": "vite preview"
  },
  "dependencies": {
    "react": "^19.3.1",
    "react-dom": "^19.3.1"
  },
  "devDependencies": {
    "@types/react": "^19.3.0",
    "@types/react-dom": "^19.3.0",
    "@vitejs/plugin-react": "^6.1.2",
    "oxlint": "^1.89.0",
    "vite": "^8.3.5"
  }
}
```

Under `dependencies` are the packages the app needs (`react`, and `react-dom`, the part that puts it on a web page). Under `devDependencies` are the tools, like Vite. Under `scripts`, `dev` stands for `vite`, so `npm run dev` simply starts Vite. (The `package.json` in this repo folder writes the versions without `^`, so you get exactly the versions of the video.)

A shopping list is only a list: the packages are not downloaded yet. Run:

```bash
npm install
```

```text

added 24 packages, and audited 25 packages in 7s

9 packages are looking for funding
  run `npm fund` for details

found 0 vulnerabilities
```

The time depends on your internet. Now `ls` shows two new things: `node_modules` (all the packages) and `package-lock.json` (the exact version of each one). We installed React 19.3.1 and Vite 8.3.5. Yours may be a little newer, and that is fine.

### 6. Run it

```bash
npm run dev -- --port 5113
```

The `--` passes the rest to Vite. A port is a numbered door on your computer; we choose door 5113 so it does not clash with other programs (Vite's own default is 5173). The real output:

```text
> allcsvideos-web@0.0.0 dev
> vite --port 5113


  VITE v8.3.5  ready in 677 ms

  ➜  Local:   http://localhost:5113/
  ➜  Network: use --host to expose
```

Vite is ready in a fraction of a second (the time will differ). `localhost` means this computer and 5113 is the door. The terminal does not come back to the prompt: the server keeps running, waiting for the browser. That is normal.

Open `http://localhost:5113/` in your browser. You see the React and Vite logos, a heading **Get started**, and a button **Count is 0**. This is a complete, working React app made by one command.

Guess: if you click the button three times, what does it say after each click?

```text
Count is 0   (before)
Count is 1
Count is 2
Count is 3
```

Remember Lesson 1: the screen follows the data. The count is the data. Each click changes only the count, and React updates the button text. You build this yourself in Module 4.

Stop the server with `Ctrl+C` in its terminal. Next time, go into the project folder and type `npm run dev` again; you do not need to install again.

## Common mistakes

Read the first lines of every message and ask two questions: where am I, and what is missing?

**1. command not found.** The computer has no npm: Node is not installed, or the terminal was opened before the install. Install Node, open a new terminal and check with `node -v`. On Windows the same problem says "not recognized".

**2. The wrong folder (Asha's error from the start).** She is in the `projects` folder, where `ls` shows nothing, and types `npm run dev`:

```text
npm error code ENOENT
npm error syscall open
npm error path /home/asha/projects/package.json
npm error errno -2
npm error enoent Could not read package.json: Error: ENOENT: no such file or directory, open '/home/asha/projects/package.json'
npm error enoent This is related to npm not being able to find a file.
```

`ENOENT` means "error, no entry": the file does not exist here. npm looked for `package.json` right in this folder. Fix with three commands: `pwd` (where am I), `ls` (what is here), `cd allcsvideos-web` (go into the project folder), then run the command again.

**3. Forgetting `npm install`.** The start command says `vite: command not found`:

```text
> allcsvideos-web@0.0.0 dev
> vite

sh: vite: command not found
```

The list exists but the packages were never downloaded, so the computer has no Vite. Run `npm install`, then try again.

**4. The port is busy.** An old server is still running in another terminal. Vite does not fail; it says so and picks another door:

```text
Port 5113 is in use, trying another one...

  VITE v8.3.5  ready in 131 ms

  ➜  Local:   http://localhost:5114/
  ➜  Network: use --host to expose
```

The trap: if you open `localhost:5113` you see the OLD server, not your new one. Always read the **Local** line and open that address. The fix is to find the terminal with the old server and press `Ctrl+C`.

## Try it yourself

Install Node, create your own project with the command from step 5, and click the counter. Then make a mistake on purpose: run `npm run dev` in the wrong folder (the folder above the project), and read the error.

## Clean up

Press `Ctrl+C` to stop the dev server. To remove the project, delete the `allcsvideos-web` folder you created. If you only used the folder from this repo, delete `allcsvideos-web/node_modules`. In the Linux part, nothing was installed on your own computer.

## Next

[M01-L04 · Tour of Your First React App](../m01-l04-tour-of-your-first-react-app/): we open every file of this project, change something and watch the page update by itself.
