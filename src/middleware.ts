import { refreshToken } from "@/components/utils/AuthUtils";
import type { NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
  return await refreshToken(request);
}

export const config = {
  matcher: ["/dashboard"],
};
