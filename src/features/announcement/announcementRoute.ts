import { Router } from 'express';
import { AnnouncementController } from './announcementController';
import { upload } from '../../middlewares/multer';
import { JWTMiddleware } from '../../middlewares/jwt_middleware';

const announcementRoute: Router = Router();

announcementRoute.post('/', [
  upload.single('announcement_file'),
  JWTMiddleware.verifyToken,
  AnnouncementController.addAnnouncement,
]);

announcementRoute.get('/hq', [
  JWTMiddleware.verifyToken,
  AnnouncementController.getAnnouncementCompany,
]);

announcementRoute.get('/branch', [
  JWTMiddleware.verifyToken,
  AnnouncementController.getAnnouncementCompanyBranch,
]);

announcementRoute.get('/download/:company_id/:company_announcement_id', [
  JWTMiddleware.verifyToken,
  AnnouncementController.downloadAnnouncementFile,
]);

announcementRoute.delete('/company/:company_id/announcement/:announcement_id', [
  JWTMiddleware.verifyToken,
  AnnouncementController.deleteAnnouncement,
]);

announcementRoute.put('/update',[
  upload.single('announcement_file'),
  JWTMiddleware.verifyToken,
  AnnouncementController.updateAnnouncement,
])
export default announcementRoute;
