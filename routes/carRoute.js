import express from 'express';
import { verifyUser, adminOnly, superAdminOnly, adminSuperAdminOnly } from '../middleware/AuthUser.js';
import { getCars, getCarByUuid, createCar, updateCar, deleteCar } from '../controllers/CarController.js';
import multer from 'multer';
import { verifyToken } from '../middleware/VerifyToken.js';

const router = express.Router();
const upload = multer({ dest: 'public/assets/' });

router.get('/api/cars', verifyToken, verifyUser, getCars);
router.get('/api/cars/:uuid', verifyToken, verifyUser, getCarByUuid);
router.post('/api/cars', verifyToken, verifyUser, adminOnly, upload.single('img'), createCar);
router.put('/api/cars/:uuid', verifyToken, verifyUser, adminSuperAdminOnly, upload.single('img'), updateCar);
router.delete('/api/cars/:uuid', verifyToken, verifyUser, adminSuperAdminOnly, deleteCar);

export default router;