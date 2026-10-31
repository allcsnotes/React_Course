import { db } from "../db";
import { courses } from "../db/schema";

const rows = await db.select({ name: courses.titel }).from(courses);
console.log(rows);
