import multer from 'multer';
import path from 'path';


const userStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/users');
        },
        filename: (req, file, cb) => {
            const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
            cb(null, uniqueSuffix + path.extname(file.originalname))
        }
        
        })


        const uploadUser = multer({storage:userStorage})


        export default uploadUser;