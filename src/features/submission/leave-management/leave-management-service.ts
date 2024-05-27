import { start } from "repl";
import { prisma } from "../../../applications";
import { ErrorResponse } from "../../../models";
import { Validation } from "../../../validations";
import {
  GetAllByCompanyBranchIdResponse,
  GetByIdResponse,
  ValidateRequest,
} from "./leave-management-model";
import { LeaveManagementValidation } from "./leave-management-validation";
import { deleteFile } from "../../../utils/delete_file";
import { sendEmail } from "../../../utils/nodemailer";

export class LeaveManagementService {
  static async getAllByCompanyBranchId(
    company_branch_id: string,
    start_date: string,
    end_date: string
  ): Promise<GetAllByCompanyBranchIdResponse> {
    const request = Validation.validate(
      LeaveManagementValidation.GET_ALL_BY_COMPANY_BRANCH_ID,
      {
        company_branch_id,
      }
    );
    const leave = await prisma.leaveSubmission.findMany({
      orderBy: {
        submission: {
          created_at: "desc",
        },
      },
      where: {
        submission: {
          employee: {
            company_branch_id: request.company_branch_id,
          },
          submission_date: {
            gte: start_date ? new Date(start_date) : undefined,
            lte: end_date ? new Date(end_date) : undefined,
          },
        },
      },
      select: {
        submission: {
          select: {
            submission_id: true,
            submission_date: true,
            status: true,
            type: true,
            employee: {
              select: {
                first_name: true,
                last_name: true,
                employee_id: true,
              },
            },
            employee_file: {
              select: {
                file_url: true,
              },
            },
          },
        },
      },
    });
    const leaveMapped = leave.map((l) => {
      return {
        submission_id: l.submission.submission_id,
        submission_date: l.submission.submission_date,
        type: l.submission.type,
        status: l.submission.status,
        employee: {
          first_name: l.submission.employee.first_name,
          last_name: l.submission.employee.last_name,
          employee_id: l.submission.employee.employee_id,
        },
        employee_file: {
          file_url: l.submission.employee_file?.file_url,
        },
      };
    });
    return {
      leave_data: leaveMapped,
      num_not_validated: leave.filter((l) => l.submission.status === "PENDING")
        .length,
    };
  }
  static async getById(
    submission_id: number,
    company_branch_id: string
  ): Promise<GetByIdResponse> {
    const request = Validation.validate(LeaveManagementValidation.GET_BY_ID, {
      submission_id,
      company_branch_id,
    });
    const leave = await prisma.submission.findUnique({
      where: {
        submission_id: request.submission_id,
        employee: {
          company_branch_id: request.company_branch_id,
        },
      },
      select: {
        submission_id: true,
        status: true,
        submission_date: true,
        type: true,
        employee: {
          select: {
            first_name: true,
            last_name: true,
            employee_id: true,
          },
        },
        employee_file: {
          select: {
            file_url: true,
          },
        },
        leave_submission: {
          select: {
            from: true,
            to: true,
            leave_reason: true,
            leave_permission_id: true,
          },
        },
      },
    });
    if (!leave) {
      throw new ErrorResponse("Leave not found", 404, ["submission_id"]);
    }
    return leave;
  }
  static async validateLetter({
    status,
    submission_id,
    company_branch_id,
  }: ValidateRequest) {
    const request = Validation.validate(LeaveManagementValidation.VALIDATE, {
      submission_id,
      status,
      company_branch_id,
    });
    const letter = await prisma.submission.findUnique({
      select: {
        employee: {
          select: {
            email: true,
            first_name: true,
            last_name: true,
          },
        },
      },
      where: {
        submission_id: request.submission_id,
        employee: {
          company_branch_id: request.company_branch_id,
        },
      },
    });
    if (!letter) {
      throw new ErrorResponse(`Leave not found`, 404, ["submission_id"]);
    }
    await prisma.submission.update({
      where: {
        submission_id: request.submission_id,
      },
      data: {
        status: request.status,
      },
    });
    const htmlTemplate = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <style>
            body {
                font-family: Arial, sans-serif;
                line-height: 1.6;
                color: #333;
                background-color: #f4f4f4;
                margin: 0;
                padding: 0;
            }
            .container {
                width: 80%;
                max-width: 600px;
                margin: 0 auto;
                background-color: #ffffff;
                padding: 20px;
                border-radius: 10px;
                box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
            }
            h1 {
                color: #444444;
            }
            p {
                font-size: 1rem;
            }
            .strike-through {
                text-decoration: line-through;
            }
            .credentials {
                background-color: #f9f9f9;
                padding: 15px;
                border: 1px solid #ddd;
                border-radius: 5px;
                margin-top: 20px;
            }
            .credentials p {
                margin: 5px 0;
            }
            .footer {
                margin-top: 30px;
                font-size: 0.8rem;
                color: #777777;
            }
        </style>
    </head>
    <body>
        <div class="container">
            <h1>Hallo, ${letter?.employee?.first_name} ${
      letter?.employee?.last_name
    }!</h1>
            <p>Pengajuan cuti yang anda lakukan telah ${
              status == "ACCEPTED" ? "diterima" : "ditolak"
            } oleh Perusahaan. Mohon segera membuka aplikasi untuk informasi lebih lanjut</p>
            <p>Harap simpan informasi ini dengan aman dan jangan bagikan dengan siapa pun.</p>
            
            <div class="footer">
                <p>&copy; ${new Date().getFullYear()} Perusahaan Kami. Semua hak dilindungi.</p>
            </div>
        </div>
    </body>
    </html>
    `;
    const mailOptions = {
      from: `Meraih <${process.env.EMAIL}>`, // sender address
      to: letter?.employee?.email, // list of receivers
      subject: "Leave Approval", // Subject line
      html: htmlTemplate, // html body
    };
    sendEmail(mailOptions);
  }
  static async deleteLetter(submission_id: number, company_branch_id: string) {
    const request = Validation.validate(LeaveManagementValidation.GET_BY_ID, {
      submission_id,
      company_branch_id,
    });
    const letter = await prisma.submission.findUnique({
      where: {
        submission_id: request.submission_id,
        employee: {
          company_branch_id: request.company_branch_id,
        },
      },
      select: {
        type: true,
        employee_file: {
          select: {
            file_url: true,
          },
        },
      },
    });
    if (!letter) {
      throw new ErrorResponse(`Leave not found`, 404, ["submission_id"]);
    }
    if (letter.employee_file) {
      await deleteFile(letter.employee_file.file_url);
    }
    await prisma.submission.delete({
      where: {
        submission_id: request.submission_id,
      },
    });
  }
}
