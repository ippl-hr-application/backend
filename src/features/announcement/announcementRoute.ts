import { Router } from 'express';
import { AnnouncementController } from './announcementController';
import { upload } from '../../middlewares/multer';
import { JWTMiddleware } from '../../middlewares/jwt_middleware';
import { CompanyMiddleware } from '../../middlewares/company_middleware';

const announcementRoute: Router = Router();

announcementRoute.get('/:company_branch_id/branch', [
  JWTMiddleware.verifyToken,
  CompanyMiddleware.isCompanyBranchBelongsToCompany,
  AnnouncementController.getAnnouncementCompanyBranch,
]);

announcementRoute.post('/create', [
  JWTMiddleware.verifyToken,
  JWTMiddleware.ownerAndManagerOnly,
  // CompanyMiddleware.isCompanyBranchBelongsToCompany,
  upload.single('announcement_file'),
  AnnouncementController.addAnnouncement,
]);

announcementRoute.delete('/company/:company_id/announcement/:announcement_id', [
  JWTMiddleware.verifyToken,
  JWTMiddleware.ownerAndManagerOnly,
  AnnouncementController.deleteAnnouncement,
]);

// announcementRoute.put('/update',[
//   JWTMiddleware.verifyToken,
//   JWTMiddleware.ownerAndManagerOnly,
//   upload.single('announcement_file'),
//   AnnouncementController.updateAnnouncement,
// ])

// versi 1 // versi 1 // versi 1 //
announcementRoute.post('/:company_branch_id/create', [
  JWTMiddleware.verifyToken,
  JWTMiddleware.ownerAndManagerOnly,
  CompanyMiddleware.isCompanyBranchBelongsToCompany,
  upload.single('announcement_file'),
  AnnouncementController.ezCreateAnnouncement,
]);

announcementRoute.put('/:company_branch_id/update/:company_announcement_id', [
  JWTMiddleware.verifyToken,
  JWTMiddleware.ownerAndManagerOnly,
  CompanyMiddleware.isCompanyBranchBelongsToCompany,
  upload.single('announcement_file'),
  AnnouncementController.ezUpdateAnnouncement,
]);

announcementRoute.delete('/:company_branch_id/delete/:company_announcement_id', [
  JWTMiddleware.verifyToken,
  JWTMiddleware.ownerAndManagerOnly,
  CompanyMiddleware.isCompanyBranchBelongsToCompany,
  AnnouncementController.ezDeleteAnnouncement,
]);

export default announcementRoute;
