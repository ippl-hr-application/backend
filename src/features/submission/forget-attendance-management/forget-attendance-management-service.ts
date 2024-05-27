import { prisma } from "../../../applications";
import { ErrorResponse } from "../../../models";
import { deleteFile } from "../../../utils/delete_file";
import { sendEmail } from "../../../utils/nodemailer";
import { Validation } from "../../../validations";
import {
  GetAllByCompanyBranchIdResponse,
  GetByIdResponse,
  ValidateRequest,
} from "./forget-attendance-management-model";
import { ForgetAttendanceManagementValidation } from "./forget-attendance-management-validation";

export class ForgetAttendanceManagementService {
  static async getAllByCompanyBranchId(
    company_branch_id: string,
    start_date: string,
    end_date: string
  ): Promise<GetAllByCompanyBranchIdResponse> {
    const request = Validation.validate(
      ForgetAttendanceManagementValidation.GET_ALL_BY_COMPANY_BRANCH_ID,
      {
        company_branch_id,
      }
    );
    const forgetAttendance = await prisma.submission.findMany({
      orderBy: {
        created_at: "desc",
      },
      where: {
        employee: {
          company_branch_id: request.company_branch_id,
        },

        type: "SURAT",
        submission_date: {
          gte: start_date ? new Date(start_date) : undefined,
          lte: end_date ? new Date(end_date) : undefined,
        },
      },
      select: {
        employee: {
          select: {
            first_name: true,
            last_name: true,
            employee_id: true,
          },
        },
        submission_id: true,
        submission_date: true,
        type: true,
        status: true,
        employee_file: {
          select: {
            file_url: true,
          },
        },
      },
    });
    return {
      forget_attendance_data: forgetAttendance,
      num_not_validated: forgetAttendance.filter((e) => e.status !== "PENDING")
        .length,
    };
  }
  static async getById(submission_id: number): Promise<GetByIdResponse> {
    const request = Validation.validate(
      ForgetAttendanceManagementValidation.GET_BY_ID,
      {
        submission_id,
      }
    );
    const forgetAttendance = await prisma.submission.findUnique({
      where: {
        submission_id: request.submission_id,
      },
      select: {
        submission_id: true,
        submission_date: true,
        type: true,
        employee_file: {
          select: {
            file_url: true,
          },
        },
        status: true,
        employee: {
          select: {
            employee_id: true,
            last_name: true,
            first_name: true,
          },
        },
        attendance_submission: {
          select: {
            reason: true,
            attendance_submission_id: true,
            attendance: {
              select: {
                date: true,
                attendance_check: {
                  select: {
                    type: true,
                    time: true,
                    status: true,
                  },
                },
              },
            },
          },
        },
      },
    });
    if (!forgetAttendance) {
      throw new ErrorResponse("Forget attendance not found", 404, [
        "submission_id",
      ]);
    }
    return forgetAttendance;
  }
  static async validateLetter({
    status,
    submission_id,
    company_branch_id,
  }: ValidateRequest) {
    const request = Validation.validate(
      ForgetAttendanceManagementValidation.VALIDATE,
      {
        submission_id,
        status,
        company_branch_id,
      }
    );
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
            employee_id: true,
            company_branch_id: true,
            first_name: true,
            last_name: true,
            email: true,
            assign_shift: {
              orderBy: {
                assign_shift_id: "desc",
              },
              take: 1,
              select: {
                assign_shift_id: true,
              },
            },
          },
        },
      },
    });
    if (!letter) {
      throw new ErrorResponse(`Forget Attendance not found`, 404, [
        "submission_id",
      ]);
    }
    await prisma.$transaction(async (prisma) => {
      await prisma.submission.update({
        where: {
          submission_id: request.submission_id,
        },
        data: {
          status: request.status,
        },
      });
      if (request.status === "ACCEPTED") {
        await prisma.attendance.create({
          data: {
            date: new Date().toISOString(),
            employee_id: letter?.employee?.employee_id,
            company_branch_id: letter?.employee?.company_branch_id,
            assign_shift_id: letter?.employee?.assign_shift[0].assign_shift_id,
          },
        });
      }
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
              <p>Pengajuan lupa presensi yang anda lakukan telah ${
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
      subject: "Forget Attendance Approval", // Subject line
      html: htmlTemplate, // html body
    };
    sendEmail(mailOptions);
  }
  static async deleteLetter(submission_id: number, company_branch_id: string) {
    const request = Validation.validate(
      ForgetAttendanceManagementValidation.GET_BY_ID,
      {
        submission_id,
        company_branch_id,
      }
    );
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
      throw new ErrorResponse(`Forget Attendance not found`, 404, [
        "submission_id",
      ]);
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
