import { prisma } from "../../applications";

export class MeraihService {
  static async getAllRegisteredUsers() {
    const users = await prisma.registeredUser.findMany({
      select: {
        user_id: true,
        full_name: true,
        email: true,
        phone_number: true,
        company: {
          select: {
            name: true,
            industry: true,
            npwp_digit: true,
            package_type: true,
            company_branches: {
              select: {
                company_branch_id: true,
                email: true,
                phone_number: true,
                address: true,
                province: true,
                city: true,
                size: true,
                hq_code: true,
                hq_initial: true,
                umr: true,
                umr_city: true,
                umr_province: true,
                bpjs: true,
                _count: {
                  select: {
                    employees: true,
                  }
                }
              }
            }
          }
        }
        // include: {
        //   company: {
        //     include: {
        //       company_branches: {
        //         include: {
        //           _count: {
        //             select: {
        //               employees: true,
        //             }
        //           }
        //         }
        //       },
        //     },
        //   },
      },
    });

    return users;
  }
}
