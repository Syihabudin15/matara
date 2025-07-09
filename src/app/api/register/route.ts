// === app/api/register-face/route.js ===
import { writeFile, mkdir, readFile } from "fs/promises";
import { NextRequest } from "next/server";
import path from "path";

export async function POST(req: NextRequest) {
  const { name, descriptor } = await req.json();
  const dir = path.resolve("./data");
  const filePath = path.join(dir, "faces.json");

  try {
    await mkdir(dir, { recursive: true });
    let faces = [];
    try {
      const data = await readFile(filePath, "utf-8");
      faces = JSON.parse(data);
    } catch (e) {}

    faces.push({ name, descriptor });
    await writeFile(filePath, JSON.stringify(faces, null, 2));
    return Response.json({ success: true });
  } catch (err) {
    return new Response("Server error", { status: 500 });
  }
}
