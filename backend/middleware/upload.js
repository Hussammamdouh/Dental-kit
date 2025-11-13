const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Check if we're in a serverless environment (Vercel, AWS Lambda, etc.)
// In Vercel, the filesystem is read-only except for /tmp
// Vercel sets VERCEL=1 automatically, so we check for that first
const isServerless = !!process.env.VERCEL || !!process.env.AWS_LAMBDA_FUNCTION_NAME;

// Configure storage based on environment
let storage;
if (isServerless) {
  // Use memory storage in serverless environments (Vercel, Lambda, etc.)
  // Files will be in req.file.buffer and should be uploaded directly to Cloudinary
  console.log('📦 Using memory storage (serverless environment)');
  storage = multer.memoryStorage();
} else {
  // Use disk storage in local development
  console.log('💾 Attempting to use disk storage (local development)');
  const uploadDir = path.join(__dirname, '../uploads');
  
  // Double-check we're not in serverless before trying to create directory
  if (!process.env.VERCEL && !process.env.AWS_LAMBDA_FUNCTION_NAME) {
    try {
      if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir, { recursive: true });
      }
      // Use disk storage if directory creation succeeded
      storage = multer.diskStorage({
        destination: (req, file, cb) => {
          cb(null, uploadDir);
        },
        filename: (req, file, cb) => {
          const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
          cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
        }
      });
      console.log('✅ Disk storage configured successfully');
    } catch (error) {
      console.warn('⚠️  Could not create uploads directory:', error.message);
      // Fall back to memory storage if directory creation fails
      console.log('📦 Falling back to memory storage due to filesystem restrictions');
      storage = multer.memoryStorage();
    }
  } else {
    // Safety fallback: use memory storage if somehow we got here in serverless
    console.log('📦 Using memory storage (serverless detected in else block)');
    storage = multer.memoryStorage();
  }
}

// File filter for images
const fileFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png|webp|gif/;
  const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = allowedTypes.test(file.mimetype);

  if (mimetype && extname) {
    return cb(null, true);
  } else {
    cb(new Error('Only image files are allowed!'), false);
  }
};

// Configure multer
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
    files: 10, // Maximum 10 files
  },
  fileFilter: fileFilter,
});

// Single image upload
const uploadSingle = upload.single('image');

// Multiple images upload
const uploadMultiple = upload.array('images', 10);

// Error handling middleware
const handleUploadError = (err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    if (err.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({ message: 'File too large. Maximum size is 5MB.' });
    }
    if (err.code === 'LIMIT_FILE_COUNT') {
      return res.status(400).json({ message: 'Too many files. Maximum is 10 files.' });
    }
    if (err.code === 'LIMIT_UNEXPECTED_FILE') {
      return res.status(400).json({ message: 'Unexpected file field.' });
    }
  }
  
  if (err.message === 'Only image files are allowed!') {
    return res.status(400).json({ message: err.message });
  }
  
  next(err);
};

// Clean up uploaded files (only needed for disk storage, not memory storage)
const cleanupUploads = (req, res, next) => {
  if (!isServerless) {
    // Only cleanup disk files in local development
    res.on('finish', () => {
      if (req.files) {
        req.files.forEach(file => {
          if (file.path && fs.existsSync && fs.existsSync(file.path)) {
            try {
              fs.unlinkSync(file.path);
            } catch (error) {
              console.warn('⚠️  Could not delete file:', error.message);
            }
          }
        });
      } else if (req.file && req.file.path) {
        if (fs.existsSync && fs.existsSync(req.file.path)) {
          try {
            fs.unlinkSync(req.file.path);
          } catch (error) {
            console.warn('⚠️  Could not delete file:', error.message);
          }
        }
      }
    });
  }
  next();
};

module.exports = {
  uploadSingle,
  uploadMultiple,
  handleUploadError,
  cleanupUploads,
  upload, // Export the main upload instance
}; 