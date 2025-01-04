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




}

export default Auditorium;