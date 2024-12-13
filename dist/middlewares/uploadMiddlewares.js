"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const multer_1 = __importDefault(require("multer"));
const path_1 = __importDefault(require("path"));
const createUploadMiddleware = (name) => {
    const storage = multer_1.default.diskStorage({
        destination: (req, file, cb) => {
            const uploadPath = path_1.default.join(__dirname, `../uploads/${name}`);
            cb(null, uploadPath);
        },
        filename: (req, file, cb) => {
            const fileExtension = path_1.default.extname(file.originalname);
            const fileName = `${name}-${Date.now()}${fileExtension}`;
            cb(null, fileName);
        },
    });
    return (0, multer_1.default)({ storage: storage, limits: { fileSize: 52428800 } });
};
exports.default = createUploadMiddleware;
