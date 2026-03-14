import express from 'express';
import { 
  registerCompany, 
  getCompanies, 
  getCompany, 
  updateCompany,
  getCompanyJobs
} from '../controllers/companyController.js';
import { authenticate, authorize } from '../middleware/auth.js';

const router = express.Router();

// Public routes
router.get('/', getCompanies);
router.get('/:id', getCompany);
router.get('/:id/jobs', getCompanyJobs);

// Private routes
router.use(authenticate);
router.post('/', registerCompany); // Initially any user can try to register a company
router.patch('/:id', updateCompany); // Check ownership in controller

export default router;
