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

announcementRoute.get('/:company_id', [
  JWTMiddleware.verifyToken,
  AnnouncementController.getAnnouncementCompany,
]);

announcementRoute.get('/:company_id/:title', [
  JWTMiddleware.verifyToken,
  AnnouncementController.getAnnouncementByTitle,
]);

announcementRoute.get('/download/:company_id/:company_announcement_id', [
  JWTMiddleware.verifyToken,
  AnnouncementController.downloadAnnouncementFile,
]);

announcementRoute.delete('/company/:company_id/announcement/:announcement_id', [
  JWTMiddleware.verifyToken,
  AnnouncementController.deleteAnnouncement,
]);

export default announcementRoute;
