import prisma from "@/components/Prisma";
import { NextRequest, NextResponse } from "next/server";

export const GET = async (req: NextRequest) => {
  const nopen: string | undefined = <any>req.nextUrl.searchParams.get("nopen");
  if (!nopen) {
    return NextResponse.json(
      {
        data: null,
        status: 400,
        msg: "Invalid NOPEN",
      },
      { status: 400 }
    );
  }
  try {
    const find = await prisma.flagging.findFirst({
      where: { notas: nopen },
    });
    if (!find) {
      return NextResponse.json(
        {
          data: null,
          status: 404,
          msg: "NOPEN Tidak ditemukan",
        },
        { status: 404 }
      );
    }
    return NextResponse.json(
      {
        data: find,
        status: 200,
        msg: "Ditemukan",
      },
      { status: 200 }
    );
  } catch (err) {
    console.log(err);
    return NextResponse.json(
      {
        data: null,
        status: 500,
        msg: "Internal Server Error",
      },
      { status: 500 }
    );
  }
};
