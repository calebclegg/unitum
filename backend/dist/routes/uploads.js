"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
/* eslint-disable @typescript-eslint/no-explicit-any */
// import dotenv from "dotenv-flow";
// dotenv.config();
const express_1 = __importDefault(require("express"));
const path_1 = __importDefault(require("path"));
const multer_1 = __importDefault(require("multer"));
const aws_sdk_1 = __importDefault(require("aws-sdk"));
const multer_s3_1 = __importDefault(require("multer-s3"));
const router = express_1.default.Router();
console.log(process.env.BUCKET);
aws_sdk_1.default.config.update({
    secretAccessKey: process.env.AWS_KEY,
    accessKeyId: process.env.AWS_KEY_ID,
    region: process.env.AWS_REGION
});
const s3 = new aws_sdk_1.default.S3();
const storage = (0, multer_s3_1.default)({
    s3: s3,
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    bucket: process.env.BUCKET,
    key: (req, file, cb) => {
        cb(null, `${file.fieldname}-${Date.now()}${path_1.default.extname(file.originalname)}`);
    }
});
function checkFileType(file, cb) {
    const fileTypes = /jpeg|jpg|png|pdf|docx|doc|webp/;
    const extname = fileTypes.test(path_1.default.extname(file.originalname).toLowerCase());
    const mimetype = fileTypes.test(file.mimetype);
    if (extname && mimetype) {
        return cb(null, true);
    }
    else {
        cb("Images Only!");
    }
}
const upload = (0, multer_1.default)({
    storage,
    fileFilter: function (req, file, cb) {
        checkFileType(file, cb);
    }
});
router.post("/", upload.any(), (req, res) => {
    const files = req.files;
    try {
        res.send(files.map((file) => file.location));
    }
    catch (error) {
        console.log(error);
    }
});
exports.default = router;
