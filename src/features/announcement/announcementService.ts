import {
  CompanyAnnouncement,
  CompanyAnnouncementFileAttachment,
  CompanyAnnouncementTo,
} from '@prisma/client';
import { prisma } from '../../applications';
import { ErrorResponse } from '../../models';
import { Validation } from '../../validations';
import {
  CreateAnnouncementRequest,
  CreateAnnouncementResponse,
  UpdateAnnouncementRequest,
} from './announcementModel';
import { AnnouncementValidation } from './announcementValidation';

export class AnnouncementService {
  static async getAnnouncementCompany({
    company_id,
  }: {
    company_id: string;
  }): Promise<CompanyAnnouncement[]> {
    const announcements = await prisma.companyAnnouncement.findMany({
      where: { company_id: company_id },
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

  // static async getAnnouncementCompanyBranch({
  //   company_branch_id,
  // }: {
  //   company_branch_id: string;
  // }): Promise<CompanyAnnouncement[]> {
  //   const announcements = await prisma.companyAnnouncement.findMany({
  //     where: { company_branch_id: company_branch_id },
  //   });

  //   return announcements;
  // }

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

    const announcement = await prisma.companyAnnouncement.create({
      data: {
        ...request,
        company_id: request.company_id,
      },
    });

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

    if (company_branch_id !== undefined && company_branch_id.length > 0) {
      for (let i = 0; i < (company_branch_id ?? []).length; i++) {
        const announcementTo = await prisma.companyAnnouncementTo.create({
          data: {
            company_announcement_id:
              find_company_announcement_id[0]?.company_announcement_id,
            company_branch_id: company_branch_id[i],
          },
        });
      }
    }
    let fileName = '';
    if (file_attachment) {
      console.log(file_attachment);
      const baseFileName = file_attachment?.originalname || '';
      const lastDotIndex = baseFileName.lastIndexOf('.');
      const baseFileNameWithoutExtension = baseFileName.slice(0, lastDotIndex);
      const fileExtension = baseFileName.slice(lastDotIndex + 1);
      
      fileName = baseFileNameWithoutExtension;
      let fileNameWithType = baseFileName;
      let count = 1;
      
      while (true) {
        const name_file = await prisma.companyFile.findMany({
          where: {
            file_name: fileNameWithType,
          },
        });
        
        if (!name_file.length) {
          break;
        }
        
        fileName = baseFileNameWithoutExtension; // Reset nama file
        fileNameWithType = `${fileName}(${count}).${fileExtension}`;
        count++;
      }

      const addCompanyFile = await prisma.companyFile.create({
        data: {
          company_id: request.company_id,
          file_name: fileNameWithType,
          file_size: file_attachment?.size || 0,
          file_type: file_attachment?.mimetype || '',
          file_url: `/uploads/company_file/${fileNameWithType}`,
          description: description,
        },
      });
      const company_file_id = await prisma.companyFile.findMany({
        where: {
          company_id: request.company_id,
          file_name: fileNameWithType,
        },
        select: {
          company_file_id: true,
        },
        orderBy: {
          company_file_id: 'desc',
        },
        take: 1,
      });
      await prisma.companyAnnouncementFileAttachment.create({
        data: {
          company_announcement_id:
          find_company_announcement_id[0]?.company_announcement_id,
          company_file_id: company_file_id[0]?.company_file_id,
        },
      });
      
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
      file_name: fileName,
      company_branch_id: branch_names_str,
    };
  }

  // static async updateAnnouncement(
  //   {
  //     announcement_id,
  //     company_id,
  //   }: {
  //     announcement_id: string;
  //     company_id: string;
  //   },
  //   data: UpdateAnnouncementRequest
  // ): Promise<CompanyAnnouncement> {
  //   const request: UpdateAnnouncementRequest = Validation.validate(
  //     AnnouncementValidation.UPDATE_ANNOUNCEMENT,
  //     data
  //   );

  //   const announcement = await prisma.companyAnnouncement.update({
  //     where: { company_announcement_id: parseInt(announcement_id) },
  //     data: request,
  //   });

  //   return announcement;
  // }

  // static async addAnnouncementTo(
  //   data: CompanyAnnouncementTo
  // ): Promise<CompanyAnnouncementTo> {
  //   const announcementTo = await prisma.companyAnnouncementTo.create({
  //     data,
  //   });

  //   return announcementTo;
  // }

  // static async addAnnouncementFileAttachment(
  //   data: CompanyAnnouncementFileAttachment
  // ): Promise<CompanyAnnouncementFileAttachment> {
  //   const announcementFileAttachment =
  //     await prisma.companyAnnouncementFileAttachment.create({
  //       data,
  //     });

  //   return announcementFileAttachment;
  // }

  static async deleteAnnouncement(
    announcement_id: string,
    company_id: string
  ) {

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
