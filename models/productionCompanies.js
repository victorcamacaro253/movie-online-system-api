import { Schema,model } from "mongoose";

const productionCompanySchema= new Schema({

    name: {type:String,required:true},

    description: {type:String,required:true},
    
    country : {type:String},
    
    website : {type:String}
    });

    const ProductionCompany = model('production_companies', productionCompanySchema);

    export default ProductionCompany;