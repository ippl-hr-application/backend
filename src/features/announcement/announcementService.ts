import {
  CompanyAnnouncement
} from '@prisma/client';
import { prisma } from '../../applications';
import { ErrorResponse } from '../../models';
import { Validation } from '../../validations';
import {
  CreateAnnouncementRequest,
  CreateAnnouncementResponse,
  EzCreateAnnouncementRequest,
  EzCreateAnnouncementResponse,
  EzUpdateAnnouncementRequest,
  EzUpdateAnnouncementResponse,
  UpdateAnnouncementRequest,
  UpdateAnnouncementResponse,
} from './announcementModel';
import { AnnouncementValidation } from './announcementValidation';
import { pathToFileUrl } from '../../utils/format';
import { sendEmail } from '../../utils/nodemailer';

export class AnnouncementService {
  static async getAnnouncementCompanyBranch({
    company_branch_id,
    title,
    page
  }: {
    company_branch_id: string;
    title: string;
    page: number;
  }): Promise<CompanyAnnouncement[]> {
    const pageSize = 10;
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

  static async createAnnouncementAndNotifyEmployees(
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

        if (!getEmailEmployees || getEmailEmployees.length === 0) {
          throw new ErrorResponse('Failed to create announcement', 400, [
            'Failed_Create_Announcement_To_Company_Branch',
          ]);
        }
          // Prepare the email content
        for( const employee of getEmailEmployees){
          const mailOptions = {
            from: `Meraih <${process.env.EMAIL}>`, // sender address
            to: employee.email, // list of receivers
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
          await sendEmail(mailOptions);
          // console.log(employee.email)
        }
      }
    }
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
    if (company_branch_id) {
      for(const company_branch of company_branch_id){
        console.log(company_branch)
        const company = await prisma.company.findFirst({
          where: { 
            company_id: request.company_id,
            company_branches: {
              some: {
                company_branch_id: company_branch,
              },
            }
          },
        });

        if (!company)
          throw new ErrorResponse(
            'Company Branch Id is Not Belong To Company ID', 
            400, 
            ['company_id', 'company_branch_id'],
            "COMPANY_BRANCH_ID_NOT_BELONG_TO_COMPANY_ID"
          );
      }
    }

    // ============================================================
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
      throw new ErrorResponse(
        'Failed to create announcement', 
        400, 
        [
        'company_id',
        'title',
        'description',
        ],
        "FAILED_CREATE_ANNOUNCEMENT"
      );

    // =======================================================
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
      throw new ErrorResponse(
        'Failed to create file', 
        400, 
        [
        'Failed_Create_Company_File',
        ],
        "FAILED_CREATE_COMPANY_FILE"
      );

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
      throw new ErrorResponse(
        'Failed to create announcement', 
        400, 
        [
        'Failed_Create_Company_Announcement_File_Attachment',
        ],
        "FAILED_CREATE_COMPANY_ANNOUNCEMENT_FILE_ATTACHMENT")
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
      throw new ErrorResponse(
        'Announcement not found', 
        404, 
        [
        'company_announcement_id',
        ],
        "ANNOUNCEMENT_NOT_FOUND"
      );
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
      throw new ErrorResponse(
        'Announcement not found',
        404, 
        [
        'company_announcement_id',
        ],
        "ANNOUNCEMENT_NOT_FOUND"
      );
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

  static async ezCreateAnnouncementAndNotifyEmployees(
    data : EzCreateAnnouncementRequest
  ) : Promise<EzCreateAnnouncementResponse> {
    const request = Validation.validate(
      AnnouncementValidation.EZ_CREATE_ANNOUNCEMENT,
      data
    );
    const company = await prisma.companyBranches.findFirst({
      where: {
        company_branch_id: data.company_branch_id,
      },
      select: {
        company_id: true,
      },
    });
    
    var file_url = ""
    if(data.file_attachment !== undefined){
      file_url = pathToFileUrl( data.file_attachment?.path || "", process.env.SERVER_URL || "http://localhost:3000");
    }

    // ============================================================
    const date = new Date()
    const announcement = await prisma.companyAnnouncement.create({
      data: {
        title: data.title,
        description: data.description,
        company_id: company?.company_id || '',
        date: date,
        company_announcement_to: {
          create: {
            company_branch_id: data.company_branch_id,
          }
        },
        company_announcement_file_attachments: {
          create: {
            company_file: {
              create: {
                company_id: company?.company_id || '',
                file_name: data.file_attachment?.originalname || '',
                file_size: data.file_attachment?.size || 0,
                file_type: data.file_attachment?.mimetype || '',
                file_url: pathToFileUrl(
                  data.file_attachment?.path || "",
                  process.env.SERVER_URL || "http://localhost:3000"
                ),
                description: data.description,
              }
            }
          }
        }
      }, 
    });

    if (!announcement)
      throw new ErrorResponse(
        'Failed to create announcement', 
        400, 
        [
        'company_id',
        'title',
        'description',
        ],
        "FAILED_CREATE_ANNOUNCEMENT"
      );
    
    const getEmailEmployees = await prisma.employee.findMany({
      where: {
        company_branch_id: data.company_branch_id,
      },
      select: {
        email: true,
      }
    });

    if (!getEmailEmployees || getEmailEmployees.length === 0) {
      throw new ErrorResponse('Failed to create announcement', 400, [
        'Failed_Create_Announcement_To_Company_Branch',
      ]);
    }
      // Prepare the email content
    for( const employee of getEmailEmployees){
      const mailOptions = {
        from: `Meraih <${process.env.EMAIL}>`, // sender address
        to: employee.email, // list of receivers
        subject: `${announcement.title}`, // Subject line
        text: `${announcement.description}`, // plain text body
        attachments: [] as { filename:string, path: string }[], // Initialize attachments as an empty array
        html: `
        <p>${announcement.description}</p>
        `, // html body
      };
  
      if(data.file_attachment !== undefined){
        mailOptions.attachments.push({filename: data.file_attachment.originalname, path: file_url})
      }
      // Send the email to the employees
      await sendEmail(mailOptions);
    }
    return {
      company_branch_id: data.company_branch_id,
      title: data.title,
      description: data.description,
      company_announcement_id: announcement.company_announcement_id,
      file_name: data.file_attachment?.originalname || '',
      file_url: file_url,
      date: announcement.date,
      created_at: announcement.created_at,
    };
  }

  static async ezUpdateAnnouncement(
    data: EzUpdateAnnouncementRequest
  ): Promise<EzUpdateAnnouncementResponse> {
    const request = Validation.validate(
      AnnouncementValidation.EZ_UPDATE_ANNOUNCEMENT,
      data
    );

    const announcement = await prisma.companyAnnouncement.findFirst({
      where: { company_announcement_id: data.company_announcement_id },
    });
    if(!announcement){
      throw new ErrorResponse(
        'Announcement not found', 
        404, 
        [
        'company_announcement_id',
        ],
        "ANNOUNCEMENT_NOT_FOUND"
      );
    }

    await prisma.companyAnnouncement.update({
      where: { company_announcement_id: data.company_announcement_id},
      data: {
        title: data.title,
        description: data.description,
      },
    });

    if(data.file_attachment !== undefined){
      const file_url = pathToFileUrl( data.file_attachment?.path || "", process.env.SERVER_URL || "http://localhost:3000");

      const company_file_id = await prisma.companyAnnouncementFileAttachment.findFirst({
        where: {
          company_announcement_id: data.company_announcement_id,
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
          company_id: announcement.company_id,
          file_name: data.file_attachment?.originalname || '',
          file_size: data.file_attachment?.size || 0,
          file_type: data.file_attachment?.mimetype || '',
          file_url: file_url,
          description: data.description,
        },
      });

      if(!addCompanyFile)
        throw new ErrorResponse(
          'Failed to Update file', 
          400, 
          [
          'Failed_Update_Company_File',
          ],
          "FAILED_UPDATE_COMPANY_FILE"
        );
    }
    return {
      company_announcement_id: data.company_announcement_id,
      company_branch_id: data.company_branch_id,
      title: data.title,
      description: data.description
    };
  }

  static async ezDeleteAnnouncement(
    data:{ 
      company_branch_id: string,
      company_announcement_id: string 
    }) { 
    const isDeleted = await prisma.companyAnnouncement.findFirst({
      where: {
        company_announcement_id: parseInt(data.company_announcement_id),
        company_announcement_to: {
          some: {
            company_branch_id: data.company_branch_id,
          },
        },
      }
    });

    if (!isDeleted) {
      throw new ErrorResponse(
        'Announcement not found',
        404, 
        [
        'company_announcement_id',
        ],
        "ANNOUNCEMENT_NOT_FOUND"
      );
    }

    await prisma.companyAnnouncementTo.deleteMany({
      where: {
        company_announcement_id: parseInt(data.company_announcement_id),
      }
    });
  
    await prisma.companyAnnouncementFileAttachment.deleteMany({
      where: {
        company_announcement_id: parseInt(data.company_announcement_id)
      }
    });
  
    const announcement = await prisma.companyAnnouncement.deleteMany({
      where: {
        company_announcement_id: parseInt(data.company_announcement_id),
      }
    });
  
    return announcement;
  }
}
