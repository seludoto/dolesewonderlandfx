const sgMail = require('@sendgrid/mail');
const logger = require('../utils/logger');

// Initialize SendGrid
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const fromEmail = process.env.FROM_EMAIL || 'noreply@instructorportal.com';
const fromName = process.env.FROM_NAME || 'Instructor Portal';

/**
 * Send email using SendGrid
 * @param {Object} options - Email options
 * @returns {Promise<boolean>}
 */
const sendEmail = async (options) => {
  try {
    const msg = {
      to: options.email,
      from: {
        email: fromEmail,
        name: fromName
      },
      subject: options.subject,
      text: options.message,
      html: options.html || options.message
    };

    await sgMail.send(msg);
    logger.info(`Email sent to: ${options.email}`);
    return true;
  } catch (error) {
    logger.error('SendGrid error:', error);
    throw new Error(`Failed to send email: ${error.message}`);
  }
};

/**
 * Send welcome email to new users
 */
const sendWelcomeEmail = async (user) => {
  const subject = 'Welcome to DoleSe Wonderland FX!';
  const message = `
    Hi ${user.firstName},

    Welcome to DoleSe Wonderland FX - Your Trading Education Platform!

    We're excited to have you join our community of traders and learners.

    ${user.role === 'instructor' ? 
      'As an instructor, you can now start creating courses and sharing your knowledge with students worldwide.' :
      'Start exploring our courses and begin your trading education journey today!'
    }

    Get started: ${process.env.FRONTEND_URL}

    If you have any questions, feel free to reach out to our support team.

    Best regards,
    The DoleSe Wonderland FX Team
  `;

  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #2563eb;">Welcome to DoleSe Wonderland FX!</h2>
      <p>Hi ${user.firstName},</p>
      <p>Welcome to DoleSe Wonderland FX - Your Trading Education Platform!</p>
      <p>We're excited to have you join our community of traders and learners.</p>
      ${user.role === 'instructor' ? 
        '<p>As an instructor, you can now start creating courses and sharing your knowledge with students worldwide.</p>' :
        '<p>Start exploring our courses and begin your trading education journey today!</p>'
      }
      <div style="margin: 30px 0;">
        <a href="${process.env.FRONTEND_URL}" style="background-color: #2563eb; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; display: inline-block;">Get Started</a>
      </div>
      <p>If you have any questions, feel free to reach out to our support team.</p>
      <p style="margin-top: 30px;">Best regards,<br>The DoleSe Wonderland FX Team</p>
    </div>
  `;

  return await sendEmail({
    email: user.email,
    subject,
    message,
    html
  });
};

/**
 * Send course enrollment confirmation
 */
const sendEnrollmentConfirmation = async (user, course) => {
  const subject = `You're enrolled in ${course.title}!`;
  const message = `
    Hi ${user.firstName},

    Great news! You've successfully enrolled in "${course.title}".

    You can now access all course materials, videos, and resources.

    Start learning: ${process.env.FRONTEND_URL}/courses/${course.id}

    Happy learning!

    Best regards,
    The DoleSe Wonderland FX Team
  `;

  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #2563eb;">You're Enrolled!</h2>
      <p>Hi ${user.firstName},</p>
      <p>Great news! You've successfully enrolled in <strong>"${course.title}"</strong>.</p>
      ${course.thumbnail ? `<img src="${course.thumbnail}" alt="${course.title}" style="max-width: 100%; border-radius: 8px; margin: 20px 0;">` : ''}
      <p>You can now access all course materials, videos, and resources.</p>
      <div style="margin: 30px 0;">
        <a href="${process.env.FRONTEND_URL}/courses/${course.id}" style="background-color: #2563eb; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; display: inline-block;">Start Learning</a>
      </div>
      <p>Happy learning!</p>
      <p style="margin-top: 30px;">Best regards,<br>The DoleSe Wonderland FX Team</p>
    </div>
  `;

  return await sendEmail({
    email: user.email,
    subject,
    message,
    html
  });
};

/**
 * Send course completion certificate
 */
const sendCourseCompletionEmail = async (user, course, certificateUrl) => {
  const subject = `Congratulations! You've completed ${course.title}`;
  const message = `
    Hi ${user.firstName},

    Congratulations! You've successfully completed "${course.title}".

    ${certificateUrl ? `Download your certificate: ${certificateUrl}` : ''}

    Keep up the great work and continue your learning journey!

    Best regards,
    The DoleSe Wonderland FX Team
  `;

  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #10b981;">🎉 Congratulations!</h2>
      <p>Hi ${user.firstName},</p>
      <p>Congratulations! You've successfully completed <strong>"${course.title}"</strong>.</p>
      ${certificateUrl ? `
        <div style="margin: 30px 0;">
          <a href="${certificateUrl}" style="background-color: #10b981; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; display: inline-block;">Download Certificate</a>
        </div>
      ` : ''}
      <p>Keep up the great work and continue your learning journey!</p>
      <p style="margin-top: 30px;">Best regards,<br>The DoleSe Wonderland FX Team</p>
    </div>
  `;

  return await sendEmail({
    email: user.email,
    subject,
    message,
    html
  });
};

/**
 * Send payment confirmation
 */
const sendPaymentConfirmation = async (user, course, payment) => {
  const subject = `Payment confirmed for ${course.title}`;
  const message = `
    Hi ${user.firstName},

    Your payment for "${course.title}" has been confirmed.

    Payment Details:
    - Amount: ${payment.currency} ${payment.amount}
    - Transaction ID: ${payment.id}
    - Date: ${new Date(payment.processedAt).toLocaleDateString()}

    You now have full access to the course.

    Start learning: ${process.env.FRONTEND_URL}/courses/${course.id}

    Best regards,
    The DoleSe Wonderland FX Team
  `;

  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #2563eb;">Payment Confirmed!</h2>
      <p>Hi ${user.firstName},</p>
      <p>Your payment for <strong>"${course.title}"</strong> has been confirmed.</p>
      <div style="background-color: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0;">
        <h3 style="margin-top: 0;">Payment Details</h3>
        <p><strong>Amount:</strong> ${payment.currency} ${payment.amount}</p>
        <p><strong>Transaction ID:</strong> ${payment.id}</p>
        <p><strong>Date:</strong> ${new Date(payment.processedAt).toLocaleDateString()}</p>
      </div>
      <p>You now have full access to the course.</p>
      <div style="margin: 30px 0;">
        <a href="${process.env.FRONTEND_URL}/courses/${course.id}" style="background-color: #2563eb; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; display: inline-block;">Start Learning</a>
      </div>
      <p style="margin-top: 30px;">Best regards,<br>The DoleSe Wonderland FX Team</p>
    </div>
  `;

  return await sendEmail({
    email: user.email,
    subject,
    message,
    html
  });
};

/**
 * Send refund confirmation
 */
const sendRefundConfirmation = async (user, course, payment) => {
  const subject = `Refund processed for ${course.title}`;
  const message = `
    Hi ${user.firstName},

    Your refund for "${course.title}" has been processed.

    Refund Details:
    - Amount: ${payment.currency} ${payment.refundAmount}
    - Original Transaction: ${payment.id}
    - Refund Date: ${new Date().toLocaleDateString()}

    The refund will be credited to your original payment method within 5-10 business days.

    If you have any questions, please contact our support team.

    Best regards,
    The DoleSe Wonderland FX Team
  `;

  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #2563eb;">Refund Processed</h2>
      <p>Hi ${user.firstName},</p>
      <p>Your refund for <strong>"${course.title}"</strong> has been processed.</p>
      <div style="background-color: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0;">
        <h3 style="margin-top: 0;">Refund Details</h3>
        <p><strong>Amount:</strong> ${payment.currency} ${payment.refundAmount}</p>
        <p><strong>Original Transaction:</strong> ${payment.id}</p>
        <p><strong>Refund Date:</strong> ${new Date().toLocaleDateString()}</p>
      </div>
      <p>The refund will be credited to your original payment method within 5-10 business days.</p>
      <p>If you have any questions, please contact our support team.</p>
      <p style="margin-top: 30px;">Best regards,<br>The DoleSe Wonderland FX Team</p>
    </div>
  `;

  return await sendEmail({
    email: user.email,
    subject,
    message,
    html
  });
};

/**
 * Send new enrollment notification to instructor
 */
const sendNewEnrollmentNotification = async (instructor, student, course) => {
  const subject = `New student enrolled in ${course.title}`;
  const message = `
    Hi ${instructor.firstName},

    Great news! ${student.firstName} ${student.lastName} has enrolled in your course "${course.title}".

    View student details: ${process.env.FRONTEND_URL}/instructor/students

    Keep up the great work!

    Best regards,
    The DoleSe Wonderland FX Team
  `;

  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #2563eb;">New Student Enrolled!</h2>
      <p>Hi ${instructor.firstName},</p>
      <p>Great news! <strong>${student.firstName} ${student.lastName}</strong> has enrolled in your course <strong>"${course.title}"</strong>.</p>
      <div style="margin: 30px 0;">
        <a href="${process.env.FRONTEND_URL}/instructor/students" style="background-color: #2563eb; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; display: inline-block;">View Student Details</a>
      </div>
      <p>Keep up the great work!</p>
      <p style="margin-top: 30px;">Best regards,<br>The DoleSe Wonderland FX Team</p>
    </div>
  `;

  return await sendEmail({
    email: instructor.email,
    subject,
    message,
    html
  });
};

/**
 * Send course published notification to instructor
 */
const sendCoursePublishedNotification = async (instructor, course) => {
  const subject = `Your course "${course.title}" is now published!`;
  const message = `
    Hi ${instructor.firstName},

    Congratulations! Your course "${course.title}" has been published and is now live on our platform.

    Students can now enroll and start learning from your course.

    View your course: ${process.env.FRONTEND_URL}/courses/${course.id}

    Best regards,
    The DoleSe Wonderland FX Team
  `;

  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #10b981;">🎉 Course Published!</h2>
      <p>Hi ${instructor.firstName},</p>
      <p>Congratulations! Your course <strong>"${course.title}"</strong> has been published and is now live on our platform.</p>
      <p>Students can now enroll and start learning from your course.</p>
      <div style="margin: 30px 0;">
        <a href="${process.env.FRONTEND_URL}/courses/${course.id}" style="background-color: #10b981; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; display: inline-block;">View Your Course</a>
      </div>
      <p style="margin-top: 30px;">Best regards,<br>The DoleSe Wonderland FX Team</p>
    </div>
  `;

  return await sendEmail({
    email: instructor.email,
    subject,
    message,
    html
  });
};

/**
 * Send password reset email
 */
const sendPasswordResetEmail = async (user, resetToken) => {
  const resetUrl = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`;
  const subject = 'Password Reset Request';
  const message = `
    Hi ${user.firstName},

    You requested to reset your password.

    Please click the link below to reset your password:
    ${resetUrl}

    This link will expire in 1 hour.

    If you didn't request this, please ignore this email.

    Best regards,
    The DoleSe Wonderland FX Team
  `;

  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #2563eb;">Password Reset Request</h2>
      <p>Hi ${user.firstName},</p>
      <p>You requested to reset your password.</p>
      <p>Please click the button below to reset your password:</p>
      <div style="margin: 30px 0;">
        <a href="${resetUrl}" style="background-color: #2563eb; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; display: inline-block;">Reset Password</a>
      </div>
      <p><small>This link will expire in 1 hour.</small></p>
      <p>If you didn't request this, please ignore this email.</p>
      <p style="margin-top: 30px;">Best regards,<br>The DoleSe Wonderland FX Team</p>
    </div>
  `;

  return await sendEmail({
    email: user.email,
    subject,
    message,
    html
  });
};

/**
 * Send email verification
 */
const sendEmailVerification = async (user, verificationToken) => {
  const verifyUrl = `${process.env.FRONTEND_URL}/verify-email/${verificationToken}`;
  const subject = 'Verify Your Email Address';
  const message = `
    Hi ${user.firstName},

    Please verify your email address by clicking the link below:
    ${verifyUrl}

    This link will expire in 24 hours.

    If you didn't create an account, please ignore this email.

    Best regards,
    The DoleSe Wonderland FX Team
  `;

  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #2563eb;">Verify Your Email</h2>
      <p>Hi ${user.firstName},</p>
      <p>Please verify your email address by clicking the button below:</p>
      <div style="margin: 30px 0;">
        <a href="${verifyUrl}" style="background-color: #2563eb; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; display: inline-block;">Verify Email</a>
      </div>
      <p><small>This link will expire in 24 hours.</small></p>
      <p>If you didn't create an account, please ignore this email.</p>
      <p style="margin-top: 30px;">Best regards,<br>The DoleSe Wonderland FX Team</p>
    </div>
  `;

  return await sendEmail({
    email: user.email,
    subject,
    message,
    html
  });
};

module.exports = {
  sendEmail,
  sendWelcomeEmail,
  sendEnrollmentConfirmation,
  sendCourseCompletionEmail,
  sendPaymentConfirmation,
  sendRefundConfirmation,
  sendNewEnrollmentNotification,
  sendCoursePublishedNotification,
  sendPasswordResetEmail,
  sendEmailVerification
};
