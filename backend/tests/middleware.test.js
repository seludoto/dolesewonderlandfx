const { authenticate } = require('../src/middleware/auth');
const jwt = require('jsonwebtoken');
const { User } = require('../src/models');

jest.mock('jsonwebtoken');
jest.mock('../src/models');

describe('Auth Middleware', () => {
  let req, res, next;

  beforeEach(() => {
    req = {
      header: jest.fn()
    };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };
    next = jest.fn();
    jest.clearAllMocks();
  });

  describe('authenticate', () => {
    it('should authenticate valid token', async () => {
      const mockUser = {
        id: 1,
        email: 'test@example.com',
        role: 'student'
      };

      req.header.mockReturnValue('Bearer valid_token');
      jwt.verify.mockReturnValue({ userId: 1 });
      User.findByPk = jest.fn().mockResolvedValue(mockUser);

      await authenticate(req, res, next);

      expect(req.user).toEqual(mockUser);
      expect(next).toHaveBeenCalled();
    });

    it('should reject missing token', async () => {
      req.header.mockReturnValue(null);

      await authenticate(req, res, next);

      expect(res.status).toHaveBeenCalledWith(401);
      expect(next).not.toHaveBeenCalled();
    });

    it('should reject invalid token', async () => {
      req.header.mockReturnValue('Bearer invalid_token');
      jwt.verify.mockImplementation(() => {
        throw new Error('Invalid token');
      });

      await authenticate(req, res, next);

      expect(res.status).toHaveBeenCalledWith(401);
      expect(next).not.toHaveBeenCalled();
    });

    it('should reject if user not found', async () => {
      req.header.mockReturnValue('Bearer valid_token');
      jwt.verify.mockReturnValue({ userId: 999 });
      User.findByPk = jest.fn().mockResolvedValue(null);

      await authenticate(req, res, next);

      expect(res.status).toHaveBeenCalledWith(401);
      expect(next).not.toHaveBeenCalled();
    });
  });
});
