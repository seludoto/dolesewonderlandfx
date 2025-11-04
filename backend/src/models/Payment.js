const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Payment = sequelize.define('Payment', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  userId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'Users',
      key: 'id'
    }
  },
  courseId: {
    type: DataTypes.UUID,
    allowNull: true,
    references: {
      model: 'Courses',
      key: 'id'
    }
  },
  stripePaymentIntentId: {
    type: DataTypes.STRING,
    allowNull: true,
    unique: true
  },
  stripeCustomerId: {
    type: DataTypes.STRING,
    allowNull: true
  },
  amount: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false
  },
  currency: {
    type: DataTypes.STRING(3),
    defaultValue: 'USD'
  },
  status: {
    type: DataTypes.ENUM('pending', 'completed', 'failed', 'refunded', 'cancelled'),
    defaultValue: 'pending'
  },
  paymentMethod: {
    type: DataTypes.ENUM('card', 'bank_transfer', 'paypal', 'crypto'),
    defaultValue: 'card'
  },
  type: {
    type: DataTypes.ENUM('course_purchase', 'subscription', 'refund', 'payout'),
    defaultValue: 'course_purchase'
  },
  description: {
    type: DataTypes.STRING,
    allowNull: true
  },
  metadata: {
    type: DataTypes.JSON,
    defaultValue: {}
  },
  processedAt: {
    type: DataTypes.DATE,
    allowNull: true
  },
  refundedAt: {
    type: DataTypes.DATE,
    allowNull: true
  },
  refundAmount: {
    type: DataTypes.DECIMAL(10, 2),
    defaultValue: 0.00
  },
  refundReason: {
    type: DataTypes.STRING,
    allowNull: true
  },
  fees: {
    type: DataTypes.DECIMAL(8, 2),
    defaultValue: 0.00
  },
  netAmount: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: true
  }
}, {
  indexes: [
    { fields: ['userId'] },
    { fields: ['courseId'] },
    { fields: ['status'] },
    { fields: ['type'] },
    { fields: ['stripePaymentIntentId'] },
    { fields: ['processedAt'] }
  ]
});

// Hooks
Payment.afterCreate(async (payment) => {
  // Calculate net amount after fees
  if (payment.status === 'completed') {
    payment.netAmount = payment.amount - payment.fees;
    await payment.save();
  }
});

Payment.afterUpdate(async (payment) => {
  // Update net amount when status changes to completed
  if (payment.changed('status') && payment.status === 'completed' && !payment.netAmount) {
    payment.netAmount = payment.amount - payment.fees;
    payment.processedAt = new Date();
    await payment.save();
  }

  // Handle refunds
  if (payment.changed('status') && payment.status === 'refunded') {
    payment.refundedAt = new Date();
    await payment.save();
  }
});

// Instance methods
Payment.prototype.processRefund = async function(refundAmount, reason) {
  if (this.status !== 'completed') {
    throw new Error('Can only refund completed payments');
  }

  this.status = 'refunded';
  this.refundAmount = refundAmount;
  this.refundReason = reason;
  this.refundedAt = new Date();

  await this.save();
  return this;
};

Payment.prototype.getTransactionSummary = function() {
  return {
    id: this.id,
    amount: this.amount,
    currency: this.currency,
    status: this.status,
    type: this.type,
    processedAt: this.processedAt,
    netAmount: this.netAmount,
    fees: this.fees
  };
};

module.exports = Payment;