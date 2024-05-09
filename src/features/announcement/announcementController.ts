import { Request, Response, NextFunction } from 'express';
import { AnnouncementService } from './announcementService';
import { EmployeeToken } from '../../models';

export class AnnouncementController {
  // Get announcement company branch by company_branch_id from token employee
  static async getAnnouncementCompany(req: Request, res: Response, next: NextFunction) {
    try {
      const { company_branch_id } = res.locals.user ;
      const title = req.query.title as string;
      const announcements = await AnnouncementService.getAnnouncementCompany({
        company_branch_id,
        title,
      });
      
      res.status(200).json({
        status: 'success',
        message: 'Announcement from HQ retrieved successfully',
        data: announcements,
      });
    } catch (error) {
      next(error);
    }
  }

  static async getAnnouncementCompanyBranch(req: Request, res: Response, next: NextFunction) {
    try {
      const company_branch_id_token = res.locals.user.company_branch_id as EmployeeToken;
      const company_branch_id = String(req.params.company_branch_id || company_branch_id_token);
      const title = req.query.title as string;
      const announcements = await AnnouncementService.getAnnouncementCompanyBranch({
        company_branch_id,
        title
      });

      res.status(200).json({
        status: 'success getAnnouncementCompanyBranch',
        message: 'Announcement from branch retrieved successfully',
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

  static async updateAnnouncement(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { 
        company_id,
        company_announcement_id,
        title,
        description,
        company_branch_id_add,
        company_branch_id_remove 
      } = req.body;
      const file_attachment: Express.Multer.File | undefined = req.file;
      const announcement = await AnnouncementService.updateAnnouncement({
        company_id,
        company_announcement_id: parseInt(company_announcement_id),
        title,
        description,
        file_attachment,
        company_branch_id_add,
        company_branch_id_remove,
      });

      res.status(200).json({
        status: 'success',
        message: 'Announcement updated successfully',
        data: announcement,
      });
    } catch (error) {
      next(error);
    }
  }
};