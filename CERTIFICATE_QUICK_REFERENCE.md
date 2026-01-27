# ⚡ Certificate System - Quick Reference

## 🎯 At a Glance

**What**: Automatic certificate generation with anti-cheating verification  
**How**: Monitor video watching with strict criteria  
**When**: Automatically when all conditions are met  
**Why**: Prevent fraud, build trust, ensure real learning  

---

## ✅ 7 Verification Requirements

For a certificate to be issued, ALL of these must be true:

| # | Requirement | Threshold | What It Checks |
|---|---|---|---|
| 1 | 📺 Video Watched | ≥ 95% | Full video viewing (no skipping to end) |
| 2 | 👁️ Engagement | ≥ 70% | Actually looking at video (not background) |
| 3 | ⏭️ Skip Attempts | ≤ 3 | Max 3 times skipping allowed |
| 4 | 🪟 Page Focus | Always | Page must be active tab (not minimized) |
| 5 | ⏱️ Watch Time | 85%+ | Time spent matches video duration |
| 6 | 📊 Trust Score | ≥ 70 | Overall legitimacy score |
| 7 | ✅ System Status | Complete | Video marked complete by system |

---

## 🔴 Red Flags (Certificate Denied)

```
❌ Watched only 80% → Missing 15% of content
❌ Engagement 50% → Likely background viewing
❌ 5 skip attempts → Too much skipping
❌ Page switched away → Not watching
❌ Completed too fast → Likely faked
❌ Trust score 60 → Too many violations
```

---

## 🟢 Green Light (Certificate Issued)

```
✅ Watched 95%+ → Complete viewing
✅ Engagement 75% → Active attention
✅ 2 skip attempts → Within limit
✅ Page always active → Continuous focus
✅ Normal completion time → Natural pace
✅ Trust score 85 → High legitimacy
```

---

## 📊 Real-Time User Display

What users see at bottom of video player while watching:

```
┌──────────────────────────────────────────┐
│ 👁️ Watching | 📊 92% Engaged | ✓ No Skips │
│ 📈 Progress: 65% | ⏱️ 19m 30s watched    │
│                                          │
│ Watch Progress: ███████░░░░░░░░░░░  65%  │
│ ℹ️ Watch 95%+ to complete it              │
└──────────────────────────────────────────┘
```

---

## 🎓 Certificate Shows

When issued, certificate displays:

```
✅ Student name
✅ Course title & duration
✅ Instructor name
✅ Completion date
✅ Verification badge:
   • Video watched: 100%
   • Engagement: 93%
   • Skip attempts: 2
   • Watch time: 235 min
✅ Certificate ID: SKILL-ABC123
✅ Timestamp: 2024-12-28T10:30:00Z
✅ Anti-cheating verified badge
```

---

## 🛡️ How Anti-Cheating Works

### Every 2 Seconds System Checks:

```
Is video playing? → Yes
User in focus? → Yes
How much watched? → 45%
Engagement good? → 90%
Any skips? → 0
Watch time aligned? → Yes

→ ALL GOOD ✅ Continue tracking
```

### If User Does Something Wrong:

```
User tries to skip forward...
System detects jump of 10 seconds
skipAttempts++
Warning shown: "⚠️ Skipping detected"
Engagement reduced
penalty applied

User switches to another tab...
System pauses tracking
Warning shown: "Page out of focus"
Engagement paused
Returns when user comes back
```

---

## 💾 Data Tracked

For each video, system stores:

```typescript
{
  videoId: "abc123",
  courseTitle: "Full Stack Web Dev",
  videoTitle: "React Basics",
  
  // Core metrics
  watchedDuration: 1710,        // Seconds actually watched
  totalDuration: 1800,          // Video length
  completed: true,              // 95%+ watched?
  
  // Anti-cheating data
  userEngagement: 91,           // 0-100%
  watchSessions: [              // Each viewing session
    { startTime, endTime, continuousWatchTime }
  ],
  skipAttempts: 2,              // Times user skipped
  
  // Verification
  trustScore: 95,               // 0-100
  lastWatched: "2024-12-28...",// ISO timestamp
}
```

---

## 🚀 For Developers

### Import the hook:
```tsx
import { useVideoProgress } from "@/contexts/VideoProgressContext";

const { 
  isVideoValidlyCompleted,      // Check if video has valid completion
  getVideoWatchedPercentage,    // Get % watched
  videoProgress,                // All tracking data
  updateVideoProgress,          // Manual update (rarely needed)
  isCourseCompleted,            // Check if all videos done
} = useVideoProgress();
```

### Check if user can get certificate:
```tsx
const allVideosValid = videos.every(vid => 
  isVideoValidlyCompleted(vid.id)
);

if (allVideosValid) {
  // Show certificate
}
```

### Pass data to certificate:
```tsx
<CourseCertificate
  verificationData={{
    watchedPercentage: 98,
    engagement: 92,
    skipAttempts: 1,
    totalWatchTime: 1750
  }}
/>
```

---

## ⚙️ Customization

Change thresholds in code:

```tsx
// VideoPlayerWithTracking.tsx - Line ~30
const WATCH_PERCENTAGE_REQUIRED = 95;  // Change this
const ENGAGEMENT_REQUIRED = 70;         // Change this
const MAX_SKIP_ATTEMPTS = 3;           // Change this
const TRUST_SCORE_MINIMUM = 70;        // Change this
```

---

## 🔐 Security Notes

✅ **Client-side tracking** - For good UX feedback  
⚠️ **Needs server-side verification** - For production security  
⚠️ **Currently uses localStorage** - Good for demo, need backend DB for production  
⚠️ **No digital signatures yet** - Can be added for tamper-proof certificates  

---

## 📈 Monitoring Metrics

Track these in your analytics:

```
Completion Rate
  → % of users who complete courses
  → Target: > 80%

Average Engagement
  → Average engagement score across all videos
  → Target: > 85%

Certificate Generation Rate
  → % of completions that generate certificates
  → Target: > 90% (indicates good threshold)

Trust Score Distribution
  → How many users hit high trust scores
  → Target: > 90% with score >= 80

Fraud Detection Rate
  → % flagged as suspicious
  → Target: < 5%
```

---

## ❓ Common Questions

**Q: What if user's internet drops?**
A: Session continues from where they left off. Watch time preserved.

**Q: Can user pause video?**
A: Yes! Pausing is fine. We track pause time separately.

**Q: What if user rewinds to rewatch?**
A: Rewinding counts toward watch time. Good for learning.

**Q: How long does certificate take?**
A: Instant! Auto-generated when all criteria met.

**Q: Can user view certificate later?**
A: Yes, stored in their profile/dashboard.

**Q: Is certificate downloadable?**
A: Yes (need to implement PDF generation).

**Q: Can user share certificate?**
A: Yes (need to implement sharing).

---

## 🎯 Success Criteria

System is working if:

```
✅ Users see real-time feedback while watching
✅ Certificates generate automatically
✅ No certificate fraud detected
✅ Users understand why they did/didn't get certificate
✅ Engagement metrics look reasonable (70%+)
✅ Low number of rejected certificates (< 15%)
✅ Users can download/share certificates
```

---

## 📚 Documentation Files

- **ANTI_CHEATING_ALGORITHM.md** - Deep dive on algorithm
- **CERTIFICATE_SETUP_GUIDE.md** - Implementation guide
- **CERTIFICATE_IMPLEMENTATION_SUMMARY.md** - What was done
- **CERTIFICATE_FLOW_DIAGRAMS.md** - Visual flows
- **This file** - Quick reference

---

## 🎬 Test It

### Scenario 1: Perfect User
1. Watch video entirely (95%+)
2. Stay focused (no tab switching)
3. Don't skip
4. Complete normally
→ **Result: Certificate ✅**

### Scenario 2: Distracted User
1. Watch video (80%)
2. Switch tabs frequently
3. Engagement drops to 40%
4. Skip 2 times
→ **Result: Certificate ❌** (incomplete + low engagement)

### Scenario 3: Cheater
1. Try to skip to end
2. Play video at 2x speed
3. Watch only 50%
4. Try to mark complete
→ **Result: Certificate ❌** (detected as fake)

---

## 🚀 Next Steps

1. Test the system with real videos
2. Gather user feedback
3. Adjust thresholds if needed
4. Move to backend for security
5. Add PDF generation
6. Add email delivery
7. Add shareable links

---

## 💡 Key Insight

**A certificate from Risee means:**
- User watched the entire video
- User was actively engaged
- User didn't cheat or skip
- System verified legitimacy
- Certificate has real value

**This builds trust and credibility!** 🎓

---

## 📞 Support

For questions about:
- **How it works**: Read ANTI_CHEATING_ALGORITHM.md
- **How to use it**: Read CERTIFICATE_SETUP_GUIDE.md
- **Customization**: See code in src/contexts/VideoProgressContext.tsx
- **Diagrams**: Check CERTIFICATE_FLOW_DIAGRAMS.md

---

**Version**: 1.0  
**Last Updated**: December 28, 2024  
**Status**: ✅ Ready for Testing
