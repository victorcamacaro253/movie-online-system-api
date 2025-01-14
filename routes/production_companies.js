import { Router } from "express";
import ProductionCompany from "../controllers/productionCompanies";
const router = Router();


router.get('/',ProductionCompany.getAllProductionCompanies)

router.get('/:id',ProductionCompany.getCompanyById)

router.post('/',ProductionCompany.addProductionCompany)

router.post("/multiple",ProductionCompany.addMultipleCompanies)

router.put('/:id',ProductionCompany.updateCompany)

router.delete('/:id',ProductionCompany.deleteCompany)


export default router;