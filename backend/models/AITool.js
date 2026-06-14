import mongoose from 'mongoose';

const aiToolSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  description: { type: String, default: '' },
  category: { type: String, required: true, index: true },
  link: { type: String, required: true },
  features: [{ type: String }],
  isFree: { type: Boolean, default: true },
  source: {
    type: String,
    enum: ['curated', 'huggingface', 'huggingface-space'],
    default: 'curated'
  },
  externalId: { type: String, sparse: true },
  pipeline: String,
  author: String,
  downloads: { type: Number, default: 0 },
  isLatest: { type: Boolean, default: false },
  lastSynced: { type: Date, default: Date.now },
  isActive: { type: Boolean, default: true },
}, { timestamps: true });

aiToolSchema.index({ externalId: 1, source: 1 }, { unique: true, sparse: true });
aiToolSchema.index({ name: 'text', description: 'text' });
aiToolSchema.index({ lastSynced: -1 });

export default mongoose.model('AITool', aiToolSchema);
