import prisma from "@/components/Prisma";
import { Produk } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

export const POST = async (req: NextRequest) => {
  const data: Produk = await req.json();
  if (
    !data.name ||
    data.minAge === undefined ||
    data.maxAge === undefined ||
    data.maxPaidAge === undefined ||
    data.maxPlafon === undefined ||
    data.maxTenor === undefined ||
    data.constInsurance === undefined ||
    data.costAdmKoperasi === undefined ||
    data.costAdmSumdan === undefined ||
    data.costAccount === undefined ||
    data.costStamp === undefined ||
    data.costGovernance === undefined ||
    data.costProvision === undefined ||
    !data.sumdanId ||
    data.marginKoperasi === undefined ||
    data.marginSumdan === undefined ||
    !data.jenisMargin
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
    const findUnique = await prisma.produk.findFirst({
      where: {
        AND: [
          { name: data.name },
          { sumdanId: data.sumdanId },
          { status: true },
        ],
      },
    });
    if (findUnique) {
      return NextResponse.json(
        {
          msg: "Produk sudah tersedia pada Sumberdana ini",
          status: 400,
          data: null,
        },
        { status: 400 }
      );
    }
    const save = await prisma.produk.create({
      data: {
        name: data.name,
        minAge: data.minAge,
        maxAge: data.maxAge,
        maxPaidAge: data.maxPaidAge,
        maxPlafon: data.maxPlafon,
        maxTenor: data.maxTenor,
        marginSumdan: data.marginSumdan,
        marginKoperasi: data.marginKoperasi,
        constInsurance: data.constInsurance,
        costAdmSumdan: data.costAdmSumdan,
        costAdmKoperasi: data.costAdmKoperasi,
        costGovernance: data.costGovernance,
        costStamp: data.costStamp,
        costAccount: data.costAccount,
        costProvision: data.costProvision,
        jenisMargin: data.jenisMargin,
        sumdanId: data.sumdanId,
      },
    });
    return NextResponse.json(
      { msg: "Produk berhasil ditambahkan", status: 201, data: save },
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
    const find = await prisma.produk.findMany({
      where: search ? { name: { contains: search } } : {},
      include: {
        Sumdan: true,
      },
      skip: skip,
      take: pageSize,
    });
    const total = await prisma.produk.count({
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
  const data: Produk = await req.json();
  try {
    const find = await prisma.produk.findFirst({ where: { id: data.id } });
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
    const save = await prisma.produk.update({
      where: { id: data.id },
      data: {
        name: data.name ? data.name : find.name,
        minAge: data.minAge !== undefined ? data.minAge : find.minAge,
        maxAge: data.maxAge !== undefined ? data.maxAge : find.maxAge,
        maxPaidAge:
          data.maxPaidAge !== undefined ? data.maxPaidAge : find.maxPaidAge,
        maxPlafon:
          data.maxPlafon !== undefined ? data.maxPlafon : find.maxPlafon,
        maxTenor: data.maxTenor !== undefined ? data.maxTenor : find.maxTenor,
        marginSumdan:
          data.marginSumdan !== undefined
            ? data.marginSumdan
            : find.marginSumdan,
        marginKoperasi:
          data.marginKoperasi !== undefined
            ? data.marginKoperasi
            : find.marginKoperasi,
        constInsurance:
          data.constInsurance !== undefined
            ? data.constInsurance
            : find.constInsurance,
        costAdmSumdan:
          data.costAdmSumdan !== undefined
            ? data.costAdmSumdan
            : find.costAdmSumdan,
        costAdmKoperasi:
          data.costAdmKoperasi !== undefined
            ? data.costAdmKoperasi
            : find.costAdmKoperasi,
        costGovernance:
          data.costGovernance !== undefined
            ? data.costGovernance
            : find.costGovernance,
        costAccount:
          data.costAccount !== undefined ? data.costAccount : find.costAccount,
        costStamp:
          data.costStamp !== undefined ? data.costStamp : find.costStamp,
        costProvision:
          data.costProvision !== undefined
            ? data.costProvision
            : find.costProvision,
        jenisMargin: data.jenisMargin ? data.jenisMargin : find.jenisMargin,
        updatedAt: new Date(),
      },
    });
    return NextResponse.json(
      {
        msg: "Produk berhasil diperbarui",
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
