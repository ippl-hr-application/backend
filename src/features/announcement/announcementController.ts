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

  static async downloadAnnouncementFile(req: Request, res: Response, next: NextFunction) {
    try {
      const { company_announcement_id, company_id } = req.params;

      const announcementFile = await AnnouncementService.downloadAnnouncementFile({
        company_id: parseInt(company_id),
        company_announcement_id: parseInt(company_announcement_id),
      });
      // const filePath = `${announcementFile[0].company_file.file_url}`;
      const filePath = `./public/${announcementFile}`;
      console.log("ini file path")
      res.download(filePath, (err) => {
        if (err) {
          next(err);
        }
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

  static async deleteAnnouncement(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { company_id, announcement_id } = req.params;
      await AnnouncementService.deleteAnnouncement(
        announcement_id,
        company_id,
      );

      res.status(200).json({
        status: 'success',
        message: 'Announcement deleted successfully',
      });
    } catch (error) {
      next(error);
    }
  }

  static async getAnnouncementByTitle(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { company_id, title } = req.params;
      const announcement = await AnnouncementService.getAnnouncementByTitle({
        company_id,
        title
      });

      res.status(200).json({
        status: 'success',
        data: announcement,
      });
    } catch (error) {
      next(error);
    }
  }
}
