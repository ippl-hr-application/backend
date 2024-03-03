import { roles } from "./RoleSeeder";
import { prisma } from "../../src/applications";

async function main () {
  await prisma.role.deleteMany({});
  
  await prisma.role.createMany({
    data: roles,
  });
}

main();
