import prisma from "@/components/Prisma";
import { Jenis } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

export const POST = async (req: NextRequest) => {
  const data: Jenis = await req.json();
  if (
    !data.name ||
    data.costMutasi === undefined ||
    data.blokir === undefined
  ) {
    return NextResponse.json(
      {
        msg: "Mohon lengkapi data terlebih dahulu!",
        status: 400,
        data: null,
      },
      { status: 400 }
    );
  }
  try {
    const findUnique = await prisma.jenis.findFirst({
      where: {
        AND: [{ name: data.name }, { status: true }],
      },
    });
    if (findUnique) {
      return NextResponse.json(
        {
          msg: "Data sudah digunakan",
          status: 400,
          data: null,
        },
        { status: 400 }
      );
    }
    const save = await prisma.jenis.create({
      data: {
        name: data.name,
        costMutasi: data.costMutasi,
        blokir: data.blokir,
      },
    });
    return NextResponse.json(
      { msg: "Jenis pembiayaan berhasil ditambahkan", status: 201, data: save },
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
    const find = await prisma.jenis.findMany({
      where: search ? { name: { contains: search } } : {},
      skip: skip,
      take: pageSize,
    });
    const total = await prisma.jenis.count({
      where: search ? { name: { contains: search } } : {},
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
  const data: Jenis = await req.json();
  try {
    const find = await prisma.jenis.findFirst({ where: { id: data.id } });
    if (!find) {
      return NextResponse.json(
        {
          msg: "Data tidak ditemukan!",
          status: 404,
          data: null,
        },
        { status: 404 }
      );
    }
    const save = await prisma.jenis.update({
      where: { id: data.id },
      data: {
        name: data.name ? data.name : find.name,
        costMutasi:
          data.costMutasi !== undefined ? data.costMutasi : find.costMutasi,
        blokir: data.blokir !== undefined ? data.blokir : find.blokir,
        updatedAt: new Date(),
      },
    });
    return NextResponse.json(
      {
        msg: "Jenis pembiayaan berhasil diperbarui",
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
