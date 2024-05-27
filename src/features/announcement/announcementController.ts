import { Request, Response, NextFunction } from 'express';
import { AnnouncementService } from './announcementService';
import { EmployeeToken, UserToken } from '../../models';
import { User } from 'aws-sdk/clients/budgets';

export class AnnouncementController {
  static async getAnnouncementCompanyBranch(req: Request, res: Response, next: NextFunction) {
    try {
      const company_branch_id_token = res.locals.user.company_branch_id as EmployeeToken;
      const company_branch_id = String(req.params.company_branch_id || company_branch_id_token);
      const title = req.query.title as string;
      const announcements = await AnnouncementService.getAnnouncementCompanyBranch({
        company_branch_id,
        title,
        page: parseInt(req.query.page as string) || 1,
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

  static async addAnnouncement(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { title, description, company_branch_id} = req.body;
      const { company_id } = res.locals.user as EmployeeToken | UserToken;
      const file_attachment: Express.Multer.File | undefined = req.file;
      const announcement = await AnnouncementService.createAnnouncementAndNotifyEmployees({
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
      const { company_announcement_id } = req.body;
      const { company_id, employee_id } = res.locals.user as EmployeeToken | UserToken;
      await AnnouncementService.deleteAnnouncement(
        employee_id,
        company_announcement_id,
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
        company_announcement_id,
        title,
        description,
        company_branch_id_add,
        company_branch_id_remove 
      } = req.body;
      const { company_id } = res.locals.user as EmployeeToken | UserToken;
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
// ============================EZ===================================EZ===============
  static async ezCreateAnnouncement(req: Request, res: Response, next: NextFunction) {
    try {
      const { title, description } = req.body;
      const company_branch_id = req.params.company_branch_id;
      const file_attachment: Express.Multer.File | undefined = req.file;
      const announcement = await AnnouncementService.ezCreateAnnouncementAndNotifyEmployees({
        company_branch_id,
        title,
        description,
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

  static async ezUpdateAnnouncement(req: Request, res: Response, next: NextFunction) {
    try {
      const { title, description } = req.body;
      const company_branch_id = req.params.company_branch_id;
      const company_announcement_id = req.params.company_announcement_id;
      const file_attachment: Express.Multer.File | undefined = req.file;
      const announcement = await AnnouncementService.ezUpdateAnnouncement({
        company_branch_id,
        company_announcement_id: parseInt(company_announcement_id),
        title,
        description,
        file_attachment,
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

  static async ezDeleteAnnouncement(req: Request, res: Response, next: NextFunction) {
    try {
      const { company_branch_id, company_announcement_id } = req.params;
      await AnnouncementService.ezDeleteAnnouncement({
        company_announcement_id,
        company_branch_id
      });

      res.status(200).json({
        status: 'success',
        message: 'Announcement deleted successfully',
      });
    } catch (error) {
      next(error);
    }
  }
};