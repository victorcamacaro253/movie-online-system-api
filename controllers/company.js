import Company from '../models/company.js'

class CompanyInfo {

    static async getCompanyInfo(req,res){
        
        try{

            const company = await Company.find()

            if(!company){

                return res.status(404).json({message:'Company not found'})

                }

                 res.status(200).json(company)

                }
                catch(error){
                    console.log(error)
                    return res.status(500).json({message:error.message})
                    }

             }

             static async addCompany(req, res) {
                const {
                    name,
                    description,
                    headquarters,
                    email,
                    phone,
                    total_theaters,
                    total_employees,
                    organizational_chart,
                    social_media
                } = req.body;
            
                try {
                    // Create a new company instance with the provided data
                    const company = new Company({
                        name,
                        description,
                        headquarters,
                        email,
                        phone,
                        total_theaters,
                        total_employees,
                        organizational_chart,
                        social_media
                    });
            
                    // Save the company to the database
                    await company.save();
            
                    // Respond with the created company data
                    res.status(201).json(company);
                } catch (error) {
                    console.log(error);
                    return res.status(500).json({ message: error.message });
                }
            }
             

            static async deleteCompany(req,res){
                const {id} = req.params
                try{
                    const company = await Company.findByIdAndDelete(id)
                    if(!company){
                        return res.status(404).json({message:"Company not found"})
                        }
                        res.status(200).json({message:"Company deleted successfully"})
                        } catch(error){
                            console.log(error)
                            return res.status(500).json({message:error.message})
                            }
            }
    
}

export default CompanyInfo