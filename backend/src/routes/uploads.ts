/* eslint-disable @typescript-eslint/no-explicit-any */
// import dotenv from "dotenv-flow";
// dotenv.config();
import express from "express";
import path from "path";
import multer, { FileFilterCallback } from "multer";
import aws from "aws-sdk";
import multerS3 from "multer-s3";
const router = express.Router();

console.log(process.env.BUCKET);

type FileNameCallback = (error: Error | null, filename: string) => void;
type RequestWithFile = Express.Request & {
  file: Express.Multer.File & { location: string };
};

aws.config.update({
  secretAccessKey: process.env.AWS_KEY,
  accessKeyId: process.env.AWS_KEY_ID,
  region: process.env.AWS_REGION
});
const s3 = new aws.S3();
const storage = multerS3({
  s3: s3,
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  bucket: process.env.BUCKET!,
  key: (
    req: Express.Request,
    file: Express.Multer.File,
    cb: FileNameCallback
  ) => {
    cb(
      null,
      `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`
    );
  }
});

function checkFileType(file: Express.Multer.File, cb: any) {
  const fileTypes = /jpeg|jpg|png|pdf|docx|doc|webp/;
  const extname = fileTypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = fileTypes.test(file.mimetype);

  if (extname && mimetype) {
    return cb(null, true);
  } else {
    cb("Images Only!");
  }
}
const upload = multer({
  storage,
  fileFilter: function (
    req: Express.Request,
    file: Express.Multer.File,
    cb: FileFilterCallback
  ) {
    checkFileType(file, cb);
  }
});

router.post("/", upload.any(), (req: RequestWithFile, res: any) => {
  const files = req.files as unknown as (File & { location: string })[];
  try {
    res.send(files.map((file) => file.location));
  } catch (error) {
    console.log(error);
  }
});
export default router;
