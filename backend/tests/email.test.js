const emailService = require('../src/services/email');
const sgMail = require('@sendgrid/mail');

// Mock SendGrid
jest.mock('@sendgrid/mail');

describe('Email Service', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('sendEmail', () => {
    it('should send email successfully', async () => {
      sgMail.send.mockResolvedValue([{ statusCode: 202 }]);

      await emailService.sendEmail(
        'test@example.com',
        'Test Subject',
        '<p>Test content</p>',
        'Test content'
      );

      expect(sgMail.send).toHaveBeenCalledWith(
        expect.objectContaining({
          to: 'test@example.com',
          subject: 'Test Subject',
          html: '<p>Test content</p>',
          text: 'Test content'
        })
      );
    });

    it('should handle send errors', async () => {
      sgMail.send.mockRejectedValue(new Error('Send failed'));

      await expect(
        emailService.sendEmail('test@example.com', 'Subject', 'Content')
      ).rejects.toThrow('Send failed');
    });
  });

  describe('sendWelcomeEmail', () => {
    it('should send welcome email with correct data', async () => {
      sgMail.send.mockResolvedValue([{ statusCode: 202 }]);

      const user = {
        firstName: 'John',
        lastName: 'Doe',
        email: 'john@example.com'
      };

      await emailService.sendWelcomeEmail(user);

      expect(sgMail.send).toHaveBeenCalledWith(
        expect.objectContaining({
          to: user.email,
          subject: expect.stringContaining('Welcome')
        })
      );
    });
  });

  describe('sendEnrollmentConfirmation', () => {
    it('should send enrollment confirmation', async () => {
      sgMail.send.mockResolvedValue([{ statusCode: 202 }]);

      const user = { firstName: 'John', email: 'john@example.com' };
      const course = { title: 'Trading 101', id: 1 };

      await emailService.sendEnrollmentConfirmation(user, course);

      expect(sgMail.send).toHaveBeenCalledWith(
        expect.objectContaining({
          to: user.email,
          subject: expect.stringContaining('Enrollment Confirmed')
        })
      );
    });
  });

  describe('sendPaymentConfirmation', () => {
    it('should send payment confirmation with details', async () => {
      sgMail.send.mockResolvedValue([{ statusCode: 202 }]);

      const user = { firstName: 'John', email: 'john@example.com' };
      const payment = {
        amount: 99.99,
        currency: 'USD',
        stripePaymentIntentId: 'pi_123'
      };
      const course = { title: 'Trading 101' };

      await emailService.sendPaymentConfirmation(user, payment, course);

      expect(sgMail.send).toHaveBeenCalledWith(
        expect.objectContaining({
          to: user.email,
          subject: expect.stringContaining('Payment Confirmed')
        })
      );
    });
  });
});
