import {
  CompanyAnnouncement,
  CompanyAnnouncementFileAttachment,
  CompanyAnnouncementTo,
  CompanyFile,
} from '@prisma/client';
import { prisma } from '../../applications';
import { ErrorResponse } from '../../models';
import { Validation } from '../../validations';
import {
  CreateAnnouncementRequest,
  CreateAnnouncementResponse,
  UpdateAnnouncementRequest,
  UpdateAnnouncementResponse,
} from './announcementModel';
import { AnnouncementValidation } from './announcementValidation';
import { pathToFileUrl } from '../../utils/format';
import { sendEmail } from '../../utils/nodemailer';

export class AnnouncementService {
  static async getAnnouncementCompany({
    company_branch_id,
    title,
  }: {
    company_branch_id: string;
    title: string;
  }): Promise<CompanyAnnouncement[]> {
    const company = await prisma.companyBranches.findFirst({
      where: { company_branch_id: company_branch_id },
      select: {
        company_id: true,
      },
    });
    
    const announcements = await prisma.companyAnnouncement.findMany({
      where: { 
        title: { contains: title },
        company_id: company?.company_id
      },
      include: {
        company_announcement_to: {
          select: {
            company_branch_id: true,
          },
        },
        company_announcement_file_attachments: {
          include: {
            company_file: {
              select: {
                file_name: true,
                file_size: true,
                file_type: true,
                file_url: true,
              }
            },
          },
        },
      },
    });
    
    return announcements;
  }
  
  static async getAnnouncementCompanyBranch({
    company_branch_id,
    title,
    page
  }: {
    company_branch_id: string;
    title: string;
    page: number;
  }): Promise<CompanyAnnouncement[]> {
    const pageSize = 3;
    const skip = (page - 1) * pageSize;

    const announcements_id = await prisma.companyAnnouncementTo.findMany({
      where: { company_branch_id: company_branch_id},
      select: {
        company_announcement_id: true,
      },
    });
    
    const announcements = await prisma.companyAnnouncement.findMany({
      where: {
        title: { contains: title },
        company_announcement_id: {
          in: announcements_id.map((announcement) => announcement.company_announcement_id),
        },
      },
      include: {
        company_announcement_to: {
          select: {
            company_branch_id: true,
          },
        },
        company_announcement_file_attachments: {
          include: {
            company_file: {
              select: {
                file_name: true,
                file_size: true,
                file_type: true,
                file_url: true,
              },
            },
          },
        },
      },
      orderBy: {
        company_announcement_id: 'desc',
      },
      skip: skip, // Skip the number of records based on the page number
      take: pageSize, // Take only the page size number of records
    });

    return announcements;
  }

  static async downloadAnnouncementFile({
    company_id,
    company_announcement_id,
  }: {
    company_id: number;
    company_announcement_id: number;
  }) {
    const announcementFile = await prisma.companyAnnouncementFileAttachment.findMany({
      where: {
        company_announcement_id: company_announcement_id,
      },
      include: {
        company_file: {
          select: {
            file_name: true,
            file_size: true,
            file_type: true,
            file_url: true,
          }
        },
      },
    });

    if (!announcementFile) {
      throw new ErrorResponse('File not found', 404, [
        'company_announcement_id',
      ]);
    }

    const urlpath = announcementFile[0].company_file.file_url.replace("http://localhost:3000", "")
    const fixurl = decodeURIComponent(urlpath)
    return fixurl;
  }


  static async  createAnnouncementAndNotifyEmployees(
    announcementData: {
      company_id: string,
      title: string,
      description: string,
      company_branch_id: string[],
      file_attachment: any,
    }
  ) {
    // Create the announcement
    const announcement = await AnnouncementService.addAnnouncement(announcementData);
    const employeeEmails = []
    if (announcementData.company_branch_id !== undefined && announcementData.company_branch_id.length > 0) {
      for (let i = 0; i < (announcementData.company_branch_id ?? []).length; i++) {
        const getEmailEmployees = await prisma.employee.findMany({
          where: {
            company_branch_id: announcementData.company_branch_id[i],
          },
          select: {
            email: true,
          }
        });

        if (!getEmailEmployees) {
          throw new ErrorResponse('Failed to create announcement', 400, [
            'Failed_Create_Announcement_To_Company_Branch',
          ]);
        }

        employeeEmails.push(getEmailEmployees);
      }
    }

    // Prepare the email content
    const mailOptions = {
      from: `Meraih <${process.env.EMAIL}>`, // sender address
      to: "twin.panda999@gmail.com", // employeeEmails.join(','), // list of receivers
      subject: `${announcement.title}`, // Subject line
      text: `${announcement.description}`, // plain text body
      attachments: [] as { filename:string, path: string }[], // Initialize attachments as an empty array
      html: `
      <h1>ini title: ${announcement.title}</h1>
      <b>ini desc: ${announcement.description}</b>
      `, // html body
    };

    if(announcement.file_url !== ""){
      mailOptions.attachments.push({filename: announcement.file_name, path: announcement.file_url})
    }
    // Send the email to the employees
    sendEmail(mailOptions);
    return announcement;
  }

  static async createAnnouncementToBranch({
    company_announcement_id,
    company_branch_id,
  }: {
    company_announcement_id: number;
    company_branch_id: string;
  }) {
    const announcementTo = await prisma.companyAnnouncementTo.create({
      data: {
        company_announcement_id,
        company_branch_id,
      },
    });

    if (!announcementTo) {
      throw new ErrorResponse('Failed to create announcement', 400, [
        'Failed_Create_Announcement_To_Company_Branch',
      ]);
    }

    return announcementTo;
  } 


  static async addAnnouncement({
    company_id,
    title,
    description,
    company_branch_id,
    file_attachment,
  }: CreateAnnouncementRequest): Promise<CreateAnnouncementResponse> {
    const request = Validation.validate(
      AnnouncementValidation.CREATE_ANNOUNCEMENT,
      { company_id, title, description }
    );
    const company = await prisma.company.findFirst({
      where: { company_id: request.company_id },
    });

    if (!company)
      throw new ErrorResponse('Invalid Company Id', 400, [
        'from',
        'company_id',
      ]);
    const date = new Date()
    const announcement = await prisma.companyAnnouncement.create({
      data: {
        title: request.title,
        description: request.description,
        company_id: request.company_id,
        date: date,
      },
    });

    if (!announcement)
      throw new ErrorResponse('Failed to create announcement', 400, [
        'company_id',
        'title',
        'description',
      ]);

    const find_company_announcement_id =
      await prisma.companyAnnouncement.findMany({
        where: {
          company_id: request.company_id,
          title: request.title,
        },
        select: {
          company_announcement_id: true,
        },
        orderBy: {
          company_announcement_id: 'desc',
        },
        take: 1,
      });
    
    const branchesToAdd = Array.isArray(company_branch_id) ? company_branch_id : [company_branch_id];
    
    if (branchesToAdd[0] !== undefined && branchesToAdd.length > 0) {
      for (const branchId of branchesToAdd) {
        await AnnouncementService.createAnnouncementToBranch({
          company_announcement_id: find_company_announcement_id[0]?.company_announcement_id || 0,
          company_branch_id: branchId || '',
        });
      }
    }
    var file_url = ""
    if(file_attachment !== undefined){
      file_url = pathToFileUrl( file_attachment?.path || "", process.env.SERVER_URL || "http://localhost:3000");
      if(file_url == (process.env.SERVER_URL || "http://localhost:3000")){
        file_url == undefined
      }
    }
    const addCompanyFile = await prisma.companyFile.create({
      data: {
        company_id: request.company_id,
        file_name: file_attachment?.originalname || '',
        file_size: file_attachment?.size || 0,
        file_type: file_attachment?.mimetype || '',
        file_url: file_url,
        description: description,
      },
    });

    if (!addCompanyFile)
      throw new ErrorResponse('Failed to create file', 400, [
        'Failed_Create_Company_File',
      ]);

    const company_file_id = await prisma.companyFile.findMany({
      where: {
        company_id: request.company_id,
        file_name: file_attachment?.originalname || '',
      },
      select: {
        company_file_id: true,
      },
      orderBy: {
        company_file_id: 'desc',
      },
      take: 1,
    });
    const create_announcement_file_attachment = await prisma.companyAnnouncementFileAttachment.create({
      data: {
        company_announcement_id:
        find_company_announcement_id[0]?.company_announcement_id,
        company_file_id: company_file_id[0]?.company_file_id,
      },
    });
    
    if(!create_announcement_file_attachment){
      throw new ErrorResponse('Failed to create announcement', 400, [
        'Failed_Create_Company_Announcement_File_Attachment',
      ])
    }
    
    const branch_names = await prisma.companyBranches.findMany({
      where: {
        company_branch_id: {
          in: company_branch_id || [],
        },
      },
      select: {
        hq_initial: true,
      },
    });

    const branch_names_str = branch_names
      .map((branch) => branch.hq_initial)
      .join(', ');

    return {
      ...request,
      company_announcement_id: find_company_announcement_id[0]?.company_announcement_id || 0,
      file_name: file_attachment?.originalname || '',
      file_url: file_url,
      company_branch_id: branch_names_str,
      date
    };
  }

  static async updateAnnouncement(
    {
      company_id,
      company_announcement_id,
      title,
      description,
      company_branch_id_add,
      company_branch_id_remove,
      file_attachment,
    }: UpdateAnnouncementRequest
  ): Promise<UpdateAnnouncementResponse> {
    const request = Validation.validate(
      AnnouncementValidation.UPDATE_ANNOUNCEMENT,
      {
        company_id,
        company_announcement_id,
        title,
        description,
        company_branch_id_add,
        company_branch_id_remove
      }
    );

    const branchesToAdd = Array.isArray(company_branch_id_add) ? company_branch_id_add : [company_branch_id_add];
    const branchesToRemove = Array.isArray(company_branch_id_remove) ? company_branch_id_remove : [company_branch_id_remove];

    const announcement = await prisma.companyAnnouncement.findFirst({
      where: { company_announcement_id: request.company_announcement_id },
    });
    if(!announcement){
      throw new ErrorResponse('Announcement not found', 404, [
        'company_announcement_id',
      ]);
    }
    await prisma.companyAnnouncement.update({
      where: { company_announcement_id: request.company_announcement_id},
      data: {
        title: request.title,
        description: request.description,

      },
    });
    if (branchesToAdd[0] !== undefined && branchesToAdd.length > 0) {
      for (const branchId of branchesToAdd) {
        const isCreated = await prisma.companyAnnouncementTo.findFirst({ 
          where: {
            company_announcement_id: request.company_announcement_id,
            company_branch_id: branchId ?? '', 
          },
        });
        if (!isCreated) {
          await AnnouncementService.createAnnouncementToBranch({
            company_announcement_id: request.company_announcement_id,
            company_branch_id: branchId ?? '',
          });
        }
      }
    }

    if (branchesToRemove !== undefined && branchesToRemove.length > 0) {
      for (const branchId of branchesToRemove) {
        if (branchId) {
          await prisma.companyAnnouncementTo.deleteMany({
            where: {
              company_announcement_id: request.company_announcement_id,
              company_branch_id: branchId,
            },
          });
        }
      }
    }
    const company_file_id = await prisma.companyAnnouncementFileAttachment.findFirst({
      where: {
        company_announcement_id: request.company_announcement_id,
      },
      select: {
        company_file_id: true,
      },

    });
    const addCompanyFile = await prisma.companyFile.update({
      where: {
        company_file_id: company_file_id?.company_file_id,
      },
      data: {
        company_id: request.company_id,
        file_name: file_attachment?.originalname || '',
        file_size: file_attachment?.size || 0,
        file_type: file_attachment?.mimetype || '',
        file_url: pathToFileUrl(
          file_attachment?.path || "",
          process.env.SERVER_URL || "http://localhost:3000"
        ),
        description: description,
      },
    });

    return {company_id,
      company_announcement_id,
      title,
      description,
      company_branch_id_add,
      company_branch_id_remove,
      file_attachment
    };
  }

  static async deleteAnnouncement(
    announcement_id: string,
    company_id: string
  ) {

    const isDeleted = await prisma.companyAnnouncement.findFirst({
      where: {
        company_announcement_id: parseInt(announcement_id),
        company_id: company_id
      }
    });

    if (!isDeleted) {
      throw new ErrorResponse('Announcement not found', 404, [
        'company_announcement_id',
      ]);
    }

    await prisma.companyAnnouncementTo.deleteMany({
      where: {
        company_announcement_id: parseInt(announcement_id)
      }
    });
  
    await prisma.companyAnnouncementFileAttachment.deleteMany({
      where: {
        company_announcement_id: parseInt(announcement_id)
      }
    });
  
    const announcement = await prisma.companyAnnouncement.deleteMany({
      where: {
        company_announcement_id: parseInt(announcement_id),
        company_id: company_id
      }
    });
  
    return announcement;
  }

}
