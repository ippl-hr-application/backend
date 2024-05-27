import { prisma } from "../../../applications";
import { ErrorResponse } from "../../../models";
import { deleteFile } from "../../../utils/delete_file";
import { sendEmail } from "../../../utils/nodemailer";
import { Validation } from "../../../validations";
import {
  GetAllByCompanyBranchIdResponse,
  GetByIdResponse,
  ValidateRequest,
} from "./sick-management-model";
import { SickManagementValidation } from "./sick-management-validation";

export class SickManagementService {
  static async getAllByCompanyBranchId(
    company_branch_id: string,
    start_date: string,
    end_date: string
  ): Promise<GetAllByCompanyBranchIdResponse> {
    const request = Validation.validate(
      SickManagementValidation.GET_ALL_BY_COMPANY_BRANCH_ID,
      {
        company_branch_id,
      }
    );
    const sick = await prisma.submission.findMany({
      orderBy: {
        created_at: "desc",
      },
      where: {
        employee: {
          company_branch_id: request.company_branch_id,
        },

        type: "SAKIT",
        submission_date: {
          gte: start_date ? new Date(start_date) : undefined,
          lte: end_date ? new Date(end_date) : undefined,
        },
      },
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
    });
    return {
      num_not_validated: sick.filter((s) => s.status === "PENDING").length,
      sick_data: sick,
    };
  }
  static async getById(
    submission_id: number,
    company_branch_id: string
  ): Promise<GetByIdResponse> {
    const request = Validation.validate(SickManagementValidation.GET_BY_ID, {
      submission_id,
      company_branch_id,
    });
    const sick = await prisma.submission.findUnique({
      where: {
        submission_id: request.submission_id,
        employee: {
          company_branch_id: request.company_branch_id,
        },
      },
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
        permission_submission: {
          select: {
            permission_reason: true,
            from: true,
            to: true,
            type: true,
          },
        },
      },
    });
    if (!sick) {
      throw new ErrorResponse("Sick not found", 404, ["submission_id"]);
    }
    return sick;
  }
  static async validateLetter({
    status,
    submission_id,
    company_branch_id,
  }: ValidateRequest) {
    const request = Validation.validate(SickManagementValidation.VALIDATE, {
      submission_id,
      status,
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
        employee: {
          select: {
            first_name: true,
            last_name: true,
            email: true,
          },
        },
      },
    });
    if (!letter) {
      throw new ErrorResponse(`Sick not found`, 404, ["submission_id"]);
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
            <p>Pengajuan sakit yang anda lakukan telah ${
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
      subject: "Sick Approval", // Subject line
      html: htmlTemplate, // html body
    };
    sendEmail(mailOptions);
  }
  static async deleteLetter(submission_id: number, company_branch_id: string) {
    const request = Validation.validate(SickManagementValidation.GET_BY_ID, {
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
      throw new ErrorResponse(`Sick not found`, 404, ["submission_id"]);
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
