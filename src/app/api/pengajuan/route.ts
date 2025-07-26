import { IPengajuan } from "@/components/IInterface";
import prisma from "@/components/Prisma";
import { StatusPengajuan } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

export const POST = async (req: NextRequest) => {
  const data: IPengajuan = await req.json();
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
  const status: StatusPengajuan | undefined = <any>(
    req.nextUrl.searchParams.get("status")
  );
  const userId: string | undefined = <any>(
    req.nextUrl.searchParams.get("userId")
  );
  const skip = (page - 1) * pageSize;

  try {
    const find = await prisma.pengajuan.findMany({
      where: {
        ...(search && {
          OR: [
            { fullname: { contains: search } },
            { nopen: { contains: search } },
            { location: { contains: search } },
          ],
        }),
        isActive: true,
        ...(status
          ? { status: status }
          : { status: { not: StatusPengajuan.SIMULASI } }),
        ...(userId && { usersId: userId }),
      },
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
      where: {
        ...(search && {
          OR: [
            { fullname: { contains: search } },
            { nopen: { contains: search } },
            { location: { contains: search } },
          ],
        }),
        ...(status
          ? { status: status }
          : { status: { not: StatusPengajuan.SIMULASI } }),
        isActive: true,
        ...(userId && { usersId: userId }),
      },
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
  const data: IPengajuan = await req.json();
  try {
    const findPengajuan = await prisma.pengajuan.findFirst({
      where: { id: data.id },
    });
    const findDetail = await prisma.detailPengajuan.findFirst({
      where: { id: data.detailPengajuanId },
    });
    if (!findPengajuan || !findDetail) {
      return NextResponse.json(
        { data: null, status: 404, msg: "Data tidak ditemukan" },
        { status: 404 }
      );
    }
    await prisma.$transaction(async (tx) => {
      await tx.detailPengajuan.update({
        where: { id: data.detailPengajuanId },
        data: {
          birthdate: data.DetailPengajuan.birthdate
            ? data.DetailPengajuan.birthdate
            : findDetail.birthdate,
          oldSalary: data.DetailPengajuan.oldSalary
            ? data.DetailPengajuan.oldSalary
            : findDetail.oldSalary,
          newSalary: data.DetailPengajuan.newSalary
            ? data.DetailPengajuan.newSalary
            : findDetail.newSalary,
          plafon: data.DetailPengajuan.plafon
            ? data.DetailPengajuan.plafon
            : findDetail.plafon,
          tenor: data.DetailPengajuan.tenor
            ? data.DetailPengajuan.tenor
            : findDetail.tenor,
          marginSumdan: data.DetailPengajuan.marginSumdan
            ? data.DetailPengajuan.marginSumdan
            : findDetail.marginSumdan,
          marginKoperasi: data.DetailPengajuan.marginKoperasi
            ? data.DetailPengajuan.marginKoperasi
            : findDetail.marginKoperasi,
          constInsurance: data.DetailPengajuan.constInsurance
            ? data.DetailPengajuan.constInsurance
            : findDetail.constInsurance,
          costAdmSumdan: data.DetailPengajuan.costAdmSumdan
            ? data.DetailPengajuan.costAdmSumdan
            : findDetail.costAdmSumdan,
          costAdmKoperasi: data.DetailPengajuan.costAdmKoperasi
            ? data.DetailPengajuan.costAdmKoperasi
            : findDetail.costAdmKoperasi,
          costGovernance: data.DetailPengajuan.costGovernance
            ? data.DetailPengajuan.costGovernance
            : findDetail.costGovernance,
          costStamp: data.DetailPengajuan.costStamp
            ? data.DetailPengajuan.costStamp
            : findDetail.costStamp,
          costAccount: data.DetailPengajuan.costAccount
            ? data.DetailPengajuan.costAccount
            : findDetail.costAccount,
          costProvision: data.DetailPengajuan.costProvision
            ? data.DetailPengajuan.costProvision
            : findDetail.costProvision,
          costMutasi: data.DetailPengajuan.costMutasi
            ? data.DetailPengajuan.costMutasi
            : findDetail.costMutasi,
          blokir: data.DetailPengajuan.blokir
            ? data.DetailPengajuan.blokir
            : findDetail.blokir,
          bpp: data.DetailPengajuan.bpp
            ? data.DetailPengajuan.bpp
            : findDetail.bpp,
          pelunasan: data.DetailPengajuan.pelunasan
            ? data.DetailPengajuan.pelunasan
            : findDetail.pelunasan,
          installment: data.DetailPengajuan.installment
            ? data.DetailPengajuan.installment
            : findDetail.installment,
          rounded: data.DetailPengajuan.rounded
            ? data.DetailPengajuan.rounded
            : findDetail.rounded,
          jenisMargin: data.DetailPengajuan.jenisMargin
            ? data.DetailPengajuan.jenisMargin
            : findDetail.jenisMargin,
          produkId: data.DetailPengajuan.produkId
            ? data.DetailPengajuan.produkId
            : findDetail.produkId,
          jenisId: data.DetailPengajuan.jenisId
            ? data.DetailPengajuan.jenisId
            : findDetail.jenisId,
        },
      });
      const savePengajuan = await tx.pengajuan.update({
        where: { id: data.id },
        data: {
          nopen: data.nopen ? data.nopen : findPengajuan.nopen,
          nik: data.nik ? data.nik : findPengajuan.nik,
          fullname: data.fullname ? data.fullname : findPengajuan.fullname,
          verifStatus: data.verifStatus
            ? data.verifStatus
            : findPengajuan.verifStatus,
          verifDesc: data.verifDesc ? data.verifDesc : findPengajuan.verifDesc,
          verifDate: data.verifDate ? data.verifDate : findPengajuan.verifDate,
          slikStatus: data.slikStatus
            ? data.slikStatus
            : findPengajuan.slikStatus,
          slikDesc: data.slikDesc ? data.slikDesc : findPengajuan.slikDesc,
          slikDate: data.slikDate ? data.slikDate : findPengajuan.slikDate,
          approvStatus: data.approvStatus
            ? data.approvStatus
            : findPengajuan.approvStatus,
          approvDesc: data.approvDesc
            ? data.approvDesc
            : findPengajuan.approvDesc,
          approvDate: data.approvDate
            ? data.approvDate
            : findPengajuan.approvDate,
          transferStatus: data.transferStatus
            ? data.transferStatus
            : findPengajuan.transferStatus,
          transferDate: data.transferDate
            ? data.transferDate
            : findPengajuan.transferDate,
          coordinates: data.coordinates,
          location: data.location,
          fileSLIK: data.fileSLIK ? data.fileSLIK : findPengajuan.fileSLIK,
          fileKTP: data.fileKTP ? data.fileKTP : findPengajuan.fileKTP,
          fileKK: data.fileKK ? data.fileKK : findPengajuan.fileKK,
          fileNPWP: data.fileNPWP ? data.fileNPWP : findPengajuan.fileNPWP,
          filePK: data.filePK ? data.filePK : findPengajuan.filePK,
          desc: data.desc ? data.desc : findPengajuan.desc,

          status: data.status ? data.status : findPengajuan.status,
          statusPaid: data.statusPaid
            ? data.statusPaid
            : findPengajuan.statusPaid,
          isActive: data.isActive,
          createdAt: data.createdAt,
          updatedAt: new Date(),
          usersId: data.usersId,
          flaggingId: data.flaggingId,
        },
      });
      return savePengajuan;
    });
    return NextResponse.json(
      { data: data, status: 200, msg: "Berhasil" },
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
