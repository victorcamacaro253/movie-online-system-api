import { Router } from "express";
import CompanyInfo from "../controllers/company.js";
const router = Router()

router.get('/',CompanyInfo.getCompanyInfo)

router.post('/',CompanyInfo.addCompany)

router.delete('/:id',CompanyInfo.deleteCompany)

export default router