const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/auth");
const { upload, streamUpload } = require("../utils/fileUploader");

router.post("/", protect, upload.single("image"), async (req, res) => {
  try {
    console.log("REQ.FILE:", req.file);
    if (!req.file || !req.file.buffer) {
      return res.status(400).json({ message: "No image uploaded" });
    }

    const result = await streamUpload(req.file.buffer, "fixmycity");
    res.status(200).json({
      url: result.secure_url,
      public_id: result.public_id,
    });
  } catch (error) {
    console.error("Upload failed:", error);
    res.status(500).json({ message: "Upload failed", error });
  }
});

module.exports = router;
