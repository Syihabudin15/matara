import prisma from "@/components/Prisma";
import { NextRequest, NextResponse } from "next/server";

export const GET = async (req: NextRequest) => {
  const page: number = parseInt(req.nextUrl.searchParams.get("page") || "1");
  const pageSize: number = parseInt(
    req.nextUrl.searchParams.get("pageSize") || "50"
  );
  const search: string | undefined = <any>(
    req.nextUrl.searchParams.get("search")
  );
  const skip = (page - 1) * pageSize;

  try {
    const find = await prisma.flagging.findMany({
      where: search ? {} : {},
      skip: skip,
      take: pageSize,
    });
    return NextResponse.json(
      { data: find, status: 200, msg: "Berhasil" },
      { status: 200 }
    );
  } catch (err) {
    console.log(err);
    return NextResponse.json(
      { data: null, status: 500, msg: "Internal Server Error" },
      { status: 500 }
    );
  }
};
