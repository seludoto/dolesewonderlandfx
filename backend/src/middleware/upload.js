const multer = require('multer');
const path = require('path');

// File type validators
const imageFileFilter = (req, file, cb) => {
  const allowedMimes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
  
  if (allowedMimes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Invalid file type. Only JPEG, PNG, GIF, and WebP images are allowed.'), false);
  }
};

const videoFileFilter = (req, file, cb) => {
  const allowedMimes = ['video/mp4', 'video/mpeg', 'video/quicktime', 'video/x-msvideo', 'video/webm'];
  
  if (allowedMimes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Invalid file type. Only MP4, MPEG, MOV, AVI, and WebM videos are allowed.'), false);
  }
};

const documentFileFilter = (req, file, cb) => {
  const allowedMimes = [
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/vnd.ms-excel',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'application/vnd.ms-powerpoint',
    'application/vnd.openxmlformats-officedocument.presentationml.presentation',
    'text/plain'
  ];
  
  if (allowedMimes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Invalid file type. Only PDF, Word, Excel, PowerPoint, and text files are allowed.'), false);
  }
};

const allContentFileFilter = (req, file, cb) => {
  const allowedMimes = [
    // Images
    'image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp',
    // Videos
    'video/mp4', 'video/mpeg', 'video/quicktime', 'video/x-msvideo', 'video/webm',
    // Documents
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/vnd.ms-excel',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'application/vnd.ms-powerpoint',
    'application/vnd.openxmlformats-officedocument.presentationml.presentation',
    'text/plain',
    // Archives
    'application/zip',
    'application/x-rar-compressed'
  ];
  
  if (allowedMimes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Invalid file type. Please upload a supported file format.'), false);
  }
};

// Storage configuration - use memory storage for S3 uploads
const storage = multer.memoryStorage();

// File size limits
const limits = {
  avatar: 5 * 1024 * 1024, // 5MB for avatars
  image: 10 * 1024 * 1024, // 10MB for course images
  video: 500 * 1024 * 1024, // 500MB for videos
  document: 50 * 1024 * 1024, // 50MB for documents
  content: 500 * 1024 * 1024 // 500MB for general content
};

// Upload configurations
const uploadAvatar = multer({
  storage,
  fileFilter: imageFileFilter,
  limits: { fileSize: limits.avatar }
}).single('avatar');

const uploadCourseImage = multer({
  storage,
  fileFilter: imageFileFilter,
  limits: { fileSize: limits.image }
}).single('image');

const uploadCourseThumbnail = multer({
  storage,
  fileFilter: imageFileFilter,
  limits: { fileSize: limits.image }
}).single('thumbnail');

const uploadCourseVideo = multer({
  storage,
  fileFilter: videoFileFilter,
  limits: { fileSize: limits.video }
}).single('video');

const uploadCourseDocument = multer({
  storage,
  fileFilter: documentFileFilter,
  limits: { fileSize: limits.document }
}).single('document');

const uploadCourseContent = multer({
  storage,
  fileFilter: allContentFileFilter,
  limits: { fileSize: limits.content }
}).single('file');

const uploadMultipleCourseContent = multer({
  storage,
  fileFilter: allContentFileFilter,
  limits: { fileSize: limits.content }
}).array('files', 10); // Max 10 files at once

// Error handler middleware
const handleUploadError = (err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    if (err.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({
        success: false,
        message: 'File too large. Please check the file size limits.'
      });
    }
    if (err.code === 'LIMIT_FILE_COUNT') {
      return res.status(400).json({
        success: false,
        message: 'Too many files. Maximum 10 files allowed at once.'
      });
    }
    if (err.code === 'LIMIT_UNEXPECTED_FILE') {
      return res.status(400).json({
        success: false,
        message: 'Unexpected field in file upload.'
      });
    }
  }

  if (err) {
    return res.status(400).json({
      success: false,
      message: err.message || 'File upload error'
    });
  }

  next();
};

module.exports = {
  uploadAvatar,
  uploadCourseImage,
  uploadCourseThumbnail,
  uploadCourseVideo,
  uploadCourseDocument,
  uploadCourseContent,
  uploadMultipleCourseContent,
  handleUploadError
};
