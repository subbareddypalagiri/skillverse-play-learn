import mongoose from 'mongoose';

const courseSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please provide a course title'],
    trim: true,
    maxlength: [100, 'Title cannot be more than 100 characters']
  },
  description: {
    type: String,
    required: [true, 'Please provide a description'],
    maxlength: [1000, 'Description cannot be more than 1000 characters']
  },
  instructor: {
    type: String,
    required: [true, 'Please provide instructor name']
  },
  instructorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  category: {
    type: String,
    required: [true, 'Please provide a category'],
    enum: [
      'Web Development',
      'Cloud & DevOps',
      'AI & ML',
      'Data Science',
      'Blockchain',
      'IoT',
      'AR/VR',
      'Programming',
      'Cybersecurity',
      'Quantum Tech'
    ]
  },
  level: {
    type: String,
    required: [true, 'Please provide difficulty level'],
    enum: ['Beginner', 'Intermediate', 'Advanced']
  },
  duration: {
    type: String,
    required: [true, 'Please provide duration']
  },
  rating: {
    type: Number,
    default: 0,
    min: [0, 'Rating must be at least 0'],
    max: [5, 'Rating cannot be more than 5']
  },
  students: {
    type: Number,
    default: 0
  },
  thumbnail: {
    type: String,
    default: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&h=400&fit=crop'
  },
  price: {
    type: Number,
    default: 0
  },
  isPremium: {
    type: Boolean,
    default: false
  },
  syllabus: [{
    title: String,
    description: String,
    duration: String
  }],
  resources: {
    videos: [{
      title: String,
      url: String,
      platform: String
    }],
    pdfs: [{
      title: String,
      url: String
    }],
    links: [{
      title: String,
      url: String
    }]
  },
  enrolledStudents: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  isActive: {
    type: Boolean,
    default: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

const Course = mongoose.model('Course', courseSchema);

export default Course;
