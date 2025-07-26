import { IPengajuan } from "@/components/IInterface";
import prisma from "@/components/Prisma";
import { NextRequest, NextResponse } from "next/server";

export const POST = async (req: NextRequest) => {
  const data: IPengajuan = await req.json();
  console.log(data);
  try {
    await prisma.$transaction(async (tx) => {
      const saveDetailPengajuan = await tx.detailPengajuan.create({
        data: {
          birthdate: data.DetailPengajuan.birthdate,
          oldSalary: data.DetailPengajuan.oldSalary,
          newSalary: data.DetailPengajuan.newSalary,
          plafon: data.DetailPengajuan.plafon,
          tenor: data.DetailPengajuan.tenor,
          marginSumdan: data.DetailPengajuan.marginSumdan,
          marginKoperasi: data.DetailPengajuan.marginKoperasi,
          constInsurance: data.DetailPengajuan.constInsurance,
          costAdmSumdan: data.DetailPengajuan.costAdmSumdan,
          costAdmKoperasi: data.DetailPengajuan.costAdmKoperasi,
          costGovernance: data.DetailPengajuan.costGovernance,
          costStamp: data.DetailPengajuan.costStamp,
          costAccount: data.DetailPengajuan.costAccount,
          costProvision: data.DetailPengajuan.costProvision,
          costMutasi: data.DetailPengajuan.costMutasi,
          blokir: data.DetailPengajuan.blokir,
          bpp: data.DetailPengajuan.bpp,
          pelunasan: data.DetailPengajuan.pelunasan,
          installment: data.DetailPengajuan.installment,
          rounded: data.DetailPengajuan.rounded,
          jenisMargin: data.DetailPengajuan.jenisMargin,
          produkId: data.DetailPengajuan.produkId,
          jenisId: data.DetailPengajuan.jenisId,
        },
      });
      const savePengajuan = await tx.pengajuan.create({
        data: {
          nopen: data.nopen,
          nik: data.nik,
          fullname: data.fullname,
          verifStatus: null,
          verifDesc: null,
          verifDate: null,
          slikStatus: null,
          slikDesc: null,
          slikDate: null,
          approvStatus: null,
          approvDesc: null,
          approvDate: null,
          transferStatus: null,
          transferDate: null,
          coordinates: data.coordinates,
          location: data.location,
          fileSLIK: null,
          fileKTP: null,
          fileKK: null,
          fileNPWP: null,
          filePK: null,
          desc: data.desc,

          status: data.status,
          statusPaid: false,
          isActive: true,
          createdAt: data.createdAt,
          updatedAt: data.updatedAt,
          usersId: data.usersId,
          flaggingId: data.flaggingId,
          detailPengajuanId: saveDetailPengajuan.id,
        },
      });
      return savePengajuan;
    });
    return NextResponse.json(
      { data: data, status: 201, msg: "Berhasil" },
      { status: 201 }
    );
  } catch (err) {
    console.log(err);
    return NextResponse.json(
      { data: null, status: 500, msg: "Internal Server Error" },
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
    const find = await prisma.pengajuan.findMany({
      where: search
        ? {
            OR: [
              { fullname: { contains: search } },
              { nopen: { contains: search } },
              { location: { contains: search } },
            ],
          }
        : {},
      skip: skip,
      take: pageSize,
      include: {
        DetailPengajuan: {
          include: {
            Produk: {
              include: {
                Sumdan: true,
              },
            },
            Jenis: true,
          },
        },
        User: true,
      },
    });
    const total = await prisma.pengajuan.count({
      where: search
        ? {
            OR: [
              { fullname: { contains: search } },
              { nopen: { contains: search } },
              { location: { contains: search } },
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
