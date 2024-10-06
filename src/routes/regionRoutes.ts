import express from 'express';
import { RegionController } from '../controllers/regionController';

const router = express.Router();

const regionController = new RegionController();

router.get("/get/region", regionController.findRegion);

export default router;

