import { Router } from 'express';
import { AnnouncementController } from './announcementController';
import { upload } from '../../middlewares/multer';
import { JWTMiddleware } from '../../middlewares/jwt_middleware';

const announcementRoute: Router = Router();

announcementRoute.post('/', [
  upload.single('file_attachment'),
  AnnouncementController.addAnnouncement,
]);

announcementRoute.get('/:company_id', [
  AnnouncementController.getAnnouncementCompany,
]);

announcementRoute.get('/:company_id/title', [
  AnnouncementController.getAnnouncementByTitle,
]);

announcementRoute.delete('/company/:company_id/announcement/:announcement_id', AnnouncementController.deleteAnnouncement)


export default announcementRoute;
