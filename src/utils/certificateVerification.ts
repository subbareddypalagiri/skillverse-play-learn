/**
 * ANTI-CHEATING CERTIFICATE VERIFICATION SYSTEM
 * ============================================
 * 
 * Algorithm for Legitimate Course Completion Verification
 * Prevents users from faking certificates without actual learning
 */

interface VerificationCriteria {
  watchedPercentage: number;      // 0-100%
  engagement: number;              // 0-100%
  skipAttempts: number;           // Number of times user tried to skip
  totalWatchTime: number;         // Total seconds watched
  expectedWatchTime: number;      // Total video duration
  watchSessions: number;          // Number of viewing sessions
  pageVisibility: boolean;        // Was page always in focus?
  completionStatus: boolean;      // Video marked as complete?
}

interface VerificationResult {
  isLegitimate: boolean;
  trustScore: number;              // 0-100
  violations: string[];
  recommendations: string[];
}

/**
 * MAIN VERIFICATION ALGORITHM
 * Validates if a course completion is legitimate and not cheated
 */
export const verifyCertificateEligibility = (
  criteria: VerificationCriteria
): VerificationResult => {
  const violations: string[] = [];
  const recommendations: string[] = [];
  let trustScore = 100;

  // ========== RULE 1: VIDEO WATCH PERCENTAGE ==========
  // User MUST watch at least 95% of video
  if (criteria.watchedPercentage < 95) {
    violations.push(
      `Incomplete viewing: Only ${criteria.watchedPercentage}% watched (Required: 95%)`
    );
    trustScore -= Math.max(0, 95 - criteria.watchedPercentage);
    recommendations.push(
      `Watch the remaining ${100 - criteria.watchedPercentage}% of the video`
    );
  }

  // ========== RULE 2: USER ENGAGEMENT ==========
  // User must maintain 70%+ engagement (watching, not just open)
  if (criteria.engagement < 70) {
    violations.push(
      `Low engagement: ${criteria.engagement}% (Required: 70% minimum)`
    );
    trustScore -= Math.max(0, 70 - criteria.engagement);
    recommendations.push(
      `Pay active attention while watching. Minimize distractions.`
    );
  }

  // ========== RULE 3: SKIP DETECTION ==========
  // Penalize for skip attempts (indicator of not watching properly)
  if (criteria.skipAttempts > 3) {
    violations.push(
      `Excessive skipping: ${criteria.skipAttempts} skip attempts detected`
    );
    trustScore -= criteria.skipAttempts * 5;
    recommendations.push(
      `Avoid skipping videos. Watch content sequentially for better learning.`
    );
  }

  // ========== RULE 4: WATCH TIME VERIFICATION ==========
  // Total watched time should be close to actual video duration
  const watchTimeRatio = criteria.totalWatchTime / criteria.expectedWatchTime;
  if (watchTimeRatio < 0.85) {
    violations.push(
      `Insufficient watch time: ${Math.round(watchTimeRatio * 100)}% of required time`
    );
    trustScore -= Math.max(0, (1 - watchTimeRatio) * 30);
    recommendations.push(
      `Ensure you watch the video continuously without long pauses.`
    );
  }

  // ========== RULE 5: MULTIPLE SESSIONS ==========
  // Legitimate learning involves multiple viewing sessions
  // (doesn't have to be many, but indicates real engagement)
  if (criteria.watchSessions < 1) {
    violations.push(`No recorded viewing sessions`);
    trustScore -= 10;
    recommendations.push(
      `Video must be watched in a proper session within our player.`
    );
  }

  // ========== RULE 6: PAGE FOCUS ==========
  // User should keep page in focus while watching
  if (!criteria.pageVisibility) {
    violations.push(`Page was not in focus during watch time`);
    trustScore -= 20;
    recommendations.push(
      `Keep the page in focus while watching. Don't minimize or switch tabs.`
    );
  }

  // ========== RULE 7: COMPLETION STATUS ==========
  // Video must be marked as completed by system
  if (!criteria.completionStatus) {
    violations.push(`Video not marked as completed by system`);
    trustScore -= 30;
    recommendations.push(
      `Ensure you watch until the video completes (95%+).`
    );
  }

  // Ensure trustScore stays between 0-100
  const finalTrustScore = Math.max(0, Math.min(100, trustScore));
  const isLegitimate = finalTrustScore >= 70 && violations.length === 0;

  return {
    isLegitimate,
    trustScore: finalTrustScore,
    violations,
    recommendations,
  };
};

/**
 * SCORING SYSTEM
 * How we calculate if someone actually learned
 */
export const calculateLearningScore = (
  watchedPercentage: number,
  engagement: number,
  completionTime: number,
  videoLength: number
): number => {
  let score = 0;

  // Watched percentage: 40 points max
  score += Math.min(40, (watchedPercentage / 100) * 40);

  // Engagement: 35 points max
  score += Math.min(35, (engagement / 100) * 35);

  // Completion time alignment: 25 points max
  // Penalize if completed too fast (likely speed watching)
  const minAcceptableTime = videoLength * 0.85; // Should take 85%+ of video time
  if (completionTime >= minAcceptableTime) {
    score += 25;
  } else {
    const ratio = completionTime / minAcceptableTime;
    score += ratio * 25;
  }

  return Math.round(Math.min(100, score));
};

/**
 * ANTI-CHEATING DETECTION
 * Identifies suspicious completion patterns
 */
export interface SuspiciousPatterns {
  videoCompletedTooFast: boolean;      // Completed in less than 80% of duration
  excessiveSkipping: boolean;          // More than 3 skip attempts
  multipleFastCompletions: boolean;    // Multiple courses completed in short time
  lowEngagement: boolean;              // Engagement score < 50%
  inconsistentWatchTime: boolean;      // Watch time doesn't match progress
}

export const detectSuspiciousActivity = (
  completionTime: number,
  videoDuration: number,
  skipAttempts: number,
  engagement: number,
  watchedDuration: number
): SuspiciousPatterns => {
  return {
    videoCompletedTooFast: completionTime < videoDuration * 0.8,
    excessiveSkipping: skipAttempts > 3,
    multipleFastCompletions: false, // Check against user's history
    lowEngagement: engagement < 50,
    inconsistentWatchTime:
      Math.abs(watchedDuration - videoDuration) > videoDuration * 0.15,
  };
};

/**
 * CERTIFICATE GENERATION RULES
 * When exactly is a certificate issued?
 */
export const canIssueCertificate = (
  watchedPercentage: number,
  engagement: number,
  skipAttempts: number,
  pageVisibility: boolean,
  trustScore: number
): boolean => {
  return (
    watchedPercentage >= 95 && // Must watch 95%+
    engagement >= 70 && // Must be engaged 70%+
    skipAttempts <= 3 && // Max 3 skip attempts
    pageVisibility && // Page must be in focus
    trustScore >= 70 // Overall trust score 70%+
  );
};

/**
 * ALGORITHM EXPLANATION FOR USERS
 */
export const getVerificationExplanation = (): string => {
  return `
  🔒 HOW OUR CERTIFICATE VERIFICATION WORKS
  =========================================
  
  To prevent cheating and ensure certificates have real value:
  
  1️⃣ VIDEO WATCHING (95%+ Required)
     - You must watch at least 95% of each video
     - Skipping forward is detected and penalized
     - Progress is tracked every 2 seconds
  
  2️⃣ ACTIVE ENGAGEMENT (70%+ Required)
     - Our system monitors if you're actually watching
     - Switching tabs or minimizing the window pauses tracking
     - Fast-forwarding through content reduces engagement
  
  3️⃣ PAGE FOCUS
     - The page must stay in focus while watching
     - If you minimize/switch tabs, tracking pauses
     - This ensures you're not just playing video in background
  
  4️⃣ CONTINUOUS VIEWING
     - Videos should be watched in reasonably sized chunks
     - Multiple short sessions show real learning
     - Watch sessions are recorded for verification
  
  5️⃣ SKIP DETECTION
     - Trying to skip forward is detected
     - More than 3 skip attempts = certificate denied
     - Encourages sequential, proper learning
  
  6️⃣ AUTOMATIC CERTIFICATE GENERATION
     - When you complete a course:
       ✓ All videos watched 95%+
       ✓ Engagement maintained 70%+
       ✓ Page kept in focus
       ✓ Minimal skipping
     - Certificate is automatically issued!
     - You get verification with timestamp & metrics
  
  🎯 RESULT: Only students who ACTUALLY LEARN get certificates
  
  Note: This system ensures your Risee/SkillVerse certificate
  has real value and is respected by employers!
  `;
};
