// middleware/upload.js
import multer from "multer";
import path from "path";
import fs from "fs";

const uploadDir = "uploads/";
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// ✅ Fayl nomini tozalash funksiyasi
const sanitizeFileName = (filename) => {
  return filename.replace(/[^a-zA-Z0-9.-]/g, "_").replace(/\s+/g, "_");
};

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname);
    const baseName = path.basename(file.originalname, ext);
    const safeName = sanitizeFileName(baseName);
    cb(null, uniqueSuffix + "-" + safeName + ext);
  },
});

// ✅ Ruxsat etilgan fayl turlari (.html qo'shilgan)
const fileFilter = (req, file, cb) => {
  // Barcha fayl turlariga ruxsat berish
  cb(null, true);
};

// ✅ 20MB limit
const MAX_FILE_SIZE = 20 * 1024 * 1024; // 20MB

export const upload = multer({
  storage,
  limits: {
    fileSize: MAX_FILE_SIZE,
    files: 10,
  },
  fileFilter,
});

// ✅ Error handling middleware for multer
export const handleMulterError = (err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    if (err.code === "FILE_TOO_LARGE") {
      return res.status(400).json({
        success: false,
        message: `Fayl hajmi 20MB dan katta`,
      });
    }
    if (err.code === "LIMIT_FILE_COUNT") {
      return res.status(400).json({
        success: false,
        message: "Bir vaqtda 10 tadan ko'p fayl yuklab bo'lmaydi",
      });
    }
    if (err.code === "LIMIT_UNEXPECTED_FILE") {
      return res.status(400).json({
        success: false,
        message: "Kutilmagan fayl nomi",
      });
    }
    return res.status(400).json({
      success: false,
      message: `Yuklash xatoligi: ${err.message}`,
    });
  }

  if (err) {
    return res.status(400).json({
      success: false,
      message: err.message || "Fayl yuklashda xatolik",
    });
  }

  next();
};

// ✅ Qo'shimcha: Faylni o'chirish uchun yordamchi funksiya
export const deleteFile = (filePath) => {
  if (filePath && fs.existsSync(filePath)) {
    try {
      fs.unlinkSync(filePath);
      return true;
    } catch (error) {
      console.error("Faylni o'chirishda xatolik:", error);
      return false;
    }
  }
  return false;
};

// ✅ Qo'shimcha: Fayl hajmini tekshirish
export const getFileSize = (filePath) => {
  if (filePath && fs.existsSync(filePath)) {
    const stats = fs.statSync(filePath);
    return stats.size;
  }
  return 0;
};

// ✅ Qo'shimcha: Fayl turini aniqlash (.html qo'shilgan)
export const getFileType = (filePath) => {
  const ext = path.extname(filePath).toLowerCase();
  const mimeTypes = {
    ".html": "text/html",
    ".htm": "text/html",
    ".pdf": "application/pdf",
    ".doc": "application/msword",
    ".docx":
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ".xls": "application/vnd.ms-excel",
    ".xlsx":
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    ".ppt": "application/vnd.ms-powerpoint",
    ".pptx":
      "application/vnd.openxmlformats-officedocument.presentationml.presentation",
    ".jpg": "image/jpeg",
    ".jpeg": "image/jpeg",
    ".png": "image/png",
    ".gif": "image/gif",
    ".webp": "image/webp",
    ".mp4": "video/mp4",
    ".mp3": "audio/mpeg",
    ".zip": "application/zip",
    ".rar": "application/x-rar-compressed",
    ".7z": "application/x-7z-compressed",
    ".txt": "text/plain",
    ".epub": "application/epub+zip",
    ".mobi": "application/x-mobipocket-ebook",
    ".json": "application/json",
    ".xml": "application/xml",
    ".css": "text/css",
    ".js": "application/javascript",
  };
  return mimeTypes[ext] || "application/octet-stream";
};
