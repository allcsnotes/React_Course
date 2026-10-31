import { db } from "../db";
import { courses } from "../db/schema";

const rows = await db.select().from(courses);
console.log(rows.length, "rows. The first one:");
console.log(rows[0]);
await db.$client.end();
