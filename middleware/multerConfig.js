import multer from 'multer';
import path from 'path';


const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        // Determine the destination folder based on the fieldname
        if (file.fieldname === 'poster') {
          cb(null, 'uploads/posters'); // Save posters in 'uploads/posters'
        } else if (file.fieldname === 'images') {
          cb(null, 'uploads/movies'); // Save additional images in 'uploads/images'
        } else {
          cb(new Error('Invalid fieldname'), false); // Handle invalid fieldnames
        }
      },
        filename: (req, file, cb) => {
            const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
            cb(null, uniqueSuffix + path.extname(file.originalname))
        }
        
        })


        const upload = multer({storage})


        export default upload;