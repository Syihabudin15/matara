import prisma from "@/components/Prisma";
import { Sumdan } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

export const POST = async (req: NextRequest) => {
  const data: Sumdan = await req.json();
  if (
    !data.name ||
    !data.code ||
    data.rounded === undefined ||
    data.maxInstallment === undefined ||
    !data.sumdanType
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
    const findUnique = await prisma.sumdan.findFirst({
      where: { code: data.code },
    });
    if (findUnique) {
      return NextResponse.json(
        {
          msg: "Kode Sumber dana sudah digunakan",
          status: 400,
          data: null,
        },
        { status: 400 }
      );
    }
    const save = await prisma.sumdan.create({
      data: {
        name: data.name,
        code: data.code,
        rounded: data.rounded,
        maxInstallment: data.maxInstallment,
        sumdanType: data.sumdanType,
        logo: data.logo || "",
        skAkad: data.skAkad,
      },
    });
    return NextResponse.json(
      { msg: "Sumber dana berhasil ditambahkan", status: 201, data: save },
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
    const find = await prisma.sumdan.findMany({
      where: search
        ? {
            OR: [
              { name: { contains: search } },
              { code: { contains: search } },
            ],
          }
        : {},
      skip: skip,
      take: pageSize,
    });
    const total = await prisma.sumdan.count({
      where: search
        ? {
            OR: [
              { name: { contains: search } },
              { code: { contains: search } },
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
  const data: Sumdan = await req.json();
  try {
    const find = await prisma.sumdan.findFirst({ where: { id: data.id } });
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
    const save = await prisma.sumdan.update({
      where: { id: data.id },
      data: {
        name: data.name ? data.name : find.name,
        code: data.code ? data.code : find.code,
        logo: data.logo ? data.logo : find.logo,
        rounded: data.rounded !== undefined ? data.rounded : find.rounded,
        sumdanType:
          data.sumdanType !== undefined ? data.sumdanType : find.sumdanType,
        maxInstallment:
          data.maxInstallment !== undefined
            ? data.maxInstallment
            : find.maxInstallment,
        skAkad: data.skAkad ? data.skAkad : find.skAkad,
        updatedAt: new Date(),
      },
    });
    return NextResponse.json(
      {
        msg: "Sumber dana berhasil diperbarui",
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
