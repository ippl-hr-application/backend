import { Router } from 'express';
import { DocumentController } from './documentController';
import { upload } from '../../middlewares/multer';
import { JWTMiddleware } from '../../middlewares/jwt_middleware';
import { templateRoute } from '../document-template-management';

const documentRoute: Router = Router();

documentRoute.post('/', [
  JWTMiddleware.verifyToken,
  upload.single('document_file'),
  DocumentController.createDocuments,
]);

documentRoute.use("/template", templateRoute);

documentRoute.get('/:company_id', [
  JWTMiddleware.verifyToken,
  DocumentController.getDocuments,
]);

documentRoute.get('/download/:company_file_id', [
  JWTMiddleware.verifyToken,
  DocumentController.downloadDocument,
]);

documentRoute.patch('/', [
  JWTMiddleware.verifyToken,
  DocumentController.updateDocument,
]);

documentRoute.delete(
  '/:company_id/:company_file_id',
  JWTMiddleware.verifyToken,
  DocumentController.deleteDocument
);


export default documentRoute;