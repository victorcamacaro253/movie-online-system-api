import auditoriumsModel from '../models/auditoriums.js';

class Auditorium {
    static async getAllAuditoriums(req,res){
        try {
            const auditoriums =await auditoriumsModel.find()
            .populate('theater_id')  // Llenar los datos de 'theater_id'

            const total_auditoriums = auditoriums.length;
            res.json({
                total_auditoriums,
                auditoriums});
            } catch (error) {
                console.log(error);
                res.status(500).json({ msg: 'Error in getting auditoriums' });
                }
    }


    static async getAuditoriumsByTheater(req,res){
        try {
            const {theaterId} = req.params;

            const auditoriums = await auditoriumsModel.find({ theater_id: theaterId })
           // .select('seat_layout audio_type screen_type screen_size total_seats')
            .populate('theater_id',"name location total_auditoriums")  // Llenar los datos de 'theater_id

            if (auditoriums.length === 0) {
                return res.status(404).json({ msg: 'No auditoriums found for this theater' });
              }

              const theaterInfo = {
                __id: auditoriums[0].theater_id._id,
                theater: auditoriums[0].theater_id.name,
                location: auditoriums[0].theater_id.location,
                total_auditoriums: auditoriums[0].theater_id.total_auditoriums,
              }

              const auditoriumList = auditoriums.map(auditorium => {
                const {theater_id,...auditoriumData}= auditorium.toObject();
                return auditoriumData;
         } )
           
         res.json({
            theater: theaterInfo,
            auditoriums: auditoriumList,
          });
        
        } catch (error) {
                console.log(error);
                res.status(500).json({ msg: 'Error in getting auditoriums' });
                }


}


static async getAuditoriumById(req,res){
    try {
        const {id} = req.params;
        const auditorium = await auditoriumsModel.findById(id)
        .populate('theater_id',"name location total_auditoriums")
        .select('seat_layout audio_type screen_type screen_size total_seats')
        if (!auditorium) {
            return res.status(404).json({ msg: 'Auditorium not found' });
            }
            res.json(auditorium);
            } catch (error) {
                console.log(error);
                res.status(500).json({ msg: 'Error in getting auditorium' });
                }
                }


                static async createAuditorium(req,res){
                    try {

                        const {
                            auditorium_number,
                            theater_id,
                            seat_layout,
                            audio_type,
                            screen_type,
                            screen_size,
                            total_seats,
                          } = req.body;
                      
                           // Validate required fields
                           if (
                           !auditorium_number ||
                           !theater_id ||
                           !seat_layout ||
                           !audio_type ||
                           !screen_type ||
                            !screen_size ||
                            !total_seats
                          ) {
                           return res.status(400).json({ msg: 'All fields are required' });
                            }

                            // Check if the auditorium number already exists for the given theater
                           const existingAuditorium = await auditoriumsModel.findOne({
                           theater_id,
                            auditorium_number,
                             });
  
                        
                             if (existingAuditorium) {
                                return res.status(400).json({ msg: `Auditorium number ${auditorium_number} already exists for this theater` });
                              }
                              
                              const newAuditorium = new auditoriumsModel({
                                auditorium_number,
                                theater_id,
                                seat_layout,
                                audio_type,
                                screen_type,
                                screen_size,
                                total_seats,
                              });


                              

                              const savedAuditorium = await newAuditorium.save();     
                              
                              res.status(201).json({
                                msg: 'Auditorium created successfully',
                                auditorium: savedAuditorium,
                              });
                                
                                
                                } catch (error) {
                                    console.log(error);
                                    res.status(500).json({ msg: 'Error in creating auditorium' });
                                    }
                                }



                           static async updateAuditorium(req,res){
                            try {
                                const { id } = req.params;
                                const updates= req.body;

                                if(!updates || Object.keys(updates).length === 0){
                                    return res.status(400).json({ msg: 'No updates provided' });
                                } 

                                const updatedAuditorium = await auditoriumsModel.findByIdAndUpdate
                                (id,
                                updates,
                                {new:true,runValidators:true}
                                );

                                if(!updatedAuditorium){
                                    return res.status(404).json({ msg: 'Auditorium not found' });
                                }

                                res.json({ msg: 'Auditorium updated successfully', updatedAuditorium });

                                
                            }catch (error) {
                                    console.log(error);
                                    res.status(500).json({ msg: 'Error in updating auditorium' });
                                    }
                                    }

                                    
                                    static async deleteAuditorium(req,res){
                                        try {
                                            const { id } = req.body;
                                            const deletedAuditorium = await auditoriumsModel.findByIdAndDelete(id);
                                          
                                            if (!deletedAuditorium) {
                                              return res.status(404).json({ msg: 'Auditorium not found' });
                                            }
                                          
                                            res.json({ msg: 'Auditorium deleted successfully' });
                                          } catch (error) {
                                            console.log(error);
                                            res.status(500).json({ msg: 'Error in deleting auditorium' });
                                          }
                                        }
                                    
                                    
                                    }
                                            



export default Auditorium;