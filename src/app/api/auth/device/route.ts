import prisma from "@/components/Prisma";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import { v4 as uuidv4 } from "uuid";
import { UAParser } from "ua-parser-js";
import { Devices } from "@prisma/client";

export const GET = async (req: NextRequest) => {
  const userAgent = req.headers.get("user-agent") || "";
  const parser = new UAParser(userAgent);
  const result = parser.getResult();
  try {
    const cook = (await cookies()).get("vID")?.value;
    const find = await prisma.devices.findFirst({ where: { deviceId: cook } });
    if (find && cook) {
      return NextResponse.json(
        {
          msg: "Device sudah terdaftar",
          status: 400,
          data: null,
        },
        {
          status: 400,
        }
      );
    }
    const deviceId = uuidv4();
    await prisma.devices.create({
      data: {
        deviceId: deviceId,
        deviceName: result.device.model || "",
        deviceType: result.device.type || "",
        sistem: result.os.name || "",
        browser: `${result.browser.name} ${result.browser.version} ${result.browser.major} | ${result.ua} `,
        status: "PENDING",
      },
    });
    (await cookies()).set("vID", deviceId, { maxAge: 60 * 60 * 24 * 365 * 10 });
    return NextResponse.json(
      {
        msg: "Device berhasil di registrasi",
        status: "OK",
        data: deviceId,
      },
      { status: 200 }
    );
  } catch (err) {
    console.log(err);
    return NextResponse.json(
      {
        msg: "Error",
        status: "Internal Server Error",
        data: err,
      },
      {
        status: 500,
      }
    );
  }
};

export const DELETE = async (req: NextRequest) => {
  try {
    const vID = (await cookies()).get("vID")?.value || "";
    const find = await prisma.devices.findMany({
      where: { status: "APPROVED" },
    });

    for (let i = 0; i < find.length; i++) {
      if (find[i].deviceId === vID) {
        return NextResponse.json(
          {
            msg: "OK",
            status: 200,
            data: find[i],
          },
          { status: 200 }
        );
      }
    }

    return NextResponse.json(
      {
        msg: "NOT FOUND",
        status: 404,
        data: null,
      },
      { status: 404 }
    );
  } catch (err) {
    console.log(err);
    return NextResponse.json(
      {
        msg: "Server Error",
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
          data: null,
          status: 404,
          msg: "Device tidak ditemukan",
        },
        { status: 404 }
      );
    }
    await prisma.devices.update({
      where: { id: data.id },
      data: {
        deviceName: data.deviceName ? data.deviceName : find.deviceName,
        deviceType: data.deviceType ? data.deviceType : find.deviceType,
        sistem: data.sistem ? data.sistem : find.sistem,
        status: data.status ? data.status : find.status,
        updatedAt: new Date(),
      },
    });
  } catch (err) {
    console.log(err);
    return NextResponse.json(
      {
        msg: "Error",
        status: "Internal Server Error",
        data: err,
      },
      {
        status: 500,
      }
    );
  }
};
