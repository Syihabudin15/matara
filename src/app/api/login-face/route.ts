// === app/api/login-face/route.js ===
import fs from "fs/promises";
import { NextRequest } from "next/server";
import path from "path";

function euclideanDistance(d1: any, d2: any) {
  return Math.sqrt(
    d1.reduce((acc: any, val: any, i: any) => acc + (val - d2[i]) ** 2, 0)
  );
}

export async function POST(req: NextRequest) {
  const { descriptor } = await req.json();
  const filePath = path.resolve("./data/faces.json");

  try {
    const data = await fs.readFile("data/faces.json", "utf-8");
    const faces = JSON.parse(data);

    for (const face of faces) {
      const dist = euclideanDistance(descriptor, face.descriptor);
      if (dist < 0.6) {
        return Response.json({ success: true, name: face.name });
      }
    }
    return Response.json({ success: false });
  } catch (err) {
    return new Response("Server error", { status: 500 });
  }
}

// === app/page.tsx atau page.js ===
// Tidak berubah dari versi sebelumnya, cukup ubah URL fetch ke '/api/register-face' dan '/api/login-face'

// === public/models/ ===
// Tetap sama, isi dengan model dari face-api.js
