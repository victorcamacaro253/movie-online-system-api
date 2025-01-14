import ProductionCompanyModel from "../models/productionCompanies.js";

class ProductionCompany {

    static async getAllProductionCompanies(req,res){
        try {
            const productionCompanies = await ProductionCompanyModel.find();
            res.json(productionCompanies);
    }catch(error){
        console.log(error);
        res.status(500).json({message: "Error fetching production companies"});
    }
}


static async getCompanyById(req,res){
    try {
        const {id} = req.params;

        const productionCompany = await ProductionCompanyModel.findById(id);
        if(!company){
            res.status(404).json({message: "Company not found"});
            }
            res.json(productionCompany);
            }catch(error){
                console.log(error);
                res.status(500).json({message: "Error fetching company"});
                }
}

static async addProductionCompany(req,res){
    const {name,description,country,website} = req.body;
    try {
        
      const existingCompany = await ProductionCompanyModel.findOne({name});
      if(existingCompany){
        res.status(400).json({message: "Company already exists"});
        }

        const productionCompany = new ProductionCompanyModel({name,description,country,website});
        await productionCompany.save();
        res.json(productionCompany);
        }catch(error){
            console.log(error);
            res.status(500).json({message: "Error adding company"});
            }
}
static async addMultipleCompanies(req, res) {
    const { companies } = req.body;

    if (!companies || !Array.isArray(companies)) {
        return res.status(400).json({ message: "Invalid input. 'companies' must be an array." });
    }

    try {
        const validCompanies = [];
        const skippedCompanies = [];

        for (const company of companies) {
            // Check if the company already exists
            const existingCompany = await ProductionCompanyModel.findOne({ name: company.name });

            if (existingCompany) {
                // Add to skippedCompanies if it already exists
                skippedCompanies.push({ name: company.name, reason: "Company already exists." });
            } else {
                // Add to the validCompanies array for batch insertion later
                validCompanies.push(company);
            }
        }

        // Insert all valid companies at once
        let insertedCompanies = [];
        if (validCompanies.length > 0) {
            insertedCompanies = await ProductionCompanyModel.insertMany(validCompanies, { ordered: false });
        }

        // Respond with the results
        res.status(200).json({
            message: "Companies processed successfully.",
            insertedCount: insertedCompanies.length,
            skippedCount: skippedCompanies.length,
            insertedCompanies,
            skippedCompanies,
        });
    } catch (error) {
        console.error("Error adding companies:", error);
        res.status(500).json({ message: "Error adding companies." });
    }
}


static async updateCompany(req,res){
    const {id} = req.params
    const {name,description,country,website} = req.body
    try {
        const productionCompany = await ProductionCompanyModel.findByIdAndUpdate(id,{name,description,country,website},{
            new: true,
            runValidators: true
            })
            res.json(productionCompany);
            }catch(error){
                console.log(error);
                res.status(500).json({message: "Error updating company"});
                }

            }


  static async deleteCompany(req,res){
    const {id} = req.params
    try {
       const productionCompany = await ProductionCompanyModel.findByIdAndDelete(id);

       if(!productionCompany){
        res.status(404).json({message: "Production Company not found"});
        
       }

        res.json({message: "Production Company deleted successfully"});
        }catch(error){
            console.log(error);
            res.status(500).json({message: "Error deleting company"});
            }
  }

}

export default ProductionCompany