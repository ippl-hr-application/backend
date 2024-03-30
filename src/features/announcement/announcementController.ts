import { Request, Response, NextFunction } from 'express';
import { AnnouncementService } from './announcementService';

export class AnnouncementController {
  static async getAnnouncementCompany(req: Request, res: Response, next: NextFunction) {
    try {
      const announcements = await AnnouncementService.getAnnouncementCompany({
        company_id: req.params.company_id,
      });

      res.status(200).json({
        status: 'success',
        data: announcements,
      });
    } catch (error) {
      next(error);
    }
  }

  // static async getAnnouncementCompanyBranch(req: Request, res: Response, next: NextFunction) {
  //   try {
  //     const announcements = await AnnouncementService.getAnnouncementCompanyBranch({
  //       company_branch_id: req.params.company_branch_id,
  //     });

  //     res.status(200).json({
  //       status: 'success',
  //       data: announcements,
  //     });
  //   } catch (error) {
  //     next(error);
  //   }
  // }

  static async addAnnouncement(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { company_id, title, description, company_branch_id } = req.body;
      const file_attachment: Express.Multer.File | undefined = req.file;
      const announcement = await AnnouncementService.addAnnouncement({
        company_id,
        title,
        description,
        company_branch_id,
        file_attachment,
      });

      res.status(201).json({
        status: 'success',
        data: {
          ...announcement,
        },
        message: 'Announcement created successfully',
      });
    } catch (error) {
      next(error);
    }
  }
}
