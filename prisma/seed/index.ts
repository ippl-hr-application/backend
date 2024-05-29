import { MeraihUsers } from "./MeraihUserSeeder";
import { roles } from "./RoleSeeder";
import { prisma } from "../../src/applications";
import { comparePassword, hashPassword } from "../../src/utils";

async function main() {
  // await prisma.role.deleteMany({});

  // await prisma.role.createMany({
  //   data: roles,
  // });

  await prisma.meraihUser.deleteMany({});
  await prisma.meraihUser.createMany({
    data: MeraihUsers.map((user) => {
      return {
        ...user,
        password: hashPassword(user.password),
      };
    }),
  });
}

main();
