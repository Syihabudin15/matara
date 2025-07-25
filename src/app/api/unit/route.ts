import prisma from "@/components/Prisma";
import { Unit } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

export const POST = async (req: NextRequest) => {
  const data: Unit = await req.json();
  if (!data.name || !data.code) {
    return NextResponse.json(
      {
        msg: "Mohon lengkapi data Unit terlebih dahulu!",
        status: 400,
        data: null,
      },
      { status: 400 }
    );
  }
  try {
    const findUnique = await prisma.unit.findFirst({
      where: { code: data.code },
    });
    if (findUnique) {
      return NextResponse.json(
        {
          msg: "Kode Unit sudah digunakan",
          status: 400,
          data: null,
        },
        { status: 400 }
      );
    }
    const save = await prisma.unit.create({
      data: {
        name: data.name,
        code: data.code,
        address: data.address,
        email: data.email,
        phone: data.phone,
        areaId: data.areaId,
      },
    });
    return NextResponse.json(
      { msg: "Unit berhasil ditambahkan", status: 201, data: save },
      { status: 201 }
    );
  } catch (err) {
    console.log(err);
    return NextResponse.json(
      {
        msg: "Internal Server Error",
        status: 500,
        data: null,
      },
      { status: 500 }
    );
  }
};

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
    const find = await prisma.unit.findMany({
      where: search
        ? {
            OR: [
              { name: { contains: search } },
              { code: { contains: search } },
              { email: { contains: search } },
              { address: { contains: search } },
              { phone: { contains: search } },
              {
                Area: {
                  name: { contains: search },
                },
              },
            ],
          }
        : {},
      include: {
        Area: true,
      },
      skip: skip,
      take: pageSize,
    });
    const total = await prisma.unit.count({
      where: search
        ? {
            OR: [
              { name: { contains: search } },
              { code: { contains: search } },
              { email: { contains: search } },
              { address: { contains: search } },
              { phone: { contains: search } },
              {
                Area: {
                  name: { contains: search },
                },
              },
            ],
          }
        : {},
    });
    return NextResponse.json(
      {
        msg: "OK",
        status: 200,
        data: find,
        total: total,
      },
      { status: 200 }
    );
  } catch (err) {
    console.log(err);
    return NextResponse.json(
      { msg: "Internal Server Error", status: 500, data: null },
      { status: 500 }
    );
  }
};

export const PUT = async (req: NextRequest) => {
  const data: Unit = await req.json();
  try {
    const find = await prisma.unit.findFirst({ where: { id: data.id } });
    if (!find) {
      return NextResponse.json(
        {
          msg: "Unit tidak ditemukan!",
          status: 404,
          data: null,
        },
        { status: 404 }
      );
    }
    const save = await prisma.unit.update({
      where: { id: data.id },
      data: {
        name: data.name ? data.name : find.name,
        code: data.code ? data.code : find.code,
        address: data.address ? data.address : find.address,
        email: data.email ? data.email : find.email,
        phone: data.phone ? data.phone : find.phone,
        areaId: data.areaId ? data.areaId : find.areaId,
        updatedAt: new Date(),
      },
    });
    return NextResponse.json(
      {
        msg: "Unit berhasil diperbarui",
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
