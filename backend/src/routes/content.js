const express = require('express');
const { body, validationResult } = require('express-validator');
const { protect, authorize } = require('../middleware/auth');
const {
  uploadCourseImage,
  uploadCourseThumbnail,
  uploadCourseVideo,
  uploadCourseDocument,
  uploadCourseContent,
  uploadMultipleCourseContent,
  handleUploadError
} = require('../middleware/upload');
const {
  uploadFile,
  uploadMultipleFiles,
  deleteFile,
  getPresignedUrl,
  getPresignedPost
} = require('../services/s3');
const { Course, User } = require('../models');
const logger = require('../utils/logger');

const router = express.Router();

// @desc    Upload course thumbnail
// @route   POST /api/content/course/:courseId/thumbnail
// @access  Private (Instructor/Admin)
router.post('/course/:courseId/thumbnail',
  protect,
  authorize('instructor', 'admin'),
  uploadCourseThumbnail,
  handleUploadError,
  async (req, res) => {
    try {
      const { courseId } = req.params;

      // Check if file was uploaded
      if (!req.file) {
        return res.status(400).json({
          success: false,
          message: 'Please upload a thumbnail image'
        });
      }

      // Check course ownership
      const course = await Course.findByPk(courseId);
      if (!course) {
        return res.status(404).json({
          success: false,
          message: 'Course not found'
        });
      }

      if (course.instructorId !== req.user.id && req.user.role !== 'admin') {
        return res.status(403).json({
          success: false,
          message: 'Not authorized to upload content for this course'
        });
      }

      // Delete old thumbnail if exists
      if (course.thumbnail) {
        try {
          const oldKey = course.thumbnail.split('.com/')[1];
          if (oldKey) await deleteFile(oldKey);
        } catch (error) {
          logger.warn('Failed to delete old thumbnail:', error);
        }
      }

      // Upload to S3
      const result = await uploadFile(
        req.file.buffer,
        req.file.originalname,
        req.file.mimetype,
        'courses/thumbnails'
      );

      // Update course
      course.thumbnail = result.url;
      await course.save();

      logger.info(`Course thumbnail uploaded: ${courseId}`);

      res.status(200).json({
        success: true,
        data: {
          url: result.url,
          key: result.key,
          course: {
            id: course.id,
            thumbnail: course.thumbnail
          }
        }
      });
    } catch (error) {
      logger.error('Upload course thumbnail error:', error);
      res.status(500).json({
        success: false,
        message: 'Server error'
      });
    }
  }
);

// @desc    Upload course trailer video
// @route   POST /api/content/course/:courseId/trailer
// @access  Private (Instructor/Admin)
router.post('/course/:courseId/trailer',
  protect,
  authorize('instructor', 'admin'),
  uploadCourseVideo,
  handleUploadError,
  async (req, res) => {
    try {
      const { courseId } = req.params;

      if (!req.file) {
        return res.status(400).json({
          success: false,
          message: 'Please upload a video file'
        });
      }

      const course = await Course.findByPk(courseId);
      if (!course) {
        return res.status(404).json({
          success: false,
          message: 'Course not found'
        });
      }

      if (course.instructorId !== req.user.id && req.user.role !== 'admin') {
        return res.status(403).json({
          success: false,
          message: 'Not authorized to upload content for this course'
        });
      }

      // Delete old trailer if exists
      if (course.trailerVideo) {
        try {
          const oldKey = course.trailerVideo.split('.com/')[1];
          if (oldKey) await deleteFile(oldKey);
        } catch (error) {
          logger.warn('Failed to delete old trailer:', error);
        }
      }

      // Upload to S3
      const result = await uploadFile(
        req.file.buffer,
        req.file.originalname,
        req.file.mimetype,
        'courses/trailers'
      );

      // Update course
      course.trailerVideo = result.url;
      await course.save();

      logger.info(`Course trailer uploaded: ${courseId}`);

      res.status(200).json({
        success: true,
        data: {
          url: result.url,
          key: result.key,
          course: {
            id: course.id,
            trailerVideo: course.trailerVideo
          }
        }
      });
    } catch (error) {
      logger.error('Upload course trailer error:', error);
      res.status(500).json({
        success: false,
        message: 'Server error'
      });
    }
  }
);

// @desc    Upload course content (single file)
// @route   POST /api/content/course/:courseId/content
// @access  Private (Instructor/Admin)
router.post('/course/:courseId/content',
  protect,
  authorize('instructor', 'admin'),
  uploadCourseContent,
  handleUploadError,
  async (req, res) => {
    try {
      const { courseId } = req.params;
      const { type = 'document', title, description } = req.body;

      if (!req.file) {
        return res.status(400).json({
          success: false,
          message: 'Please upload a file'
        });
      }

      const course = await Course.findByPk(courseId);
      if (!course) {
        return res.status(404).json({
          success: false,
          message: 'Course not found'
        });
      }

      if (course.instructorId !== req.user.id && req.user.role !== 'admin') {
        return res.status(403).json({
          success: false,
          message: 'Not authorized to upload content for this course'
        });
      }

      // Determine folder based on type
      const folderMap = {
        video: 'courses/videos',
        document: 'courses/documents',
        image: 'courses/images',
        other: 'courses/content'
      };
      const folder = folderMap[type] || 'courses/content';

      // Upload to S3
      const result = await uploadFile(
        req.file.buffer,
        req.file.originalname,
        req.file.mimetype,
        folder
      );

      logger.info(`Course content uploaded: ${courseId} - ${type}`);

      res.status(200).json({
        success: true,
        data: {
          url: result.url,
          key: result.key,
          filename: result.filename,
          type: req.file.mimetype,
          size: req.file.size,
          title: title || req.file.originalname,
          description
        }
      });
    } catch (error) {
      logger.error('Upload course content error:', error);
      res.status(500).json({
        success: false,
        message: 'Server error'
      });
    }
  }
);

// @desc    Upload multiple course content files
// @route   POST /api/content/course/:courseId/content/bulk
// @access  Private (Instructor/Admin)
router.post('/course/:courseId/content/bulk',
  protect,
  authorize('instructor', 'admin'),
  uploadMultipleCourseContent,
  handleUploadError,
  async (req, res) => {
    try {
      const { courseId } = req.params;

      if (!req.files || req.files.length === 0) {
        return res.status(400).json({
          success: false,
          message: 'Please upload at least one file'
        });
      }

      const course = await Course.findByPk(courseId);
      if (!course) {
        return res.status(404).json({
          success: false,
          message: 'Course not found'
        });
      }

      if (course.instructorId !== req.user.id && req.user.role !== 'admin') {
        return res.status(403).json({
          success: false,
          message: 'Not authorized to upload content for this course'
        });
      }

      // Prepare files for upload
      const files = req.files.map(file => ({
        buffer: file.buffer,
        name: file.originalname,
        mimeType: file.mimetype,
        size: file.size
      }));

      // Upload all files to S3
      const results = await uploadMultipleFiles(files, 'courses/content');

      logger.info(`Multiple course content uploaded: ${courseId} - ${files.length} files`);

      res.status(200).json({
        success: true,
        data: {
          files: results.map((result, index) => ({
            url: result.url,
            key: result.key,
            filename: result.filename,
            originalName: req.files[index].originalname,
            type: req.files[index].mimetype,
            size: req.files[index].size
          })),
          count: results.length
        }
      });
    } catch (error) {
      logger.error('Upload multiple content error:', error);
      res.status(500).json({
        success: false,
        message: 'Server error'
      });
    }
  }
);

// @desc    Upload user avatar
// @route   POST /api/content/avatar
// @access  Private
router.post('/avatar',
  protect,
  require('../middleware/upload').uploadAvatar,
  handleUploadError,
  async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({
          success: false,
          message: 'Please upload an avatar image'
        });
      }

      const user = await User.findByPk(req.user.id);

      // Delete old avatar if exists
      if (user.avatar) {
        try {
          const oldKey = user.avatar.split('.com/')[1];
          if (oldKey) await deleteFile(oldKey);
        } catch (error) {
          logger.warn('Failed to delete old avatar:', error);
        }
      }

      // Upload to S3
      const result = await uploadFile(
        req.file.buffer,
        req.file.originalname,
        req.file.mimetype,
        'users/avatars'
      );

      // Update user
      user.avatar = result.url;
      await user.save();

      logger.info(`User avatar uploaded: ${user.id}`);

      res.status(200).json({
        success: true,
        data: {
          url: result.url,
          key: result.key,
          user: {
            id: user.id,
            avatar: user.avatar
          }
        }
      });
    } catch (error) {
      logger.error('Upload avatar error:', error);
      res.status(500).json({
        success: false,
        message: 'Server error'
      });
    }
  }
);

// @desc    Delete content file
// @route   DELETE /api/content/:key
// @access  Private (Instructor/Admin)
router.delete('/:key(*)',
  protect,
  authorize('instructor', 'admin'),
  async (req, res) => {
    try {
      const key = req.params.key;

      // Verify ownership if not admin
      if (req.user.role !== 'admin') {
        // Check if file belongs to user's course
        const courses = await Course.findAll({
          where: { instructorId: req.user.id }
        });

        const hasAccess = courses.some(course =>
          course.thumbnail?.includes(key) || course.trailerVideo?.includes(key)
        );

        if (!hasAccess && !req.user.avatar?.includes(key)) {
          return res.status(403).json({
            success: false,
            message: 'Not authorized to delete this file'
          });
        }
      }

      await deleteFile(key);

      logger.info(`File deleted: ${key} by ${req.user.email}`);

      res.status(200).json({
        success: true,
        message: 'File deleted successfully'
      });
    } catch (error) {
      logger.error('Delete content error:', error);
      res.status(500).json({
        success: false,
        message: 'Server error'
      });
    }
  }
);

// @desc    Get presigned URL for private file access
// @route   GET /api/content/presigned/:key
// @access  Private
router.get('/presigned/:key(*)',
  protect,
  async (req, res) => {
    try {
      const key = req.params.key;
      const expiresIn = parseInt(req.query.expires) || 3600; // Default 1 hour

      const url = await getPresignedUrl(key, expiresIn);

      res.status(200).json({
        success: true,
        data: {
          url,
          expiresIn
        }
      });
    } catch (error) {
      logger.error('Get presigned URL error:', error);
      res.status(500).json({
        success: false,
        message: 'Server error'
      });
    }
  }
);

// @desc    Get presigned POST for direct browser upload
// @route   POST /api/content/presigned-post
// @access  Private (Instructor/Admin)
router.post('/presigned-post',
  protect,
  authorize('instructor', 'admin'),
  [
    body('filename').notEmpty().withMessage('Filename is required'),
    body('contentType').notEmpty().withMessage('Content type is required'),
    body('folder').optional().isString()
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          message: 'Validation failed',
          errors: errors.array()
        });
      }

      const { filename, contentType, folder = 'uploads' } = req.body;

      const presignedPost = await getPresignedPost(folder, filename, contentType);

      res.status(200).json({
        success: true,
        data: presignedPost
      });
    } catch (error) {
      logger.error('Get presigned POST error:', error);
      res.status(500).json({
        success: false,
        message: 'Server error'
      });
    }
  }
);

module.exports = router;