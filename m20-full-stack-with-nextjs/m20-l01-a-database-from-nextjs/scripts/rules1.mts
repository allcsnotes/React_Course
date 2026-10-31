import { db } from "../db";
import { reviews } from "../db/schema";

async function tryIt(label: string, save: () => Promise<unknown>) {
  try {
    await save();
    console.log(label, "saved");
  } catch (e: any) {
    console.log(label, e.cause.code, e.cause.message);
  }
}

await tryIt("course 999:", () =>
  db.insert(reviews).values({ courseId: 999, name: "Lukas", body: "Great" }),
);

await tryIt("no name:", () =>
  // @ts-expect-error a script can skip the types
  db.insert(reviews).values({ courseId: 2, name: null, body: "Great" }),
);

await db.$client.end();
