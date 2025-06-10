const multer = require("multer");
const cloudinary = require("../config/cloudinary");
const { Readable } = require("stream");

const storage = multer.memoryStorage();
const upload = multer({ storage });

const streamUpload = (fileBuffer, folderName) => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder: folderName },
      (error, result) => {
        if (error) reject(error);
        else resolve(result);
      }
    );

    const readable = new Readable();
    readable.push(fileBuffer);
    readable.push(null);
    readable.pipe(stream);
  });
};

module.exports = { upload, streamUpload };
