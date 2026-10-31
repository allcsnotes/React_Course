import ApiAddress from "./ApiAddress";

export default function Page() {
  const secret = process.env.SESSION_SECRET ?? "";
  return (
    <main>
      <h1>Courses</h1>
      <p>The server keeps a session secret of {secret.length} characters.</p>
      <ApiAddress />
    </main>
  );
}
