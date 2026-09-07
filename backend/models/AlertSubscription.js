import mongoose from 'mongoose';

// ============================================================
// ALERT SUBSCRIPTION MODEL — Government Job Notifications
// ============================================================
// Stores user WhatsApp numbers, emails, and subscribed categories
// for real-time and daily notification dispatches.
// ============================================================

const alertSubscriptionSchema = new mongoose.Schema({
  whatsapp: {
    type: String,
    required: [true, 'WhatsApp phone number is required'],
    trim: true,
    index: true
  },
  email: {
    type: String,
    trim: true,
    lowercase: true,
    index: true
  },
  categories: {
    type: [String],
    default: ['ap_state', 'central', 'banking', 'railways'],
    index: true
  },
  userId: {
    type: String,
    trim: true,
    index: true
  },
  active: {
    type: Boolean,
    default: true,
    index: true
  },
  lastNotifiedAt: {
    type: Date
  }
}, {
  timestamps: true
});

// Avoid duplicates for same whatsapp number + email combination
alertSubscriptionSchema.index({ whatsapp: 1, email: 1 }, { unique: true });

export default mongoose.model('AlertSubscription', alertSubscriptionSchema);
