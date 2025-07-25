import prisma from "@/components/Prisma";
import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcrypt";
import { getSession, signOut, signIn } from "@/components/utils/AuthUtils";
import { AuthType, Users } from "@prisma/client";

const euclideanDistance = (d1: number[], d2: number[]): number => {
  return Math.sqrt(d1.reduce((acc, val, i) => acc + (val - d2[i]) ** 2, 0));
};

// CHECK FACE
export const PUT = async (req: NextRequest) => {
  const { descriptor, userId } = await req.json();
  if (!descriptor || !Array.isArray(descriptor) || !userId) {
    return NextResponse.json(
      {
        msg: "Invalid Credential Data",
        status: 400,
        data: null,
      },
      { status: 400 }
    );
  }

  try {
    const find = await prisma.users.findFirst({
      where: {
        id: userId,
      },
    });

    if (!find) {
      return NextResponse.json(
        {
          data: null,
          status: 404,
          msg: "Username atau Password salah",
        },
        { status: 404 }
      );
    }
    const faces = JSON.parse(find.face || "");
    const distance = euclideanDistance(faces, descriptor);
    if (distance < 0.6) {
      await signIn({
        id: find.id,
        fullname: find.fullname,
        username: find.username,
        email: find.email,
        phone: find.phone,
        position: find.position,
        role: find.role,
        lat: 0,
        lng: 0,
      });
      return NextResponse.json(
        {
          msg: "User Diverifikasi",
          status: 200,
          data: find,
        },
        { status: 200 }
      );
    }
    return NextResponse.json(
      {
        msg: "User tidak dapat diverifikasi",
        status: 404,
        data: null,
      },
      { status: 404 }
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

export const POST = async (req: NextRequest) => {
  const data: { username: string; password: string } = await req.json();
  try {
    const find = await prisma.users.findFirst({
      where: { username: data.username },
    });
    const verify = await bcrypt.compare(
      data.password,
      find ? find.password : ""
    );
    if (!find || !verify) {
      return NextResponse.json(
        {
          data: null,
          status: 404,
          msg: "Username atau Password salah",
        },
        { status: 404 }
      );
    }
    if (find.status === false) {
      return NextResponse.json(
        {
          data: null,
          status: 404,
          msg: "Username atau Password salah",
        },
        { status: 404 }
      );
    }
    if (find.authType === AuthType.CREDENTIAL) {
      await signIn({
        id: find.id,
        fullname: find.fullname,
        username: find.username,
        email: find.email,
        phone: find.phone,
        position: find.position,
        role: find.role,
        lat: 0,
        lng: 0,
      });
    }
    return NextResponse.json(
      { data: find, status: 200, msg: "Berhasil" },
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

export const GET = async (req: NextRequest) => {
  try {
    const result = await getSession();
    if (!result) {
      return NextResponse.json(
        { msg: "Unauthorize", status: 401 },
        { status: 401 }
      );
    }
    const user = await prisma.users.findFirst({
      where: { id: result.user.id },
    });
    return NextResponse.json(
      { msg: "Success", status: 200, data: user },
      { status: 200 }
    );
  } catch (err) {
    console.log(err);
    return NextResponse.json(
      { msg: "Internal Server Error", status: 500 },
      { status: 500 }
    );
  }
};

export const DELETE = async (req: NextRequest) => {
  try {
    await signOut();
    return NextResponse.json(
      { msg: "Logout success", status: 200 },
      { status: 200 }
    );
  } catch (err) {
    console.log(err);
    return NextResponse.json(
      {
        msg: "Internal Server Error",
        status: 500,
      },
      { status: 500 }
    );
  }
};
