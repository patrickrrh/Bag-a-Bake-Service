import multer from 'multer';
import path from 'path';

const createUploadMiddleware = (name: string) => {
    const storage = multer.diskStorage({
        destination: (req, file, cb) => {
            const uploadPath = path.join(__dirname, `../uploads/${name}`);
            cb(null, uploadPath);
        },
        filename: (req, file, cb) => {
            const fileExtension = path.extname(file.originalname);
            const fileName = `${name}-${Date.now()}${fileExtension}`;
            cb(null, fileName);
          },
    });

    return multer({ storage: storage, limits: { fileSize: 52428800 } });
}

export default createUploadMiddleware;
