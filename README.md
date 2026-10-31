# React Course: From Zero to Production, Interview Ready

The companion repo for the **AllCsVideos React course**: 23 modules, 114 videos, one running story (Asha, Lukas, Priya and Meera building the allcsvideos.com platform, with Rahul as the interviewer), from your first component to a tested, typed, secured, deployed full-stack Next.js app and a React interview.

Every video has a folder here with its files and a step-by-step guide, so you can repeat on your own laptop exactly what the video does.

---

## How to use this repo

1. **Clone it once:**
   ```bash
   git clone https://github.com/allcsnotes/React_Course.git
   cd React_Course
   ```
2. **Watch a lecture**, then open its folder (see the [lesson index](#lesson-index) below, or the **Resources** link on the lecture page).
3. **Open the folder's `README.md` and follow it top to bottom.** Every lesson README has the same parts:

   | Part | What it gives you |
   |---|---|
   | What you'll learn | the goal of the lecture in a few bullets |
   | Before you start | what to install, and which earlier lesson you need |
   | Files in this folder | what each file is for |
   | Follow along | every command, in the order the video runs it, with the output you should see |
   | Common mistakes | the traps the video warns about |
   | Clean up | how to remove only what this lesson created |
   | Next | a link to the next lecture |

   Lectures that are mostly ideas have **Key ideas** and **Try it yourself** instead. Build lectures have **Run it** and **Build it step by step**.
4. **Run a project** by opening its folder and running `npm install` and then `npm run dev` (the README of each lesson says exactly what to run).
5. **Get updates** later with `git pull`.

> Work on a **copy** when a lesson changes files. Your clone stays clean, and `git pull` keeps working.

---

## What to install, module by module

You do **not** need everything on day one.

| Modules | Install before you start | Notes |
|---|---|---|
| **M01-M19** | **Node 24** (check with `node --version`), a code editor (VS Code) and a browser | [M01-L03](m01-getting-started/m01-l03-setting-up-your-tools/) walks through the setup. Each project installs its own packages with `npm install`, so nothing is installed globally |
| **M16, M17, M19** | Optional: Google Chrome, or `npx playwright install chromium` | Used by the browser tests and accessibility checks in those lessons |
| **M20-M21** | **Docker Desktop** | PostgreSQL and the deployment images run as pinned containers, so nothing else is installed on your laptop |
| **M22-M23** | Everything above | M23 builds the capstone and has the interview practice |

**On Windows**, install Node 24 from nodejs.org, or use WSL 2 with Docker Desktop's WSL integration. Commands are the same on macOS, Linux and Windows.

**Versions are pinned.** Packages and Docker images use the exact versions from the video (for example Vite 8.3.5, React 19.3.1, TypeScript 7.0.2 and Next.js 16.4.3 where those lessons use them), never `latest`. Numbers that depend on your machine (timings, sizes, ports already in use) will differ, and the READMEs say so.

---

## Safety first

- **Every password, key, token, secret and email in this repo is fake** and labelled as a demo value. Never put real secrets in your copy. Settings files are `.env.example` only; a real `.env` is ignored by git.
- Data lessons use a **local stand-in API** (a small Node program that plays the allcsvideos server). Nothing here calls a real service, creates a real account, sends real mail or takes a payment. The stand-in is never the production server.
- **Clean up after Docker lessons.** Each README ends with commands that remove only what that lesson created.

---

## Repo layout

Each module has a folder (`m04-state-and-events/`); each lesson has a folder named after its video (`m04-l02-usestate-giving-a-component-memory/`). In each module the lessons (L) come first, then the build (B) that puts them together. Every lesson folder is self-contained.

**Practice:** after Modules 2, 5, 10 and 23 there are practice sheets with worked answers. See [`practice/`](practice/README.md).

---

## Lesson index

**M01 · Getting Started** · folder [`m01-getting-started/`](m01-getting-started/)

| # | Lesson | Type | Folder |
|---|---|---|---|
| L01 | What React Is and Why It Exists | Lesson | [m01-l01-what-react-is-and-why-it-exists](m01-getting-started/m01-l01-what-react-is-and-why-it-exists/) |
| L02 | How a Web Page Works | Lesson | [m01-l02-how-a-web-page-works](m01-getting-started/m01-l02-how-a-web-page-works/) |
| L03 | Setting Up Your Tools | Lesson | [m01-l03-setting-up-your-tools](m01-getting-started/m01-l03-setting-up-your-tools/) |
| L04 | Tour of Your First React App | Lesson | [m01-l04-tour-of-your-first-react-app](m01-getting-started/m01-l04-tour-of-your-first-react-app/) |

**M02 · JavaScript You Need for React** · folder [`m02-javascript-you-need-for-react/`](m02-javascript-you-need-for-react/)

| # | Lesson | Type | Folder |
|---|---|---|---|
| L01 | let, const and Arrow Functions | Lesson | [m02-l01-let-const-and-arrow-functions](m02-javascript-you-need-for-react/m02-l01-let-const-and-arrow-functions/) |
| L02 | Objects, Arrays, Destructuring and Spread | Lesson | [m02-l02-objects-arrays-destructuring-and-spread](m02-javascript-you-need-for-react/m02-l02-objects-arrays-destructuring-and-spread/) |
| L03 | map, filter and Friends | Lesson | [m02-l03-map-filter-and-friends](m02-javascript-you-need-for-react/m02-l03-map-filter-and-friends/) |
| L04 | Modules: import and export | Lesson | [m02-l04-modules-import-and-export](m02-javascript-you-need-for-react/m02-l04-modules-import-and-export/) |
| L05 | Async JavaScript and fetch | Lesson | [m02-l05-async-javascript-and-fetch](m02-javascript-you-need-for-react/m02-l05-async-javascript-and-fetch/) |
| L06 | Short-hand Logic | Lesson | [m02-l06-short-hand-logic](m02-javascript-you-need-for-react/m02-l06-short-hand-logic/) |
| | Practice sheet | Practice | [practice/m02-javascript-you-need-for-react](practice/m02-javascript-you-need-for-react/README.md) |

**M03 · JSX and Components** · folder [`m03-jsx-and-components/`](m03-jsx-and-components/)

| # | Lesson | Type | Folder |
|---|---|---|---|
| L01 | Components as LEGO Bricks | Lesson | [m03-l01-components-as-lego-bricks](m03-jsx-and-components/m03-l01-components-as-lego-bricks/) |
| L02 | The Rules of JSX | Lesson | [m03-l02-the-rules-of-jsx](m03-jsx-and-components/m03-l02-the-rules-of-jsx/) |
| L03 | JavaScript Inside JSX | Lesson | [m03-l03-javascript-inside-jsx](m03-jsx-and-components/m03-l03-javascript-inside-jsx/) |
| L04 | Props | Lesson | [m03-l04-props](m03-jsx-and-components/m03-l04-props/) |
| L05 | Children and Composition | Lesson | [m03-l05-children-and-composition](m03-jsx-and-components/m03-l05-children-and-composition/) |
| B01 | A Course-Card Gallery | Build | [m03-b01-build-a-course-card-gallery](m03-jsx-and-components/m03-b01-build-a-course-card-gallery/) |

**M04 · State and Events** · folder [`m04-state-and-events/`](m04-state-and-events/)

| # | Lesson | Type | Folder |
|---|---|---|---|
| L01 | Handling Events | Lesson | [m04-l01-handling-events](m04-state-and-events/m04-l01-handling-events/) |
| L02 | useState: Giving a Component Memory | Lesson | [m04-l02-usestate-giving-a-component-memory](m04-state-and-events/m04-l02-usestate-giving-a-component-memory/) |
| L03 | How Rendering Works | Lesson | [m04-l03-how-rendering-works](m04-state-and-events/m04-l03-how-rendering-works/) |
| L04 | Updating Objects and Arrays in State | Lesson | [m04-l04-updating-objects-and-arrays-in-state](m04-state-and-events/m04-l04-updating-objects-and-arrays-in-state/) |
| L05 | Lifting State Up | Lesson | [m04-l05-lifting-state-up](m04-state-and-events/m04-l05-lifting-state-up/) |
| B02 | A Flashcard Quiz | Build | [m04-b02-build-a-flashcard-quiz](m04-state-and-events/m04-b02-build-a-flashcard-quiz/) |

**M05 · Lists, Conditions and Forms** · folder [`m05-lists-conditions-and-forms/`](m05-lists-conditions-and-forms/)

| # | Lesson | Type | Folder |
|---|---|---|---|
| L01 | Conditional Rendering | Lesson | [m05-l01-conditional-rendering](m05-lists-conditions-and-forms/m05-l01-conditional-rendering/) |
| L02 | Rendering Lists and Keys | Lesson | [m05-l02-rendering-lists-and-keys](m05-lists-conditions-and-forms/m05-l02-rendering-lists-and-keys/) |
| L03 | Controlled Inputs | Lesson | [m05-l03-controlled-inputs](m05-lists-conditions-and-forms/m05-l03-controlled-inputs/) |
| L04 | Forms and Validation | Lesson | [m05-l04-forms-and-validation](m05-lists-conditions-and-forms/m05-l04-forms-and-validation/) |
| L05 | Choosing the State Shape | Lesson | [m05-l05-choosing-the-state-shape](m05-lists-conditions-and-forms/m05-l05-choosing-the-state-shape/) |
| B03 | A Study Planner | Build | [m05-b03-build-a-study-planner](m05-lists-conditions-and-forms/m05-b03-build-a-study-planner/) |
| | Practice sheet | Practice | [practice/m05-lists-conditions-and-forms](practice/m05-lists-conditions-and-forms/README.md) |

**M06 · Styling React Apps** · folder [`m06-styling-react-apps/`](m06-styling-react-apps/)

| # | Lesson | Type | Folder |
|---|---|---|---|
| L01 | Plain CSS and CSS Modules | Lesson | [m06-l01-plain-css-and-css-modules](m06-styling-react-apps/m06-l01-plain-css-and-css-modules/) |
| L02 | Tailwind CSS | Lesson | [m06-l02-tailwind-css](m06-styling-react-apps/m06-l02-tailwind-css/) |
| L03 | Responsive Design and Dark Mode | Lesson | [m06-l03-responsive-design-and-dark-mode](m06-styling-react-apps/m06-l03-responsive-design-and-dark-mode/) |
| L04 | Component Libraries and Accessibility Basics | Lesson | [m06-l04-component-libraries-and-accessibility-basics](m06-styling-react-apps/m06-l04-component-libraries-and-accessibility-basics/) |

**M07 · Effects and Hooks** · folder [`m07-effects-and-hooks/`](m07-effects-and-hooks/)

| # | Lesson | Type | Folder |
|---|---|---|---|
| L01 | useEffect: Syncing with the Outside World | Lesson | [m07-l01-useeffect-syncing-with-the-outside-world](m07-effects-and-hooks/m07-l01-useeffect-syncing-with-the-outside-world/) |
| L02 | Dependencies, Cleanup and Strict Mode | Lesson | [m07-l02-dependencies-cleanup-and-strict-mode](m07-effects-and-hooks/m07-l02-dependencies-cleanup-and-strict-mode/) |
| L03 | You Might Not Need an Effect | Lesson | [m07-l03-you-might-not-need-an-effect](m07-effects-and-hooks/m07-l03-you-might-not-need-an-effect/) |
| L04 | useRef | Lesson | [m07-l04-useref](m07-effects-and-hooks/m07-l04-useref/) |
| L05 | Fetching Data in an Effect | Lesson | [m07-l05-fetching-data-in-an-effect](m07-effects-and-hooks/m07-l05-fetching-data-in-an-effect/) |
| L06 | Custom Hooks | Lesson | [m07-l06-custom-hooks](m07-effects-and-hooks/m07-l06-custom-hooks/) |
| B04 | A Live Course Search | Build | [m07-b04-build-a-live-course-search](m07-effects-and-hooks/m07-b04-build-a-live-course-search/) |

**M08 · Routing** · folder [`m08-routing/`](m08-routing/)

| # | Lesson | Type | Folder |
|---|---|---|---|
| L01 | Single-Page Apps and React Router | Lesson | [m08-l01-single-page-apps-and-react-router](m08-routing/m08-l01-single-page-apps-and-react-router/) |
| L02 | Routes, Links and URL Parameters | Lesson | [m08-l02-routes-links-and-url-parameters](m08-routing/m08-l02-routes-links-and-url-parameters/) |
| L03 | Nested Routes and Layouts | Lesson | [m08-l03-nested-routes-and-layouts](m08-routing/m08-l03-nested-routes-and-layouts/) |
| L04 | Loaders, Actions and Protected Routes | Lesson | [m08-l04-loaders-actions-and-protected-routes](m08-routing/m08-l04-loaders-actions-and-protected-routes/) |
| B05 | The allcsvideos Frontend v1 | Build | [m08-b05-build-the-allcsvideos-frontend-v1](m08-routing/m08-b05-build-the-allcsvideos-frontend-v1/) |

**M09 · TypeScript with React** · folder [`m09-typescript-for-react/`](m09-typescript-for-react/)

| # | Lesson | Type | Folder |
|---|---|---|---|
| L01 | TypeScript in One Video | Lesson | [m09-l01-typescript-in-one-video](m09-typescript-for-react/m09-l01-typescript-in-one-video/) |
| L02 | Typing Props, State and Events | Lesson | [m09-l02-typing-props-state-and-events](m09-typescript-for-react/m09-l02-typing-props-state-and-events/) |
| L03 | Generic Components and UI States | Lesson | [m09-l03-generic-components-and-ui-states](m09-typescript-for-react/m09-l03-generic-components-and-ui-states/) |
| L04 | Typing API Data with Zod | Lesson | [m09-l04-typing-api-data-with-zod](m09-typescript-for-react/m09-l04-typing-api-data-with-zod/) |

**M10 · Sharing State Across the App** · folder [`m10-state-management/`](m10-state-management/)

| # | Lesson | Type | Folder |
|---|---|---|---|
| L01 | Prop Drilling | Lesson | [m10-l01-prop-drilling](m10-state-management/m10-l01-prop-drilling/) |
| L02 | Context | Lesson | [m10-l02-context](m10-state-management/m10-l02-context/) |
| L03 | useReducer | Lesson | [m10-l03-usereducer](m10-state-management/m10-l03-usereducer/) |
| L04 | Context and Reducer Together | Lesson | [m10-l04-context-and-reducer-together](m10-state-management/m10-l04-context-and-reducer-together/) |
| L05 | Zustand and Choosing Where State Lives | Lesson | [m10-l05-zustand-and-choosing-where-state-lives](m10-state-management/m10-l05-zustand-and-choosing-where-state-lives/) |
| B06 | An Enrollment Cart | Build | [m10-b06-build-an-enrollment-cart](m10-state-management/m10-b06-build-an-enrollment-cart/) |
| | Practice sheet | Practice | [practice/m10-state-management](practice/m10-state-management/README.md) |

**M11 · Server State with TanStack Query** · folder [`m11-server-state-with-tanstack-query/`](m11-server-state-with-tanstack-query/)

| # | Lesson | Type | Folder |
|---|---|---|---|
| L01 | Why Server State Is Different | Lesson | [m11-l01-why-server-state-is-different](m11-server-state-with-tanstack-query/m11-l01-why-server-state-is-different/) |
| L02 | Queries with useQuery | Lesson | [m11-l02-queries-with-usequery](m11-server-state-with-tanstack-query/m11-l02-queries-with-usequery/) |
| L03 | Mutations and Optimistic Updates | Lesson | [m11-l03-mutations-and-optimistic-updates](m11-server-state-with-tanstack-query/m11-l03-mutations-and-optimistic-updates/) |
| L04 | Pagination, Infinite Scroll and Prefetching | Lesson | [m11-l04-pagination-infinite-scroll-and-prefetching](m11-server-state-with-tanstack-query/m11-l04-pagination-infinite-scroll-and-prefetching/) |
| B07 | A Student Dashboard | Build | [m11-b07-build-a-student-dashboard](m11-server-state-with-tanstack-query/m11-b07-build-a-student-dashboard/) |

**M12 · Forms at Scale** · folder [`m12-forms-at-scale/`](m12-forms-at-scale/)

| # | Lesson | Type | Folder |
|---|---|---|---|
| L01 | React Hook Form | Lesson | [m12-l01-react-hook-form](m12-forms-at-scale/m12-l01-react-hook-form/) |
| L02 | Validation with Zod | Lesson | [m12-l02-validation-with-zod](m12-forms-at-scale/m12-l02-validation-with-zod/) |
| L03 | Dynamic Fields, Wizards and File Upload | Lesson | [m12-l03-dynamic-fields-wizards-and-file-upload](m12-forms-at-scale/m12-l03-dynamic-fields-wizards-and-file-upload/) |
| B08 | An Instructor Course Editor | Build | [m12-b08-build-an-instructor-course-editor](m12-forms-at-scale/m12-b08-build-an-instructor-course-editor/) |

**M13 · Authentication and Security** · folder [`m13-authentication-and-security/`](m13-authentication-and-security/)

| # | Lesson | Type | Folder |
|---|---|---|---|
| L01 | Login Flows: Sessions vs JWT | Lesson | [m13-l01-login-flows-sessions-vs-jwt](m13-authentication-and-security/m13-l01-login-flows-sessions-vs-jwt/) |
| L02 | Protected Routes and Roles | Lesson | [m13-l02-protected-routes-and-roles](m13-authentication-and-security/m13-l02-protected-routes-and-roles/) |
| L03 | Frontend Security | Lesson | [m13-l03-frontend-security](m13-authentication-and-security/m13-l03-frontend-security/) |
| B09 | A Secure allcsvideos Frontend | Build | [m13-b09-build-a-secure-allcsvideos-frontend](m13-authentication-and-security/m13-b09-build-a-secure-allcsvideos-frontend/) |

**M14 · React Under the Hood** · folder [`m14-react-under-the-hood/`](m14-react-under-the-hood/)

| # | Lesson | Type | Folder |
|---|---|---|---|
| L01 | The Virtual DOM and Reconciliation | Lesson | [m14-l01-the-virtual-dom-and-reconciliation](m14-react-under-the-hood/m14-l01-the-virtual-dom-and-reconciliation/) |
| L02 | Identity, Keys and State Preservation | Lesson | [m14-l02-identity-keys-and-state-preservation](m14-react-under-the-hood/m14-l02-identity-keys-and-state-preservation/) |
| L03 | Why a Component Re-renders | Lesson | [m14-l03-why-a-component-re-renders](m14-react-under-the-hood/m14-l03-why-a-component-re-renders/) |
| L04 | What's New in React 19 | Lesson | [m14-l04-whats-new-in-react-19](m14-react-under-the-hood/m14-l04-whats-new-in-react-19/) |
| L05 | Suspense and Error Boundaries | Lesson | [m14-l05-suspense-and-error-boundaries](m14-react-under-the-hood/m14-l05-suspense-and-error-boundaries/) |

**M15 · Performance** · folder [`m15-performance/`](m15-performance/)

| # | Lesson | Type | Folder |
|---|---|---|---|
| L01 | Measuring Performance | Lesson | [m15-l01-measuring-performance](m15-performance/m15-l01-measuring-performance/) |
| L02 | memo, useMemo, useCallback and the React Compiler | Lesson | [m15-l02-memo-usememo-usecallback-and-the-react-compiler](m15-performance/m15-l02-memo-usememo-usecallback-and-the-react-compiler/) |
| L03 | Code Splitting | Lesson | [m15-l03-code-splitting](m15-performance/m15-l03-code-splitting/) |
| L04 | Long Lists and Transitions | Lesson | [m15-l04-long-lists-and-transitions](m15-performance/m15-l04-long-lists-and-transitions/) |
| B10 | Make a Slow Catalog Fast | Build | [m15-b10-build-make-a-slow-catalog-fast](m15-performance/m15-b10-build-make-a-slow-catalog-fast/) |

**M16 · Patterns and Reusable Components** · folder [`m16-patterns-and-reusable-components/`](m16-patterns-and-reusable-components/)

| # | Lesson | Type | Folder |
|---|---|---|---|
| L01 | Composition Patterns | Lesson | [m16-l01-composition-patterns](m16-patterns-and-reusable-components/m16-l01-composition-patterns/) |
| L02 | Portals, Modals and Special Hooks | Lesson | [m16-l02-portals-modals-and-special-hooks](m16-patterns-and-reusable-components/m16-l02-portals-modals-and-special-hooks/) |
| L03 | Accessibility in Depth | Lesson | [m16-l03-accessibility-in-depth](m16-patterns-and-reusable-components/m16-l03-accessibility-in-depth/) |
| L04 | Designing a Component API | Lesson | [m16-l04-designing-a-component-api](m16-patterns-and-reusable-components/m16-l04-designing-a-component-api/) |
| B11 | A Component Library | Build | [m16-b11-build-a-component-library](m16-patterns-and-reusable-components/m16-b11-build-a-component-library/) |

**M17 · Testing** · folder [`m17-testing/`](m17-testing/)

| # | Lesson | Type | Folder |
|---|---|---|---|
| L01 | Your First Test | Lesson | [m17-l01-your-first-test](m17-testing/m17-l01-your-first-test/) |
| L02 | Testing Like a User | Lesson | [m17-l02-testing-like-a-user](m17-testing/m17-l02-testing-like-a-user/) |
| L03 | Mocking the API with MSW | Lesson | [m17-l03-mocking-the-api-with-msw](m17-testing/m17-l03-mocking-the-api-with-msw/) |
| L04 | End-to-End Tests with Playwright | Lesson | [m17-l04-end-to-end-tests-with-playwright](m17-testing/m17-l04-end-to-end-tests-with-playwright/) |
| B12 | A Test Suite in CI | Build | [m17-b12-build-a-test-suite-in-ci](m17-testing/m17-b12-build-a-test-suite-in-ci/) |

**M18 · Tooling, Structure and Debugging** · folder [`m18-tooling-structure-and-debugging/`](m18-tooling-structure-and-debugging/)

| # | Lesson | Type | Folder |
|---|---|---|---|
| L01 | Linting, Formatting and Strict Mode | Lesson | [m18-l01-linting-formatting-and-strict-mode](m18-tooling-structure-and-debugging/m18-l01-linting-formatting-and-strict-mode/) |
| L02 | Project Structure That Scales | Lesson | [m18-l02-project-structure-that-scales](m18-tooling-structure-and-debugging/m18-l02-project-structure-that-scales/) |
| L03 | Debugging React Apps | Lesson | [m18-l03-debugging-react-apps](m18-tooling-structure-and-debugging/m18-l03-debugging-react-apps/) |

**M19 · Next.js** · folder [`m19-nextjs/`](m19-nextjs/)

| # | Lesson | Type | Folder |
|---|---|---|---|
| L01 | Why a Framework | Lesson | [m19-l01-why-a-framework](m19-nextjs/m19-l01-why-a-framework/) |
| L02 | The App Router | Lesson | [m19-l02-the-app-router](m19-nextjs/m19-l02-the-app-router/) |
| L03 | Server and Client Components | Lesson | [m19-l03-server-and-client-components](m19-nextjs/m19-l03-server-and-client-components/) |
| L04 | Data Fetching, Caching and Streaming | Lesson | [m19-l04-data-fetching-caching-and-streaming](m19-nextjs/m19-l04-data-fetching-caching-and-streaming/) |
| L05 | Server Actions | Lesson | [m19-l05-server-actions](m19-nextjs/m19-l05-server-actions/) |
| L06 | Route Handlers, Middleware and SEO | Lesson | [m19-l06-route-handlers-middleware-and-seo](m19-nextjs/m19-l06-route-handlers-middleware-and-seo/) |
| B13 | allcsvideos on Next.js | Build | [m19-b13-build-allcsvideos-on-nextjs](m19-nextjs/m19-b13-build-allcsvideos-on-nextjs/) |

**M20 · Full-Stack with Next.js** · folder [`m20-full-stack-with-nextjs/`](m20-full-stack-with-nextjs/)

| # | Lesson | Type | Folder |
|---|---|---|---|
| L01 | A Database from Next.js | Lesson | [m20-l01-a-database-from-nextjs](m20-full-stack-with-nextjs/m20-l01-a-database-from-nextjs/) |
| L02 | Authentication with Auth.js | Lesson | [m20-l02-authentication-with-authjs](m20-full-stack-with-nextjs/m20-l02-authentication-with-authjs/) |
| L03 | Webhooks, Uploads and Emails | Lesson | [m20-l03-webhooks-uploads-and-emails](m20-full-stack-with-nextjs/m20-l03-webhooks-uploads-and-emails/) |
| B14 | A Full-Stack Course Platform | Build | [m20-b14-build-a-full-stack-course-platform](m20-full-stack-with-nextjs/m20-b14-build-a-full-stack-course-platform/) |

**M21 · Deployment and Monitoring** · folder [`m21-deployment-and-monitoring/`](m21-deployment-and-monitoring/)

| # | Lesson | Type | Folder |
|---|---|---|---|
| L01 | Building for Production | Lesson | [m21-l01-building-for-production](m21-deployment-and-monitoring/m21-l01-building-for-production/) |
| L02 | Deploying React and Next.js | Lesson | [m21-l02-deploying-react-and-nextjs](m21-deployment-and-monitoring/m21-l02-deploying-react-and-nextjs/) |
| L03 | CI-CD and Monitoring | Lesson | [m21-l03-ci-cd-and-monitoring](m21-deployment-and-monitoring/m21-l03-ci-cd-and-monitoring/) |
| B15 | A Deploy Pipeline | Build | [m21-b15-build-a-deploy-pipeline](m21-deployment-and-monitoring/m21-b15-build-a-deploy-pipeline/) |

**M22 · Real-Time and Beyond** · folder [`m22-real-time-and-beyond/`](m22-real-time-and-beyond/)

| # | Lesson | Type | Folder |
|---|---|---|---|
| L01 | Real-Time UI | Lesson | [m22-l01-real-time-ui](m22-real-time-and-beyond/m22-l01-real-time-ui/) |
| L02 | Animations and Offline Apps | Lesson | [m22-l02-animations-and-offline-apps](m22-real-time-and-beyond/m22-l02-animations-and-offline-apps/) |
| L03 | Translations and a React Native Taster | Lesson | [m22-l03-translations-and-a-react-native-taster](m22-real-time-and-beyond/m22-l03-translations-and-a-react-native-taster/) |
| B16 | A Live Classroom Widget | Build | [m22-b16-build-a-live-classroom-widget](m22-real-time-and-beyond/m22-b16-build-a-live-classroom-widget/) |

**M23 · Interviews and Capstone** · folder [`m23-interviews-and-capstone/`](m23-interviews-and-capstone/)

| # | Lesson | Type | Folder |
|---|---|---|---|
| L01 | The 50 Most-Asked React Questions | Lesson | [m23-l01-the-50-most-asked-react-questions](m23-interviews-and-capstone/m23-l01-the-50-most-asked-react-questions/) |
| L02 | The Machine-Coding Round | Lesson | [m23-l02-the-machine-coding-round](m23-interviews-and-capstone/m23-l02-the-machine-coding-round/) |
| L03 | Frontend System Design | Lesson | [m23-l03-frontend-system-design](m23-interviews-and-capstone/m23-l03-frontend-system-design/) |
| L04 | Mock Interview and Roadmap | Lesson | [m23-l04-mock-interview-and-roadmap](m23-interviews-and-capstone/m23-l04-mock-interview-and-roadmap/) |
| B17 | Capstone: The allcsvideos Learner App | Build | [m23-b17-capstone-the-allcsvideos-learner-app](m23-interviews-and-capstone/m23-b17-capstone-the-allcsvideos-learner-app/) |
| | Practice sheet | Practice | [practice/m23-interviews-and-capstone](practice/m23-interviews-and-capstone/README.md) |
