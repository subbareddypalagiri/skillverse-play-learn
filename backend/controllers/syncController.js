import AlumniTalk from '../models/AlumniTalk.js';
import Mentor from '../models/Mentor.js';

// @desc    Get all alumni talks (with optional filtering)
// @route   GET /api/v1/sync/alumni-talks
// @access  Public
export const getAlumniTalks = async (req, res) => {
  try {
    const { domain, status, upcoming, search } = req.query;
    
    let query = {};
    
    // Filter by domain
    if (domain) {
      query.domain = domain;
    }
    
    // Filter by status
    if (status) {
      query.status = status;
    }
    
    // Filter upcoming talks
    if (upcoming === 'true') {
      query.scheduledAt = { $gte: new Date() };
      query.status = 'upcoming';
    }
    
    // Search functionality
    if (search) {
      query.$text = { $search: search };
    }
    
    const talks = await AlumniTalk.find(query)
      .populate('registrations.user', 'name email avatar')
      .sort({ scheduledAt: 1 })
      .lean();
    
    res.status(200).json({
      success: true,
      count: talks.length,
      data: talks
    });
  } catch (error) {
    console.error('Error fetching alumni talks:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch alumni talks',
      error: error.message
    });
  }
};

// @desc    Get single alumni talk
// @route   GET /api/v1/sync/alumni-talks/:id
// @access  Public
export const getAlumniTalk = async (req, res) => {
  try {
    const talk = await AlumniTalk.findById(req.params.id)
      .populate('registrations.user', 'name email avatar')
      .populate('questions.user', 'name avatar');
    
    if (!talk) {
      return res.status(404).json({
        success: false,
        message: 'Alumni talk not found'
      });
    }
    
    res.status(200).json({
      success: true,
      data: talk
    });
  } catch (error) {
    console.error('Error fetching alumni talk:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch alumni talk',
      error: error.message
    });
  }
};

// @desc    Register for an alumni talk
// @route   POST /api/v1/sync/alumni-talks/:id/register
// @access  Private
export const registerForTalk = async (req, res) => {
  try {
    const talk = await AlumniTalk.findById(req.params.id);
    
    if (!talk) {
      return res.status(404).json({
        success: false,
        message: 'Alumni talk not found'
      });
    }
    
    // Check if already registered
    const alreadyRegistered = talk.registrations.some(
      reg => reg.user.toString() === req.user._id.toString()
    );
    
    if (alreadyRegistered) {
      return res.status(400).json({
        success: false,
        message: 'Already registered for this talk'
      });
    }
    
    // Check if talk is full
    if (talk.registrations.length >= talk.maxAttendees) {
      return res.status(400).json({
        success: false,
        message: 'This talk is fully booked'
      });
    }
    
    // Check if talk is in the future
    if (talk.scheduledAt < new Date()) {
      return res.status(400).json({
        success: false,
        message: 'Cannot register for past talks'
      });
    }
    
    // Add registration
    talk.registrations.push({
      user: req.user._id,
      registeredAt: new Date()
    });
    
    await talk.save();
    
    res.status(200).json({
      success: true,
      message: 'Successfully registered for the talk',
      data: talk
    });
  } catch (error) {
    console.error('Error registering for talk:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to register for talk',
      error: error.message
    });
  }
};

// @desc    Ask a question in alumni talk
// @route   POST /api/v1/sync/alumni-talks/:id/questions
// @access  Private
export const askQuestion = async (req, res) => {
  try {
    const { question } = req.body;
    
    if (!question) {
      return res.status(400).json({
        success: false,
        message: 'Question is required'
      });
    }
    
    const talk = await AlumniTalk.findById(req.params.id);
    
    if (!talk) {
      return res.status(404).json({
        success: false,
        message: 'Alumni talk not found'
      });
    }
    
    talk.questions.push({
      user: req.user._id,
      question,
      askedAt: new Date()
    });
    
    await talk.save();
    
    res.status(201).json({
      success: true,
      message: 'Question added successfully',
      data: talk
    });
  } catch (error) {
    console.error('Error asking question:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to add question',
      error: error.message
    });
  }
};

// @desc    Get all mentors (with optional filtering)
// @route   GET /api/v1/sync/mentors
// @access  Public
export const getMentors = async (req, res) => {
  try {
    const { domain, expertise, minRating, sortBy } = req.query;
    
    let query = { isActive: true };
    
    // Filter by domain
    if (domain) {
      query.domain = domain;
    }
    
    // Filter by expertise
    if (expertise) {
      query.expertise = { $in: [expertise] };
    }
    
    // Filter by minimum rating
    if (minRating) {
      query['rating.average'] = { $gte: parseFloat(minRating) };
    }
    
    // Sorting
    let sort = {};
    if (sortBy === 'rating') {
      sort = { 'rating.average': -1 };
    } else if (sortBy === 'sessions') {
      sort = { totalSessions: -1 };
    } else {
      sort = { createdAt: -1 };
    }
    
    const mentors = await Mentor.find(query)
      .populate('user', 'name email avatar')
      .sort(sort)
      .lean();
    
    res.status(200).json({
      success: true,
      count: mentors.length,
      data: mentors
    });
  } catch (error) {
    console.error('Error fetching mentors:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch mentors',
      error: error.message
    });
  }
};

// @desc    Get single mentor
// @route   GET /api/v1/sync/mentors/:id
// @access  Public
export const getMentor = async (req, res) => {
  try {
    const mentor = await Mentor.findById(req.params.id)
      .populate('user', 'name email avatar')
      .populate('sessions.mentee', 'name avatar');
    
    if (!mentor) {
      return res.status(404).json({
        success: false,
        message: 'Mentor not found'
      });
    }
    
    res.status(200).json({
      success: true,
      data: mentor
    });
  } catch (error) {
    console.error('Error fetching mentor:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch mentor',
      error: error.message
    });
  }
};

// @desc    Book a session with mentor
// @route   POST /api/v1/sync/mentors/:id/book
// @access  Private
export const bookSession = async (req, res) => {
  try {
    const { service, scheduledAt, duration, notes } = req.body;
    
    if (!service || !scheduledAt || !duration) {
      return res.status(400).json({
        success: false,
        message: 'Service, scheduled time, and duration are required'
      });
    }
    
    const mentor = await Mentor.findById(req.params.id);
    
    if (!mentor) {
      return res.status(404).json({
        success: false,
        message: 'Mentor not found'
      });
    }
    
    if (!mentor.isActive) {
      return res.status(400).json({
        success: false,
        message: 'Mentor is currently inactive'
      });
    }
    
    // Check if service is offered
    const serviceOffered = mentor.services.find(s => s.type === service);
    if (!serviceOffered) {
      return res.status(400).json({
        success: false,
        message: 'Service not offered by this mentor'
      });
    }
    
    // Create session
    mentor.sessions.push({
      mentee: req.user._id,
      service,
      scheduledAt: new Date(scheduledAt),
      duration,
      status: 'scheduled',
      notes,
      meetingLink: `https://meet.example.com/${mentor._id}-${Date.now()}`
    });
    
    mentor.totalSessions += 1;
    await mentor.save();
    
    res.status(201).json({
      success: true,
      message: 'Session booked successfully',
      data: mentor.sessions[mentor.sessions.length - 1]
    });
  } catch (error) {
    console.error('Error booking session:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to book session',
      error: error.message
    });
  }
};

// @desc    Rate a completed session
// @route   PUT /api/v1/sync/mentors/:mentorId/sessions/:sessionId/rate
// @access  Private
export const rateSession = async (req, res) => {
  try {
    const { rating, feedback } = req.body;
    const { mentorId, sessionId } = req.params;
    
    if (!rating || rating < 1 || rating > 5) {
      return res.status(400).json({
        success: false,
        message: 'Rating must be between 1 and 5'
      });
    }
    
    const mentor = await Mentor.findById(mentorId);
    
    if (!mentor) {
      return res.status(404).json({
        success: false,
        message: 'Mentor not found'
      });
    }
    
    const session = mentor.sessions.id(sessionId);
    
    if (!session) {
      return res.status(404).json({
        success: false,
        message: 'Session not found'
      });
    }
    
    // Check if user is the mentee
    if (session.mentee.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to rate this session'
      });
    }
    
    // Check if session is completed
    if (session.status !== 'completed') {
      return res.status(400).json({
        success: false,
        message: 'Can only rate completed sessions'
      });
    }
    
    session.rating = rating;
    session.feedback = feedback;
    
    mentor.updateRating();
    await mentor.save();
    
    res.status(200).json({
      success: true,
      message: 'Rating submitted successfully',
      data: session
    });
  } catch (error) {
    console.error('Error rating session:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to rate session',
      error: error.message
    });
  }
};

// @desc    Get domains list
// @route   GET /api/v1/sync/domains
// @access  Public
export const getDomains = async (req, res) => {
  try {
    const domains = [
      { id: 'ai', name: 'AI & Machine Learning', icon: '🤖' },
      { id: 'web', name: 'Web Development', icon: '🌐' },
      { id: 'mobile', name: 'Mobile Development', icon: '📱' },
      { id: 'cloud', name: 'Cloud & DevOps', icon: '☁️' },
      { id: 'data', name: 'Data Science', icon: '📊' },
      { id: 'design', name: 'UI/UX Design', icon: '🎨' }
    ];
    
    res.status(200).json({
      success: true,
      data: domains
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch domains',
      error: error.message
    });
  }
};
