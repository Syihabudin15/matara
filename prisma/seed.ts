// import { PrismaClient } from "@prisma/client";
import { AuthType, PrismaClient, Role } from "@prisma/client";
import bcrypt from "bcrypt";
const prisma = new PrismaClient();

async function main() {
  const find = await prisma.users.findFirst({
    where: { username: "syihabudin" },
  });
  if (!find) {
    const userPass = await bcrypt.hash("Tsani182", 10);
    await prisma.users.create({
      data: {
        fullname: "SYIHABUDIN TSANI",
        username: "syihabudin",
        password: userPass,
        email: "syihabudintsani15@gmail.com",
        phone: "62881022157439",
        address: "Kp. Cantel 002/004",
        nip: "2025070101",
        nik: "3204251108010006",
        position: "IT Pusat",
        role: Role.DEVELOPER,
        authType: AuthType.CREDENTIAL,
      },
    });
  }

  console.log("Seeding succeesfully...");
}
main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
