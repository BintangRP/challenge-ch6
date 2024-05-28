import express from 'express';
import { verifyUser, adminOnly, superAdminOnly, adminSuperAdminOnly } from '../middleware/AuthUser.js';
import { getCars, getCarByUuid, createCar, updateCar, deleteCar } from '../controllers/CarController.js';
import multer from 'multer';
import { verifyToken } from '../middleware/VerifyToken.js';

const router = express.Router();
// const upload = multer({ dest: 'public/assets/' });
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "./public/assets");
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname);
    },
});
const upload = multer({ storage: storage });

router.get('/api/cars', verifyToken, verifyUser, getCars);
router.get('/api/cars/:uuid', verifyToken, verifyUser, getCarByUuid);
router.post('/api/cars', verifyToken, verifyUser, adminSuperAdminOnly, upload.single('img'), createCar);
router.put('/api/cars/:uuid', verifyToken, verifyUser, adminSuperAdminOnly, upload.single('img'), updateCar);
router.delete('/api/cars/:uuid', verifyToken, verifyUser, adminSuperAdminOnly, deleteCar);

export default router;