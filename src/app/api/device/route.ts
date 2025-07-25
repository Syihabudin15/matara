import prisma from "@/components/Prisma";
import { Devices } from "@prisma/client";
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
    const find = await prisma.devices.findMany({
      where: search
        ? {
            OR: [
              { deviceId: { contains: search } },
              { deviceName: { contains: search } },
              { deviceType: { contains: search } },
              { sistem: { contains: search } },
            ],
          }
        : {},
      skip: skip,
      take: pageSize,
    });
    const total = await prisma.devices.count({
      where: search
        ? {
            OR: [
              { deviceId: { contains: search } },
              { deviceName: { contains: search } },
              { deviceType: { contains: search } },
              { sistem: { contains: search } },
            ],
          }
        : {},
    });
    return NextResponse.json(
      {
        msg: "OK",
        status: 200,
        data: find,
        total,
      },
      { status: 200 }
    );
  } catch (err) {
    console.log(err);
    return NextResponse.json(
      {
        msg: "Error",
        status: 500,
        data: null,
      },
      { status: 500 }
    );
  }
};

export const PUT = async (req: NextRequest) => {
  const data: Devices = await req.json();
  try {
    const find = await prisma.devices.findFirst({ where: { id: data.id } });
    if (!find) {
      return NextResponse.json(
        {
          msg: "Device tidak ditemukan!",
          status: 404,
          data: null,
        },
        { status: 404 }
      );
    }
    const save = await prisma.devices.update({
      where: { id: data.id },
      data: {
        deviceName: data.deviceName ? data.deviceName : find.deviceName,
        deviceType: data.deviceType ? data.deviceType : find.deviceType,
        sistem: data.sistem ? data.sistem : find.sistem,
        status: data.status ? data.status : find.status,
        updatedAt: new Date(),
      },
    });
    return NextResponse.json(
      {
        msg: "Device berhasil diperbarui",
        status: 200,
        data: save,
      },
      { status: 200 }
    );
  } catch (err) {
    console.log(err);
    return NextResponse.json(
      {
        msg: "Error",
        status: 500,
        data: null,
      },
      { status: 500 }
    );
  }
};
