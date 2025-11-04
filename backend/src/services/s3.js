const AWS = require('aws-sdk');
const logger = require('../utils/logger');
const crypto = require('crypto');
const path = require('path');

// Configure AWS SDK
const s3 = new AWS.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION || 'us-east-1'
});

const bucketName = process.env.AWS_S3_BUCKET;

/**
 * Generate unique filename with timestamp and random hash
 */
const generateUniqueFilename = (originalName) => {
  const timestamp = Date.now();
  const randomHash = crypto.randomBytes(8).toString('hex');
  const ext = path.extname(originalName);
  const baseName = path.basename(originalName, ext)
    .toLowerCase()
    .replace(/[^a-z0-9]/g, '-')
    .substring(0, 50);
  
  return `${baseName}-${timestamp}-${randomHash}${ext}`;
};

/**
 * Upload file to S3
 * @param {Buffer} fileBuffer - File buffer
 * @param {string} originalName - Original filename
 * @param {string} mimeType - File MIME type
 * @param {string} folder - S3 folder path (e.g., 'courses', 'avatars', 'videos')
 * @returns {Promise<Object>} Upload result with URL and key
 */
const uploadFile = async (fileBuffer, originalName, mimeType, folder = 'uploads') => {
  try {
    const filename = generateUniqueFilename(originalName);
    const key = `${folder}/${filename}`;

    const params = {
      Bucket: bucketName,
      Key: key,
      Body: fileBuffer,
      ContentType: mimeType,
      ACL: 'public-read', // Make files publicly accessible
      Metadata: {
        originalName,
        uploadedAt: new Date().toISOString()
      }
    };

    const result = await s3.upload(params).promise();

    logger.info(`File uploaded to S3: ${key}`);

    return {
      success: true,
      url: result.Location,
      key: result.Key,
      bucket: result.Bucket,
      filename
    };
  } catch (error) {
    logger.error('S3 upload error:', error);
    throw new Error(`Failed to upload file: ${error.message}`);
  }
};

/**
 * Upload multiple files to S3
 * @param {Array} files - Array of file objects with buffer, name, and mimeType
 * @param {string} folder - S3 folder path
 * @returns {Promise<Array>} Array of upload results
 */
const uploadMultipleFiles = async (files, folder = 'uploads') => {
  try {
    const uploadPromises = files.map(file =>
      uploadFile(file.buffer, file.name, file.mimeType, folder)
    );

    const results = await Promise.all(uploadPromises);
    return results;
  } catch (error) {
    logger.error('Multiple S3 upload error:', error);
    throw new Error(`Failed to upload files: ${error.message}`);
  }
};

/**
 * Delete file from S3
 * @param {string} key - S3 object key
 * @returns {Promise<boolean>} Success status
 */
const deleteFile = async (key) => {
  try {
    const params = {
      Bucket: bucketName,
      Key: key
    };

    await s3.deleteObject(params).promise();
    logger.info(`File deleted from S3: ${key}`);

    return true;
  } catch (error) {
    logger.error('S3 delete error:', error);
    throw new Error(`Failed to delete file: ${error.message}`);
  }
};

/**
 * Delete multiple files from S3
 * @param {Array<string>} keys - Array of S3 object keys
 * @returns {Promise<boolean>} Success status
 */
const deleteMultipleFiles = async (keys) => {
  try {
    const params = {
      Bucket: bucketName,
      Delete: {
        Objects: keys.map(key => ({ Key: key })),
        Quiet: false
      }
    };

    const result = await s3.deleteObjects(params).promise();
    logger.info(`${result.Deleted.length} files deleted from S3`);

    return true;
  } catch (error) {
    logger.error('Multiple S3 delete error:', error);
    throw new Error(`Failed to delete files: ${error.message}`);
  }
};

/**
 * Generate presigned URL for temporary access to private files
 * @param {string} key - S3 object key
 * @param {number} expiresIn - URL expiration time in seconds (default: 1 hour)
 * @returns {Promise<string>} Presigned URL
 */
const getPresignedUrl = async (key, expiresIn = 3600) => {
  try {
    const params = {
      Bucket: bucketName,
      Key: key,
      Expires: expiresIn
    };

    const url = await s3.getSignedUrlPromise('getObject', params);
    logger.info(`Presigned URL generated for: ${key}`);

    return url;
  } catch (error) {
    logger.error('Presigned URL error:', error);
    throw new Error(`Failed to generate presigned URL: ${error.message}`);
  }
};

/**
 * Generate presigned POST for direct browser uploads
 * @param {string} folder - S3 folder path
 * @param {string} filename - Desired filename
 * @param {string} contentType - File MIME type
 * @param {number} expiresIn - URL expiration time in seconds (default: 5 minutes)
 * @returns {Promise<Object>} Presigned POST data
 */
const getPresignedPost = async (folder, filename, contentType, expiresIn = 300) => {
  try {
    const key = `${folder}/${generateUniqueFilename(filename)}`;

    const params = {
      Bucket: bucketName,
      Fields: {
        key,
        'Content-Type': contentType
      },
      Expires: expiresIn,
      Conditions: [
        ['content-length-range', 0, 104857600], // Max 100MB
        ['starts-with', '$Content-Type', contentType.split('/')[0]]
      ]
    };

    const presignedPost = await s3.createPresignedPost(params);
    logger.info(`Presigned POST generated for: ${key}`);

    return {
      ...presignedPost,
      key
    };
  } catch (error) {
    logger.error('Presigned POST error:', error);
    throw new Error(`Failed to generate presigned POST: ${error.message}`);
  }
};

/**
 * Check if file exists in S3
 * @param {string} key - S3 object key
 * @returns {Promise<boolean>} Existence status
 */
const fileExists = async (key) => {
  try {
    await s3.headObject({
      Bucket: bucketName,
      Key: key
    }).promise();

    return true;
  } catch (error) {
    if (error.code === 'NotFound') {
      return false;
    }
    throw error;
  }
};

/**
 * Get file metadata
 * @param {string} key - S3 object key
 * @returns {Promise<Object>} File metadata
 */
const getFileMetadata = async (key) => {
  try {
    const result = await s3.headObject({
      Bucket: bucketName,
      Key: key
    }).promise();

    return {
      contentType: result.ContentType,
      contentLength: result.ContentLength,
      lastModified: result.LastModified,
      etag: result.ETag,
      metadata: result.Metadata
    };
  } catch (error) {
    logger.error('Get file metadata error:', error);
    throw new Error(`Failed to get file metadata: ${error.message}`);
  }
};

/**
 * List files in a folder
 * @param {string} folder - S3 folder path
 * @param {number} maxKeys - Maximum number of keys to return
 * @returns {Promise<Array>} Array of file objects
 */
const listFiles = async (folder, maxKeys = 1000) => {
  try {
    const params = {
      Bucket: bucketName,
      Prefix: folder,
      MaxKeys: maxKeys
    };

    const result = await s3.listObjectsV2(params).promise();

    return result.Contents.map(item => ({
      key: item.Key,
      size: item.Size,
      lastModified: item.LastModified,
      etag: item.ETag
    }));
  } catch (error) {
    logger.error('List files error:', error);
    throw new Error(`Failed to list files: ${error.message}`);
  }
};

/**
 * Copy file within S3
 * @param {string} sourceKey - Source object key
 * @param {string} destinationKey - Destination object key
 * @returns {Promise<Object>} Copy result
 */
const copyFile = async (sourceKey, destinationKey) => {
  try {
    const params = {
      Bucket: bucketName,
      CopySource: `${bucketName}/${sourceKey}`,
      Key: destinationKey
    };

    const result = await s3.copyObject(params).promise();
    logger.info(`File copied from ${sourceKey} to ${destinationKey}`);

    return {
      success: true,
      etag: result.CopyObjectResult.ETag,
      key: destinationKey
    };
  } catch (error) {
    logger.error('Copy file error:', error);
    throw new Error(`Failed to copy file: ${error.message}`);
  }
};

module.exports = {
  uploadFile,
  uploadMultipleFiles,
  deleteFile,
  deleteMultipleFiles,
  getPresignedUrl,
  getPresignedPost,
  fileExists,
  getFileMetadata,
  listFiles,
  copyFile,
  s3,
  bucketName
};
