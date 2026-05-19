import MentorApplication from '../models/MentorApplication.js';
import AlumniExpertApplication from '../models/AlumniExpertApplication.js';
import AlumniTalk from '../models/AlumniTalk.js';
import Alumni from '../models/Alumni.js';

// ====== MENTOR APPLICATION ENDPOINTS ======

// @desc    Apply to become a mentor
// @route   POST /api/v1/sync/apply/mentor
// @access  Private
export const applyAsMentor = async (req, res) => {
  try {
    const {
      domain,
      role,
      company,
      yearsOfExperience,
      expertise,
      bio,
      intendedServices,
      preferredTimeSlots,
      languages,
      timezone,
      socialLinks,
      motivation,
      portfolioItems,
      references
    } = req.body;

    // Check if user already has a pending or approved application
    const existingApplication = await MentorApplication.findOne({
      user: req.user._id,
      status: { $in: ['pending', 'approved', 'under_review'] }
    });

    if (existingApplication) {
      return res.status(400).json({
        success: false,
        message: `You already have a ${existingApplication.status} mentor application`
      });
    }

    const application = new MentorApplication({
      user: req.user._id,
      domain,
      role,
      company,
      yearsOfExperience,
      expertise,
      bio,
      intendedServices,
      preferredTimeSlots,
      languages,
      timezone,
      socialLinks,
      motivation,
      portfolioItems,
      references
    });

    await application.save();

    res.status(201).json({
      success: true,
      message: 'Mentor application submitted successfully',
      data: application
    });
  } catch (error) {
    console.error('Error submitting mentor application:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to submit mentor application',
      error: error.message
    });
  }
};

// @desc    Get current user's mentor application
// @route   GET /api/v1/sync/apply/mentor/my-application
// @access  Private
export const getMyMentorApplication = async (req, res) => {
  try {
    const application = await MentorApplication.findOne({ user: req.user._id })
      .populate('user', 'name email avatar')
      .populate('reviewedBy', 'name');

    if (!application) {
      return res.status(404).json({
        success: false,
        message: 'No mentor application found'
      });
    }

    res.status(200).json({
      success: true,
      data: application
    });
  } catch (error) {
    console.error('Error fetching mentor application:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch mentor application',
      error: error.message
    });
  }
};

// ====== ALUMNI EXPERT APPLICATION ENDPOINTS ======

// @desc    Apply to become an alumni expert
// @route   POST /api/v1/sync/apply/alumni-expert
// @access  Private
export const applyAsAlumniExpert = async (req, res) => {
  try {
    const {
      domain,
      currentRole,
      currentCompany,
      yearsOfExperience,
      expertise,
      bio,
      previousSpeakingExperience,
      proposedTopics,
      socialLinks,
      portfolioItems,
      motivation,
      availabilityCommitment,
      preferredFormats,
      references
    } = req.body;

    // Check if user already has a pending or approved application
    const existingApplication = await AlumniExpertApplication.findOne({
      user: req.user._id,
      status: { $in: ['pending', 'approved', 'under_review'] }
    });

    if (existingApplication) {
      return res.status(400).json({
        success: false,
        message: `You already have a ${existingApplication.status} alumni expert application`
      });
    }

    const application = new AlumniExpertApplication({
      user: req.user._id,
      domain,
      currentRole,
      currentCompany,
      yearsOfExperience,
      expertise,
      bio,
      previousSpeakingExperience,
      proposedTopics,
      socialLinks,
      portfolioItems,
      motivation,
      availabilityCommitment,
      preferredFormats,
      references
    });

    await application.save();

    res.status(201).json({
      success: true,
      message: 'Alumni expert application submitted successfully',
      data: application
    });
  } catch (error) {
    console.error('Error submitting alumni expert application:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to submit alumni expert application',
      error: error.message
    });
  }
};

// @desc    Get current user's alumni expert application
// @route   GET /api/v1/sync/apply/alumni-expert/my-application
// @access  Private
export const getMyAlumniExpertApplication = async (req, res) => {
  try {
    const application = await AlumniExpertApplication.findOne({ user: req.user._id })
      .populate('user', 'name email avatar')
      .populate('reviewedBy', 'name');

    if (!application) {
      return res.status(404).json({
        success: false,
        message: 'No alumni expert application found'
      });
    }

    res.status(200).json({
      success: true,
      data: application
    });
  } catch (error) {
    console.error('Error fetching alumni expert application:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch alumni expert application',
      error: error.message
    });
  }
};

// ====== ALUMNI TALK CREATION (for approved experts) ======

// @desc    Create a new alumni talk (for approved alumni experts)
// @route   POST /api/v1/sync/expert/create-talk
// @access  Private
export const createAlumniTalk = async (req, res) => {
  try {
    // Check if user is an approved alumni expert
    const expertApplication = await AlumniExpertApplication.findOne({
      user: req.user._id,
      status: 'approved'
    });

    if (!expertApplication) {
      return res.status(403).json({
        success: false,
        message: 'You must be an approved alumni expert to create talks'
      });
    }

    const {
      topic,
      description,
      scheduledAt,
      duration,
      maxAttendees,
      tags,
      meetingLink
    } = req.body;

    // Create the alumni talk
    const talk = new AlumniTalk({
      domain: expertApplication.domain,
      speaker: {
        name: req.user.name,
        role: expertApplication.currentRole,
        company: expertApplication.currentCompany,
        avatar: req.user.avatar,
        bio: expertApplication.bio,
        linkedIn: expertApplication.socialLinks.linkedIn,
        twitter: expertApplication.socialLinks.twitter
      },
      topic,
      description,
      scheduledAt: new Date(scheduledAt),
      duration,
      maxAttendees: maxAttendees || 500,
      tags,
      status: 'upcoming',
      meetingLink
    });

    await talk.save();

    res.status(201).json({
      success: true,
      message: 'Alumni talk created successfully',
      data: talk
    });
  } catch (error) {
    console.error('Error creating alumni talk:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create alumni talk',
      error: error.message
    });
  }
};

// @desc    Get my alumni talks (for approved experts)
// @route   GET /api/v1/sync/expert/my-talks
// @access  Private
export const getMyAlumniTalks = async (req, res) => {
  try {
    const talks = await AlumniTalk.find({ 'speaker.name': req.user.name })
      .populate('registrations.user', 'name email avatar')
      .sort({ scheduledAt: 1 });

    res.status(200).json({
      success: true,
      count: talks.length,
      data: talks
    });
  } catch (error) {
    console.error('Error fetching my alumni talks:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch your alumni talks',
      error: error.message
    });
  }
};

// @desc    Update alumni talk
// @route   PUT /api/v1/sync/expert/talks/:id
// @access  Private
export const updateAlumniTalk = async (req, res) => {
  try {
    const talk = await AlumniTalk.findById(req.params.id);

    if (!talk) {
      return res.status(404).json({
        success: false,
        message: 'Alumni talk not found'
      });
    }

    // Check if user owns this talk
    if (talk.speaker.name !== req.user.name) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this talk'
      });
    }

    const allowedUpdates = ['topic', 'description', 'scheduledAt', 'duration', 'maxAttendees', 'tags', 'meetingLink'];
    const updates = {};
    
    allowedUpdates.forEach(field => {
      if (req.body[field] !== undefined) {
        updates[field] = req.body[field];
      }
    });

    const updatedTalk = await AlumniTalk.findByIdAndUpdate(
      req.params.id,
      updates,
      { new: true, runValidators: true }
    );

    res.status(200).json({
      success: true,
      message: 'Alumni talk updated successfully',
      data: updatedTalk
    });
  } catch (error) {
    console.error('Error updating alumni talk:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update alumni talk',
      error: error.message
    });
  }
};

// ====== ADMIN ENDPOINTS ======

// @desc    Get all mentor applications (Admin only)
// @route   GET /api/v1/sync/admin/mentor-applications
// @access  Private (Admin only)
export const getAllMentorApplications = async (req, res) => {
  try {
    const { status, domain, page = 1, limit = 10 } = req.query;
    
    let query = {};
    if (status) query.status = status;
    if (domain) query.domain = domain;
    
    const applications = await MentorApplication.find(query)
      .populate('user', 'name email avatar')
      .populate('reviewedBy', 'name')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);
    
    const total = await MentorApplication.countDocuments(query);
    
    res.status(200).json({
      success: true,
      count: applications.length,
      total,
      data: applications
    });
  } catch (error) {
    console.error('Error fetching mentor applications:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch mentor applications',
      error: error.message
    });
  }
};

// @desc    Review mentor application (Admin only)
// @route   PUT /api/v1/sync/admin/mentor-applications/:id/review
// @access  Private (Admin only)
export const reviewMentorApplication = async (req, res) => {
  try {
    const { action, reviewNotes, rejectionReason } = req.body;
    
    if (!['approve', 'reject'].includes(action)) {
      return res.status(400).json({
        success: false,
        message: 'Action must be either "approve" or "reject"'
      });
    }
    
    const application = await MentorApplication.findById(req.params.id);
    
    if (!application) {
      return res.status(404).json({
        success: false,
        message: 'Mentor application not found'
      });
    }
    
    if (action === 'approve') {
      await application.approve(req.user._id, reviewNotes);
    } else {
      application.status = 'rejected';
      application.reviewedBy = req.user._id;
      application.reviewedAt = new Date();
      application.reviewNotes = reviewNotes;
      application.rejectionReason = rejectionReason;
      await application.save();
    }
    
    res.status(200).json({
      success: true,
      message: `Mentor application ${action}d successfully`,
      data: application
    });
  } catch (error) {
    console.error('Error reviewing mentor application:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to review mentor application',
      error: error.message
    });
  }
};

// Similar admin endpoints for alumni expert applications...
export const getAllAlumniExpertApplications = async (req, res) => {
  try {
    const { status, domain, page = 1, limit = 10 } = req.query;
    
    let query = {};
    if (status) query.status = status;
    if (domain) query.domain = domain;
    
    const applications = await AlumniExpertApplication.find(query)
      .populate('user', 'name email avatar')
      .populate('reviewedBy', 'name')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);
    
    const total = await AlumniExpertApplication.countDocuments(query);
    
    res.status(200).json({
      success: true,
      count: applications.length,
      total,
      data: applications
    });
  } catch (error) {
    console.error('Error fetching alumni expert applications:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch alumni expert applications',
      error: error.message
    });
  }
};

export const reviewAlumniExpertApplication = async (req, res) => {
  try {
    const { action, reviewNotes, rejectionReason } = req.body;
    
    if (!['approve', 'reject'].includes(action)) {
      return res.status(400).json({
        success: false,
        message: 'Action must be either "approve" or "reject"'
      });
    }
    
    const application = await AlumniExpertApplication.findById(req.params.id);
    
    if (!application) {
      return res.status(404).json({
        success: false,
        message: 'Alumni expert application not found'
      });
    }
    
    if (action === 'approve') {
      await application.approve(req.user._id, reviewNotes);
    } else {
      application.status = 'rejected';
      application.reviewedBy = req.user._id;
      application.reviewedAt = new Date();
      application.reviewNotes = reviewNotes;
      application.rejectionReason = rejectionReason;
      await application.save();
    }
    
    res.status(200).json({
      success: true,
      message: `Alumni expert application ${action}d successfully`,
      data: application
    });
  } catch (error) {
    console.error('Error reviewing alumni expert application:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to review alumni expert application',
      error: error.message
    });
  }
};

// ====== ALUMNI REGISTRATION ENDPOINTS ======

// @desc    Register as alumni
// @route   POST /api/v1/sync/apply/alumni
// @access  Private
export const registerAsAlumni = async (req, res) => {
  try {
    const {
      fullName,
      email,
      phone,
      location,
      graduationYear,
      degree,
      major,
      gpa,
      currentRole,
      currentCompany,
      industry,
      yearsOfExperience,
      previousCompanies,
      domain,
      skills,
      achievements,
      socialLinks,
      engagementPreferences,
      interests,
      bio,
      careerJourney,
      adviceForStudents
    } = req.body;

    // Check if user already has an alumni profile
    const existingAlumni = await Alumni.findOne({ user: req.user._id });
    if (existingAlumni) {
      return res.status(400).json({
        success: false,
        message: 'You already have an alumni profile'
      });
    }

    // Create alumni profile
    const alumniProfile = new Alumni({
      user: req.user._id,
      fullName,
      email,
      phone,
      location,
      graduationYear,
      degree,
      major,
      gpa,
      currentRole,
      currentCompany,
      industry,
      yearsOfExperience,
      previousCompanies,
      domain,
      skills,
      achievements,
      socialLinks,
      engagementPreferences: {
        willingToMentor: engagementPreferences?.willingToMentor || false,
        willingToSpeak: engagementPreferences?.willingToSpeak || false,
        willingToHire: engagementPreferences?.willingToHire || false,
        availableForNetworking: engagementPreferences?.availableForNetworking || false
      },
      interests,
      bio,
      careerJourney,
      adviceForStudents,
      isVerified: true, // Auto-verify alumni registrations
      approvedBy: req.user._id,
      approvedAt: new Date()
    });

    await alumniProfile.save();

    res.status(201).json({
      success: true,
      message: 'Alumni profile created successfully! Welcome to our alumni network.',
      data: alumniProfile
    });
  } catch (error) {
    console.error('Error creating alumni profile:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create alumni profile',
      error: error.message
    });
  }
};

// @desc    Get current user's alumni profile
// @route   GET /api/v1/sync/apply/alumni/my-profile
// @access  Private
export const getMyAlumniProfile = async (req, res) => {
  try {
    const alumniProfile = await Alumni.findOne({ user: req.user._id })
      .populate('user', 'name email avatar');

    if (!alumniProfile) {
      return res.status(404).json({
        success: false,
        message: 'No alumni profile found'
      });
    }

    res.status(200).json({
      success: true,
      data: alumniProfile
    });
  } catch (error) {
    console.error('Error fetching alumni profile:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch alumni profile',
      error: error.message
    });
  }
};

// @desc    Update alumni profile
// @route   PUT /api/v1/sync/apply/alumni/my-profile
// @access  Private
export const updateMyAlumniProfile = async (req, res) => {
  try {
    const alumniProfile = await Alumni.findOne({ user: req.user._id });

    if (!alumniProfile) {
      return res.status(404).json({
        success: false,
        message: 'Alumni profile not found'
      });
    }

    // Update allowed fields
    const allowedUpdates = [
      'phone', 'location', 'currentRole', 'currentCompany', 'industry',
      'yearsOfExperience', 'previousCompanies', 'skills', 'achievements',
      'socialLinks', 'engagementPreferences', 'interests', 'bio',
      'careerJourney', 'adviceForStudents', 'isPublic'
    ];

    allowedUpdates.forEach(field => {
      if (req.body[field] !== undefined) {
        alumniProfile[field] = req.body[field];
      }
    });

    await alumniProfile.save();

    res.status(200).json({
      success: true,
      message: 'Alumni profile updated successfully',
      data: alumniProfile
    });
  } catch (error) {
    console.error('Error updating alumni profile:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update alumni profile',
      error: error.message
    });
  }
};

// ====== ALUMNI DIRECTORY ENDPOINTS ======

// @desc    Get all alumni profiles
// @route   GET /api/v1/sync/alumni
// @access  Public
export const getAllAlumni = async (req, res) => {
  try {
    const {
      search,
      domain,
      graduationYear,
      company,
      location,
      willingToMentor,
      willingToSpeak,
      willingToHire,
      page = 1,
      limit = 12
    } = req.query;

    let query = { isActive: true, isPublic: true };

    // Apply filters
    if (domain) query.domain = domain;
    if (graduationYear) query.graduationYear = parseInt(graduationYear);
    if (company) query.currentCompany = new RegExp(company, 'i');
    if (location) query.location = new RegExp(location, 'i');
    if (willingToMentor === 'true') query['engagementPreferences.willingToMentor'] = true;
    if (willingToSpeak === 'true') query['engagementPreferences.willingToSpeak'] = true;
    if (willingToHire === 'true') query['engagementPreferences.willingToHire'] = true;

    let alumniQuery;
    if (search) {
      alumniQuery = Alumni.searchAlumni(search, query);
    } else {
      alumniQuery = Alumni.find(query)
        .populate('user', 'name email avatar')
        .sort({ profileViews: -1 });
    }

    const alumni = await alumniQuery
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Alumni.countDocuments(query);

    res.status(200).json({
      success: true,
      count: alumni.length,
      total,
      data: alumni
    });
  } catch (error) {
    console.error('Error fetching alumni:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch alumni',
      error: error.message
    });
  }
};

// @desc    Get alumni by ID
// @route   GET /api/v1/sync/alumni/:id
// @access  Public
export const getAlumniById = async (req, res) => {
  try {
    const alumniProfile = await Alumni.findById(req.params.id)
      .populate('user', 'name email avatar');

    if (!alumniProfile || !alumniProfile.isActive || !alumniProfile.isPublic) {
      return res.status(404).json({
        success: false,
        message: 'Alumni profile not found'
      });
    }

    // Increment profile views
    await alumniProfile.incrementViews();

    res.status(200).json({
      success: true,
      data: alumniProfile
    });
  } catch (error) {
    console.error('Error fetching alumni profile:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch alumni profile',
      error: error.message
    });
  }
};

// @desc    Get available mentors from alumni
// @route   GET /api/v1/sync/alumni/mentors
// @access  Public
export const getAlumniMentors = async (req, res) => {
  try {
    const { domain } = req.query;
    
    const mentors = await Alumni.getAvailableMentors(domain);

    res.status(200).json({
      success: true,
      count: mentors.length,
      data: mentors
    });
  } catch (error) {
    console.error('Error fetching alumni mentors:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch alumni mentors',
      error: error.message
    });
  }
};

// @desc    Get available speakers from alumni
// @route   GET /api/v1/sync/alumni/speakers
// @access  Public
export const getAlumniSpeakers = async (req, res) => {
  try {
    const { domain } = req.query;
    
    const speakers = await Alumni.getAvailableSpeakers(domain);

    res.status(200).json({
      success: true,
      count: speakers.length,
      data: speakers
    });
  } catch (error) {
    console.error('Error fetching alumni speakers:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch alumni speakers',
      error: error.message
    });
  }
};