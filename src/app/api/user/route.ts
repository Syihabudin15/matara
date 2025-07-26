import prisma from "@/components/Prisma";
import { Role, Users } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcrypt";

export const POST = async (req: NextRequest) => {
  const data: Users = await req.json();
  console.log(data);
  if (
    !data.fullname ||
    !data.username ||
    !data.password ||
    !data.email ||
    !data.phone ||
    !data.position ||
    !data.address ||
    !data.nik ||
    !data.nip ||
    !data.role
  ) {
    return NextResponse.json(
      {
        msg: "Mohon lengkapi data user terlebih dahulu!",
        status: 400,
        data: null,
      },
      { status: 400 }
    );
  }
  try {
    const findUnique = await prisma.users.findFirst({
      where: {
        OR: [
          { email: data.email },
          { phone: data.phone },
          { nik: data.nik },
          { nip: data.nip },
        ],
      },
    });
    if (findUnique) {
      return NextResponse.json(
        {
          msg: "NIK/NIP/Username/Email/No Telepon sudah digunakan",
          status: 400,
          data: null,
        },
        { status: 400 }
      );
    }
    const pass = await bcrypt.hash(data.password, 10);
    const save = await prisma.users.create({
      data: {
        fullname: data.fullname,
        username: data.username.toLocaleLowerCase(),
        password: pass,
        email: data.email,
        phone: data.phone,
        nik: data.nik,
        nip: data.nip,
        face: data.face,
        role: data.role,
        address: data.address,
        position: data.position,
        unitId: data.unitId,
        sumdanId: data.sumdanId,
        image: data.image,
        menu: data.menu,
        authType: data.authType,
        status: true,
      },
    });
    return NextResponse.json(
      { msg: "User berhasil ditambahkan", status: 201, data: save },
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
  const fRole: Role | undefined = <any>req.nextUrl.searchParams.get("role");
  const skip = (page - 1) * pageSize;

  try {
    const find = await prisma.users.findMany({
      where: search
        ? {
            OR: [
              { fullname: { contains: search } },
              { username: { contains: search } },
              { email: { contains: search } },
              { phone: { contains: search } },
              { address: { contains: search } },
              { nip: { contains: search } },
              { nik: { contains: search } },
              { position: { contains: search } },
              { Unit: { name: { contains: search } } },
            ],
          }
        : {},
      skip: skip,
      take: pageSize,
    });
    const total = await prisma.users.count({
      where: search
        ? {
            OR: [
              { fullname: { contains: search } },
              { username: { contains: search } },
              { email: { contains: search } },
              { phone: { contains: search } },
              { address: { contains: search } },
              { nip: { contains: search } },
              { nik: { contains: search } },
              { position: { contains: search } },
              { Unit: { name: { contains: search } } },
            ],
          }
        : {},
    });
    return NextResponse.json(
      {
        msg: "OK",
        status: 200,
        data: fRole ? find.filter((f) => f.role === fRole) : find,
        total: fRole ? find.filter((f) => f.role === fRole).length : total,
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
  const data: Users = await req.json();
  try {
    const find = await prisma.users.findFirst({ where: { id: data.id } });
    if (!find) {
      return NextResponse.json(
        {
          msg: "User tidak ditemukan!",
          status: 404,
          data: null,
        },
        { status: 404 }
      );
    }
    const save = await prisma.users.update({
      where: { id: data.id },
      data: {
        fullname: data.fullname ? data.fullname : find.fullname,
        username: data.username ? data.username : find.username,
        phone: data.phone ? data.phone : find.phone,
        email: data.email ? data.email : find.email,
        address: data.address ? data.address : find.address,
        nip: data.nip ? data.nip : find.nip,
        nik: data.nik ? data.nik : find.nik,
        position: data.position ? data.position : find.position,
        face: data.face ? data.face : find.face,
        image: data.image ? data.image : find.image,
        unitId: data.unitId ? data.unitId : find.unitId,
        role: data.role ? data.role : find.role,
        status: data.status ? data.status : find.status,
        menu: data.menu ? data.menu : find.menu,
        authType: data.authType ? data.authType : find.authType,
        coord: data.coord ? data.coord : find.coord,
        location: data.location ? data.location : find.location,
        sumdanId: data.sumdanId ? data.sumdanId : find.sumdanId,
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
