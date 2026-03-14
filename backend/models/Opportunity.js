import mongoose from 'mongoose';

// ============================================================
// OPPORTUNITY MODEL — Unified Career Hub Entity
// ============================================================
// Supports: jobs, internships, and places in a single collection.
// Designed for 100k+ records with compound indexes and TTL expiry.
// ============================================================

const opportunitySchema = new mongoose.Schema({
  // ── Core Identity ──────────────────────────────────────────
  title: {
    type: String,
    required: [true, 'Title is required'],
    trim: true,
    maxlength: [300, 'Title cannot exceed 300 characters'],
    index: true
  },
  organization: {
    type: String,
    required: [true, 'Organization is required'],
    trim: true,
    maxlength: [200, 'Organization cannot exceed 200 characters'],
    index: true
  },

  // ── Type Discriminator ─────────────────────────────────────
  // Single field that allows the frontend to filter by category.
  type: {
    type: String,
    required: [true, 'Opportunity type is required'],
    enum: {
      values: ['job', 'internship', 'place'],
      message: '{VALUE} is not a valid opportunity type'
    },
    index: true
  },

  // ── Location ───────────────────────────────────────────────
  location: {
    type: String,
    required: [true, 'Location is required'],
    trim: true,
    index: true
  },

  // ── Details ────────────────────────────────────────────────
  description: {
    type: String,
    trim: true,
    maxlength: [10000, 'Description cannot exceed 10,000 characters']
  },
  skills: {
    type: [String],
    default: [],
    index: true
  },

  // ── Application ────────────────────────────────────────────
  applyLink: {
    type: String,
    trim: true
  },

  // ── Data Source Tracking ───────────────────────────────────
  source: {
    type: String,
    default: 'manual',
    trim: true
  },

  // ── Temporal Fields ────────────────────────────────────────
  postedAt: {
    type: Date,
    default: Date.now
  },
  expiresAt: {
    type: Date,
    index: { expires: 0 }           // TTL index — MongoDB auto-deletes on expiry
  }
}, {
  timestamps: true                    // Mongoose auto-manages createdAt & updatedAt
});

// ============================================================
// COMPOUND INDEXES — Optimized for Career Hub query patterns
// ============================================================

// Primary listing query: filter by type, sort by newest
opportunitySchema.index({ type: 1, postedAt: -1 });

// Location + type combo filter (common frontend usage)
opportunitySchema.index({ location: 1, type: 1 });

// Duplicate detection during bulk ingestion
// title + organization + type + source must be unique together
opportunitySchema.index(
  { title: 1, organization: 1, type: 1, source: 1 },
  { unique: true, name: 'duplicate_detection_idx' }
);

// Full-text search across title, organization, and skills
opportunitySchema.index(
  { title: 'text', organization: 'text', description: 'text' },
  { name: 'opportunity_text_search_idx', weights: { title: 10, organization: 5, description: 1 } }
);

// ============================================================
// VIRTUAL — readable id shortcut
// ============================================================
opportunitySchema.virtual('id').get(function () {
  return this._id.toHexString();
});

opportunitySchema.set('toJSON', { virtuals: true });

// ============================================================
// EXPORT
// ============================================================
export default mongoose.model('Opportunity', opportunitySchema);
