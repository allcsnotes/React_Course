import { Suspense } from "react";
import { connection } from "next/server";
import ApiAddress from "./ApiAddress";

async function Secret() {
  await connection();
  const secret = process.env.SESSION_SECRET ?? "";
  return <p>The server keeps a session secret of {secret.length} characters.</p>;
}

export default function Page() {
  return (
    <main>
      <h1>Courses</h1>
      <Suspense fallback={<p>Loading…</p>}>
        <Secret />
      </Suspense>
      <ApiAddress />
    </main>
  );
}
