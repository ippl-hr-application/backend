import { Router } from 'express';
import { AnnouncementController } from './announcementController';
import { upload } from '../../middlewares/multer';
import { JWTMiddleware } from '../../middlewares/jwt_middleware';
import { CompanyMiddleware } from '../../middlewares/company_middleware';

const announcementRoute: Router = Router();

announcementRoute.post('/create', [
  JWTMiddleware.verifyToken,
  JWTMiddleware.ownerAndManagerOnly,
  upload.single('announcement_file'),
  AnnouncementController.addAnnouncement,
]);

announcementRoute.post('/create', [
  JWTMiddleware.verifyToken,
  upload.single('announcement_file'),
  AnnouncementController.addAnnouncement,
]);

announcementRoute.get('/branch', [
  JWTMiddleware.verifyToken,
  AnnouncementController.getAnnouncementCompanyBranch,
]);

announcementRoute.get('/:company_branch_id/branch', [
  JWTMiddleware.verifyToken,
  AnnouncementController.getAnnouncementCompanyBranch,
]);

announcementRoute.delete('/company/:company_id/announcement/:announcement_id', [
  JWTMiddleware.verifyToken,
  AnnouncementController.deleteAnnouncement,
]);

// still have some bug
announcementRoute.put('/update',[
  upload.single('announcement_file'),
  JWTMiddleware.verifyToken,
  AnnouncementController.updateAnnouncement,
])

// versi ez

announcementRoute.post('/:company_branch_id/create', [
  JWTMiddleware.verifyToken,
  upload.single('announcement_file'),
  AnnouncementController.ezCreateAnnouncement,
]);

announcementRoute.put('/:company_branch_id/update/:company_announcement_id', [
  JWTMiddleware.verifyToken,
  upload.single('announcement_file'),
  AnnouncementController.ezUpdateAnnouncement,
]);

export default announcementRoute;
