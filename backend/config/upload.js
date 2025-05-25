import multer from 'multer';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import cloudinary from '../config/cloudinary.js';

const storage = new CloudinaryStorage({
    cloudinary,
    params: {
        folder: 'herbie-products',
        allowed_formats: ['jpg', 'png', 'jpeg'],
        transformation: [{ width: 500, height: 500, crop: 'limit' }],
    },
});

const upload = multer({
    storage,
    limits: {
        fileSize: 2 * 1024 * 1024, // Strict 2MB limit
        files: 5, // Strict 5 files max
    },
    fileFilter: (req, file, cb) => {
        if (!file.mimetype.match(/image\/(png|jpeg|jpg)/)) {
            return cb(new Error('Only PNG, JPG, JPEG images are allowed (max 2MB each)'));
        }
        cb(null, true);
    },
});

export default upload;