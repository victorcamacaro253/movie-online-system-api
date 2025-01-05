import multer from 'multer';
import path from 'path';


const actorStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/actors');
        },
        filename: (req, file, cb) => {
            const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
            cb(null, uniqueSuffix + path.extname(file.originalname))
        }
        
        })


        const uploadActor = multer({storage:actorStorage})


        export default uploadActor;