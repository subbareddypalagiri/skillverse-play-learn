import mongoose from 'mongoose';

const aiToolSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'AI Tool name is required'],
    trim: true,
    unique: true
  },
  description: {
    type: String,
    required: [true, 'Description is required']
  },
  category: {
    type: String,
    required: [true, 'Category is required'],
    enum: ['Development', 'Design', 'Data Science', 'Writing', 'General']
  },
  prompt: {
    type: String,
    required: [true, 'System prompt instructions are required']
  },
  iconName: {
    type: String,
    default: 'Wrench'
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

export default mongoose.model('AITool', aiToolSchema);
