import prisma from "@/components/Prisma";
import { NextRequest, NextResponse } from "next/server";

export const POST = async (req: NextRequest) => {
  const { id, coord, location } = await req.json();
  try {
    const find = await prisma.users.findFirst({ where: { id: id } });
    if (!find) {
      return NextResponse.json(
        { data: null, status: 404, msg: "User tidak ditemukan" },
        { status: 400 }
      );
    }
    const splitLoc = find.location ? find.location.split(";") : [];
    if (splitLoc.length !== 0) {
      await prisma.users.update({
        where: { id: id },
        data: {
          coord: coord,
          location:
            location !== splitLoc[splitLoc.length - 1]
              ? `${find.location};${location}`
              : find.location,
        },
      });
    } else {
      await prisma.users.update({
        where: { id: id },
        data: {
          coord: coord,
          location: `${location}`,
        },
      });
    }
    return NextResponse.json(
      { data: location, status: 200, msg: "Berhasil" },
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
