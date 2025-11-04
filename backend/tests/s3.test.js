const { s3Service } = require('../src/services/s3');
const { S3 } = require('aws-sdk');

// Mock AWS SDK
jest.mock('aws-sdk', () => {
  const mockS3Instance = {
    upload: jest.fn().mockReturnThis(),
    deleteObject: jest.fn().mockReturnThis(),
    deleteObjects: jest.fn().mockReturnThis(),
    getSignedUrl: jest.fn(),
    headObject: jest.fn().mockReturnThis(),
    listObjectsV2: jest.fn().mockReturnThis(),
    copyObject: jest.fn().mockReturnThis(),
    promise: jest.fn()
  };

  return {
    S3: jest.fn(() => mockS3Instance)
  };
});

describe('S3 Service', () => {
  let s3Instance;

  beforeEach(() => {
    s3Instance = new S3();
    jest.clearAllMocks();
  });

  describe('uploadFile', () => {
    it('should upload file to S3', async () => {
      const mockFile = {
        buffer: Buffer.from('test content'),
        mimetype: 'image/jpeg'
      };

      const mockUploadResult = {
        Location: 'https://bucket.s3.amazonaws.com/test-file.jpg',
        Key: 'test-file.jpg',
        Bucket: 'test-bucket'
      };

      s3Instance.upload().promise.mockResolvedValue(mockUploadResult);

      const result = await s3Service.uploadFile(mockFile, 'test-folder');

      expect(result).toHaveProperty('url');
      expect(result).toHaveProperty('key');
      expect(s3Instance.upload).toHaveBeenCalledWith(
        expect.objectContaining({
          Body: mockFile.buffer,
          ContentType: mockFile.mimetype
        })
      );
    });

    it('should handle upload errors', async () => {
      const mockFile = {
        buffer: Buffer.from('test'),
        mimetype: 'image/jpeg'
      };

      s3Instance.upload().promise.mockRejectedValue(new Error('Upload failed'));

      await expect(s3Service.uploadFile(mockFile, 'test'))
        .rejects.toThrow('Upload failed');
    });
  });

  describe('deleteFile', () => {
    it('should delete file from S3', async () => {
      s3Instance.deleteObject().promise.mockResolvedValue({});

      await s3Service.deleteFile('test-file.jpg');

      expect(s3Instance.deleteObject).toHaveBeenCalledWith(
        expect.objectContaining({
          Key: 'test-file.jpg'
        })
      );
    });
  });

  describe('getPresignedUrl', () => {
    it('should generate presigned URL', async () => {
      const mockUrl = 'https://bucket.s3.amazonaws.com/test-file.jpg?signature=abc';
      s3Instance.getSignedUrl.mockReturnValue(mockUrl);

      const url = await s3Service.getPresignedUrl('test-file.jpg', 3600);

      expect(url).toBe(mockUrl);
      expect(s3Instance.getSignedUrl).toHaveBeenCalledWith(
        'getObject',
        expect.objectContaining({
          Key: 'test-file.jpg',
          Expires: 3600
        })
      );
    });
  });
});
