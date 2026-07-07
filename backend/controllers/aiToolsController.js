import AITool from '../models/AITool.js';
import { successResponse } from '../utils/responseHandler.js';
import { syncLatestAIModels, needsSync, ALL_CATEGORIES } from '../services/aiToolsSyncService.js';
import logger from '../config/logger.js';

let syncInProgress = false;

const formatTool = (tool) => ({
  id: tool._id,
  name: tool.name,
  description: tool.description,
  category: tool.category,
  link: tool.link,
  features: tool.features || [],
  isFree: tool.isFree,
  source: tool.source,
  isLatest: tool.isLatest,
  pipeline: tool.pipeline,
  author: tool.author,
  downloads: tool.downloads,
  lastSynced: tool.lastSynced,
});

export const getAITools = async (req, res, next) => {
  try {
    const { category, search, source, latest, limit = 500 } = req.query;

    const query = { isActive: true };

    if (category && category !== 'All') query.category = category;
    if (source) query.source = source;
    if (latest === 'true') query.isLatest = true;
    if (search) {
      const regex = new RegExp(search, 'i');
      query.$or = [
        { name: regex },
        { description: regex },
        { category: regex },
        { author: regex },
      ];
    }

    const tools = await AITool.find(query)
      .sort({ isLatest: -1, downloads: -1, updatedAt: -1 })
      .limit(parseInt(limit));

    if (await needsSync()) {
      triggerBackgroundSync();
    }

    return successResponse(res, 200, 'AI tools fetched', {
      tools: tools.map(formatTool),
      total: tools.length,
    });
  } catch (error) {
    next(error);
  }
};

export const getAIToolCategories = async (req, res, next) => {
  try {
    const counts = await AITool.aggregate([
      { $match: { isActive: true } },
      { $group: { _id: '$category', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
    ]);

    const categoryMap = Object.fromEntries(counts.map((c) => [c._id, c.count]));
    const total = counts.reduce((sum, c) => sum + c.count, 0);

    const categories = [
      { name: 'All', count: total },
      ...ALL_CATEGORIES.filter((c) => categoryMap[c]).map((name) => ({
        name,
        count: categoryMap[name],
      })),
      ...counts
        .filter((c) => !ALL_CATEGORIES.includes(c._id))
        .map((c) => ({ name: c._id, count: c.count })),
    ];

    return successResponse(res, 200, 'Categories fetched', { categories });
  } catch (error) {
    next(error);
  }
};

export const getAIToolsMeta = async (req, res, next) => {
  try {
    const [total, curated, scraped, latest, lastSyncedDoc] = await Promise.all([
      AITool.countDocuments({ isActive: true }),
      AITool.countDocuments({ isActive: true, source: 'curated' }),
      AITool.countDocuments({ isActive: true, source: { $ne: 'curated' } }),
      AITool.countDocuments({ isActive: true, isLatest: true }),
      AITool.findOne({ source: { $ne: 'curated' } }).sort({ lastSynced: -1 }),
    ]);

    return successResponse(res, 200, 'AI tools meta', {
      total,
      curated,
      scraped,
      latest,
      lastSynced: lastSyncedDoc?.lastSynced || null,
      syncInProgress,
    });
  } catch (error) {
    next(error);
  }
};

export const syncAITools = async (req, res, next) => {
  try {
    if (syncInProgress) {
      return successResponse(res, 200, 'Sync already in progress', { syncInProgress: true });
    }

    const result = await runSync();
    return successResponse(res, 200, 'AI tools synced successfully', result);
  } catch (error) {
    next(error);
  }
};

async function runSync() {
  syncInProgress = true;
  try {
    return await syncLatestAIModels();
  } finally {
    syncInProgress = false;
  }
}

function triggerBackgroundSync() {
  if (syncInProgress) return;
  logger.info('[AITools] Background sync triggered (stale data)');
  runSync().catch((err) => logger.error('[AITools] Background sync failed:', err.message));
}

export const analyzeCareerGap = async (req, res, next) => {
  try {
    const { targetRole = 'Full Stack Developer', checkedSkills = [], roleData = null } = req.body;

    const roleRequirements = {
      'Full Stack Developer': {
        essential: ['HTML', 'CSS', 'JavaScript', 'React', 'Node.js', 'Express', 'MongoDB', 'Git', 'REST API'],
        advanced: ['TypeScript', 'Docker', 'Next.js', 'Redux / Zustand', 'System Design', 'AWS / Cloud', 'GraphQL', 'CI/CD'],
        aiToolsQuery: { category: { $in: ['Coding & Dev', 'Productivity', 'General AI', 'Web & App Design'] } }
      },
      'AI / ML Engineer': {
        essential: ['Python', 'Data Structures', 'Linear Algebra', 'SQL', 'Git', 'Pandas / NumPy', 'Machine Learning Basics'],
        advanced: ['PyTorch / TensorFlow', 'Deep Learning', 'NLP / Transformers', 'LangChain / LLMs', 'MLOps', 'Vector Databases', 'Docker', 'AWS / Cloud'],
        aiToolsQuery: { category: { $in: ['General AI', 'Research & Data', 'Coding & Dev', 'AI Models'] } }
      },
      'Data Scientist / Analyst': {
        essential: ['Python / R', 'SQL', 'Excel / Spreadsheets', 'Statistics & Probability', 'Data Visualization', 'Pandas / NumPy'],
        advanced: ['Machine Learning', 'Tableau / PowerBI', 'Big Data (Spark/Hadoop)', 'A/B Testing', 'Time Series Forecasting', 'Deep Learning'],
        aiToolsQuery: { category: { $in: ['Research & Data', 'Productivity', 'General AI', 'Marketing & Sales'] } }
      },
      'UI/UX & Product Designer': {
        essential: ['Figma / Adobe XD', 'UI Design Principles', 'User Research', 'Wireframing', 'Prototyping', 'Responsive Design'],
        advanced: ['Design Systems', 'Micro-interactions', 'HTML / CSS Basics', 'Usability Testing', '3D / Motion Design (Spline/After Effects)', 'AI UI Generators'],
        aiToolsQuery: { category: { $in: ['Image & Design', 'Web & App Design', 'Video & Animation', 'Productivity'] } }
      }
    };

    let config = roleRequirements[targetRole];
    
    // Dynamic Fallback using roleData from frontend (Supports ALL 150+ Roles!)
    if (!config && roleData) {
      const toolsList = Array.isArray(roleData.tools) ? roleData.tools.map(t => typeof t === 'object' ? t.name : String(t)).filter(Boolean) : [];
      const certsList = Array.isArray(roleData.certs) ? roleData.certs.map(c => typeof c === 'object' ? c.title : String(c)).filter(Boolean) : [];
      const checkList = Array.isArray(roleData.checklist) ? roleData.checklist.map(c => typeof c === 'object' ? c.label : String(c)).filter(Boolean) : [];
      
      const halfCheck = Math.ceil(checkList.length / 2);
      const essential = [...new Set([...toolsList.slice(0, 6), ...checkList.slice(0, halfCheck)])];
      const advanced = [...new Set([...toolsList.slice(6), ...certsList, ...checkList.slice(halfCheck)])];
      
      config = {
        essential: essential.length > 0 ? essential : ['Core Domain Architecture', 'Technical Strategy', 'System Integration', 'Version Control'],
        advanced: advanced.length > 0 ? advanced : ['Advanced Infrastructure', 'Industry Certifications', 'Cloud Scaling', 'Leadership'],
        aiToolsQuery: { category: { $in: ['Coding & Dev', 'Productivity', 'General AI', 'Research & Data', 'AI Models'] } }
      };
    } else if (!config) {
      config = {
        essential: ['Communication', 'Problem Solving', 'Git & Version Control', 'Project Management', 'Data Analysis', 'Web Basics'],
        advanced: ['AI Prompt Engineering', 'Automation Tools', 'Cloud Computing', 'System Architecture', 'Agile / Scrum', 'Leadership'],
        aiToolsQuery: { category: { $in: ['Productivity', 'General AI', 'Coding & Dev'] } }
      };
    }

    const allRequired = [...config.essential, ...config.advanced];
    
    const userSkillsLower = checkedSkills.map(s => String(s).toLowerCase().trim());
    
    const matchedEssential = config.essential.filter(s => userSkillsLower.some(us => us.includes(s.toLowerCase()) || s.toLowerCase().includes(us)));
    const matchedAdvanced = config.advanced.filter(s => userSkillsLower.some(us => us.includes(s.toLowerCase()) || s.toLowerCase().includes(us)));
    
    const missingEssential = config.essential.filter(s => !matchedEssential.includes(s));
    const missingAdvanced = config.advanced.filter(s => !matchedAdvanced.includes(s));
    
    const totalRequiredCount = allRequired.length;
    const totalMatchedCount = matchedEssential.length + (matchedAdvanced.length * 1.5);
    const maxPossibleScore = config.essential.length + (config.advanced.length * 1.5);
    const readinessScore = Math.min(Math.round((totalMatchedCount / (maxPossibleScore || 1)) * 100), 100);

    const recommendedTools = await AITool.find({
      isActive: true,
      ...config.aiToolsQuery
    }).sort({ isLatest: -1, downloads: -1 }).limit(6);

    let roadmap = [];
    if (roleData && Array.isArray(roleData.roadmap) && roleData.roadmap.length > 0) {
      roadmap = roleData.roadmap.map((r, i) => ({
        week: `Phase ${i + 1}: ${typeof r === 'object' ? r.title : `Milestone ${i + 1}`}`,
        focus: typeof r === 'object' ? (r.desc || 'Complete targeted industry requirements.') : String(r),
        actionItems: [
          'Master core competencies and practical toolchain implementations.',
          'Build and deploy a verifiable project artifact.',
          'Review against industry benchmarks in Skillverse Career Hub.'
        ]
      }));
    } else {
      roadmap = [
        {
          week: 'Week 1: Core Foundation & Essential Gaps',
          focus: missingEssential.length > 0 ? `Master missing core concepts: ${missingEssential.slice(0, 3).join(', ')}` : 'Strengthen foundational problem-solving and clean coding practices.',
          actionItems: [
            'Complete 5 hands-on coding exercises / tutorials in your primary domain.',
            'Set up a GitHub repo and practice daily commits with structured documentation.',
            'Use AI Assistants (Cursor / GitHub Copilot) to explain complex edge cases.'
          ]
        },
        {
          week: 'Week 2: Advanced Tooling & Architecture',
          focus: missingAdvanced.length > 0 ? `Level up with industry tech: ${missingAdvanced.slice(0, 3).join(', ')}` : 'Deep dive into system architecture and performance optimization.',
          actionItems: [
            'Build a modular project integrating at least 2 advanced technologies.',
            'Implement proper error handling, logging, and security best practices.',
            'Explore AI productivity tools to automate repetitive workflow tasks.'
          ]
        },
        {
          week: 'Week 3: Real-World Capstone & Portfolio',
          focus: 'Build an end-to-end production-ready showcase application.',
          actionItems: [
            'Deploy your project live on Vercel / Render / AWS with custom domain setup.',
            'Write a comprehensive README.md with architecture diagrams and API specs.',
            'Publish a short demo Reel or Showcase post on Skillverse to get community feedback.'
          ]
        },
        {
          week: 'Week 4: Interview Readiness & Mock Drills',
          focus: 'Resume polish, behavioral alignment, and technical mock interviews.',
          actionItems: [
            'Align your resume keywords with industry job descriptions for high ATS score.',
            'Practice system design and live coding problems under timed constraints.',
            'Participate in Skillverse Career Hub mentorship sessions and apply for open roles.'
          ]
        }
      ];
    }

    return successResponse(res, 200, 'Career gap analysis completed successfully', {
      targetRole,
      readinessScore,
      summary: {
        totalRequired: totalRequiredCount,
        matchedCount: matchedEssential.length + matchedAdvanced.length,
        missingCount: missingEssential.length + missingAdvanced.length
      },
      skills: {
        matchedEssential,
        matchedAdvanced,
        missingEssential,
        missingAdvanced
      },
      recommendedTools: recommendedTools.map(formatTool),
      roadmap,
      roleData: roleData || null
    });
  } catch (error) {
    next(error);
  }
};

export { runSync as executeAIToolsSync };
