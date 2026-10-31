import { readFile, writeFile } from "node:fs/promises";

export async function addReview(name: string, body: string) {
  const list = JSON.parse(await readFile("reviews.json", "utf8"));
  list.push({ name, body });
  await writeFile("reviews.json", JSON.stringify(list));
}
