# 🎓 Certificate Generation System - Visual Flow Diagram

## Complete User Journey

```
┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
┃                    USER STARTS COURSE                                  ┃
┃              (Enrolls in "Full Stack Web Dev")                        ┃
┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛
                                   ↓
┌─────────────────────────────────────────────────────────────────────────┐
│  COURSE DASHBOARD                                                       │
│  ┌─────────────────────────────────────────────────────────────────┐   │
│  │ Course: Full Stack Web Dev  [16 weeks] [⭐ 4.9/5]              │   │
│  │                                                                 │   │
│  │ Videos:                                                         │   │
│  │ 1. ☐ HTML Basics (30 min)          Progress: 0%              │   │
│  │ 2. ☐ CSS Fundamentals (40 min)     Progress: 0%              │   │
│  │ 3. ☐ JavaScript (60 min)           Progress: 0%              │   │
│  │ 4. ☐ React Intro (50 min)          Progress: 0%              │   │
│  │ 5. ☐ Node.js Backend (45 min)      Progress: 0%              │   │
│  │                                                                 │   │
│  │ Overall Progress: 0/5 videos ░░░░░░░░░░░░░░░░░░░  0%          │   │
│  │                                                                 │   │
│  │ Certificate Status: 🔒 Locked (Complete all videos)           │   │
│  └─────────────────────────────────────────────────────────────────┘   │
│                                                                         │
│ [Start Learning] [View Resources]                                      │
└─────────────────────────────────────────────────────────────────────────┘
                                   ↓
┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
┃           USER CLICKS VIDEO 1: "HTML Basics" (30 minutes)              ┃
┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛
                                   ↓
╔═════════════════════════════════════════════════════════════════════════╗
║                      VIDEO PLAYER OPENS                                 ║
║  ┌────────────────────────────────────────────────────────────────┐    ║
║  │                                                                │    ║
║  │  ┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓          │    ║
║  │  ┃            HTML Basics (YouTube Embedded)         ┃          │    ║
║  │  ┃                                                   ┃          │    ║
║  │  ┃                    [Video Player]                 ┃          │    ║
║  │  ┃                  ▶️ PLAY | [===]                 ┃          │    ║
║  │  ┃                                                   ┃          │    ║
║  │  ┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛          │    ║
║  │                                                                │    ║
║  │  ┌──────────────────────────────────────────────────────────┐│    ║
║  │  │ 👁️ Watching | 📊 100% Engaged | ✓ No Skips Detected    ││    ║
║  │  │ 📈 Progress: 5% | ⏱️ 1m 30s watched                     ││    ║
║  │  │                                                          ││    ║
║  │  │ Watch Progress: ████░░░░░░░░░░░░░░░░░░░░░░░░░░  5%      ││    ║
║  │  │ ℹ️ You must watch 95%+ to complete. Skipping penalized.  ││    ║
║  │  └──────────────────────────────────────────────────────────┘│    ║
║  │                                                                │    ║
║  │ [Open on YouTube] [⨯ Close]                                  │    ║
║  └────────────────────────────────────────────────────────────────┘    ║
║                                                                         ║
║  🎬 SYSTEM TRACKING (Every 2 seconds):                                 ║
║  ✓ Checking watched duration (5% of 30 min)                            ║
║  ✓ Calculating engagement (user looking at video)                      ║
║  ✓ Monitoring skip attempts (0 detected)                               ║
║  ✓ Checking page focus (tab active ✓)                                  ║
║  ✓ Storing in VideoProgressContext                                     ║
╚═════════════════════════════════════════════════════════════════════════╝
                                   ↓
                         [USER CONTINUES WATCHING]
                                   ↓
╔═════════════════════════════════════════════════════════════════════════╗
║                    5 MINUTES INTO VIDEO                                 ║
║  ┌────────────────────────────────────────────────────────────────┐    ║
║  │  ┌──────────────────────────────────────────────────────────┐│    ║
║  │  │ 👁️ Watching | 📊 98% Engaged | ✓ No Skips Detected    ││    ║
║  │  │ 📈 Progress: 17% | ⏱️ 5m watched                       ││    ║
║  │  │                                                          ││    ║
║  │  │ Watch Progress: ███████░░░░░░░░░░░░░░░░░░░░░░░░░  17%   ││    ║
║  │  └──────────────────────────────────────────────────────────┘│    ║
║  │                                                                │    ║
║  │ [Still watching - System tracking every 2 seconds...]         │    ║
║  └────────────────────────────────────────────────────────────────┘    ║
║                                                                         ║
║  DATA COLLECTED SO FAR:                                                 ║
║  • watchedDuration: 300 seconds (5 minutes)                             ║
║  • totalDuration: 1800 seconds (30 minutes)                             ║
║  • watchedPercentage: 16.7%                                             ║
║  • userEngagement: 98%                                                  ║
║  • skipAttempts: 0                                                      ║
║  • watchSessionStarted: 10:05:00                                        ║
╚═════════════════════════════════════════════════════════════════════════╝
                                   ↓
                    [USER CONTINUES - WATCHES 25+ MORE MINUTES]
                                   ↓
╔═════════════════════════════════════════════════════════════════════════╗
║                    VIDEO IS 95% COMPLETE                                ║
║  ┌────────────────────────────────────────────────────────────────┐    ║
║  │  ┌──────────────────────────────────────────────────────────┐│    ║
║  │  │ 👁️ Watching | 📊 91% Engaged | ✓ No Skips Detected    ││    ║
║  │  │ 📈 Progress: 95% | ⏱️ 28m 30s watched                  ││    ║
║  │  │                                                          ││    ║
║  │  │ Watch Progress: ██████████████████████████████░░░  95%   ││    ║
║  │  └──────────────────────────────────────────────────────────┘│    ║
║  │                                                                │    ║
║  │         🎉 ┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓ 🎉         │    ║
║  │            ┃    VIDEO COMPLETED! 🎉           ┃              │    ║
║  │            ┃  Certificate will be generated   ┃              │    ║
║  │            ┃  when course is complete!        ┃              │    ║
║  │            ┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛              │    ║
║  └────────────────────────────────────────────────────────────────┘    ║
║                                                                         ║
║  ✅ COMPLETION VERIFIED:                                                ║
║  ✅ Watched: 95.3% (1710/1800 seconds)                                  ║
║  ✅ Engagement: 91% (threshold was 70%)                                 ║
║  ✅ Skip Attempts: 0 (threshold was 3)                                  ║
║  ✅ Page Focus: Yes (always in focus)                                   ║
║  ✅ Trust Score: 98/100 (threshold was 70)                              ║
║                                                                         ║
║  📊 SESSION DATA SAVED:                                                 ║
║  • watchedDuration: 1710 seconds                                        ║
║  • totalDuration: 1800 seconds                                          ║
║  • completed: true                                                      ║
║  • userEngagement: 91%                                                  ║
║  • watchSessions: [{start, end, continuousTime}]                        ║
║  • lastWatched: 2024-12-28T10:35:00Z                                    ║
║  • trustScore: 98                                                       ║
╚═════════════════════════════════════════════════════════════════════════╝
                                   ↓
                      [USER CLOSES VIDEO PLAYER]
                                   ↓
┌─────────────────────────────────────────────────────────────────────────┐
│  BACK TO COURSE DASHBOARD                                               │
│  ┌─────────────────────────────────────────────────────────────────┐   │
│  │ Course: Full Stack Web Dev  [16 weeks]                         │   │
│  │                                                                 │   │
│  │ Videos:                                                         │   │
│  │ 1. ✅ HTML Basics (30 min)           Progress: 100% ███████   │   │
│  │    Watched 95%+ ✓ | Engaged 91% ✓ | No Skips ✓               │   │
│  │                                                                 │   │
│  │ 2. ☐ CSS Fundamentals (40 min)     Progress: 0%              │   │
│  │ 3. ☐ JavaScript (60 min)           Progress: 0%              │   │
│  │ 4. ☐ React Intro (50 min)          Progress: 0%              │   │
│  │ 5. ☐ Node.js Backend (45 min)      Progress: 0%              │   │
│  │                                                                 │   │
│  │ Overall Progress: 1/5 videos ████░░░░░░░░░░░░░░░░░░░░  20%    │   │
│  │                                                                 │   │
│  │ Certificate Status: 🔒 Locked (4 videos remaining)            │   │
│  └─────────────────────────────────────────────────────────────────┘   │
│                                                                         │
│ [Continue Learning] [View Completed Video]                             │
└─────────────────────────────────────────────────────────────────────────┘
                                   ↓
    [USER CONTINUES WITH REMAINING 4 VIDEOS - SAME PROCESS REPEATS]
                                   ↓
             [AFTER COMPLETING ALL 5 VIDEOS...]
                                   ↓
┌─────────────────────────────────────────────────────────────────────────┐
│  COURSE DASHBOARD - ALL VIDEOS COMPLETE                                 │
│  ┌─────────────────────────────────────────────────────────────────┐   │
│  │ Course: Full Stack Web Dev  [16 weeks]                         │   │
│  │                                                                 │   │
│  │ 1. ✅ HTML Basics              Progress: 100% ✓ Verified      │   │
│  │ 2. ✅ CSS Fundamentals         Progress: 100% ✓ Verified      │   │
│  │ 3. ✅ JavaScript               Progress: 100% ✓ Verified      │   │
│  │ 4. ✅ React Intro              Progress: 100% ✓ Verified      │   │
│  │ 5. ✅ Node.js Backend          Progress: 100% ✓ Verified      │   │
│  │                                                                 │   │
│  │ Overall Progress: 5/5 videos ███████████████████████████ 100% │   │
│  │                                                                 │   │
│  │ 🎓 Certificate Status: ✅ READY!                              │   │
│  │    All requirements met. Certificate will open below...        │   │
│  └─────────────────────────────────────────────────────────────────┘   │
│                                                                         │
│ [Claim Certificate] [View All Certificates]                            │
└─────────────────────────────────────────────────────────────────────────┘
                                   ↓
┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
┃              🎓 CERTIFICATE AUTOMATICALLY DISPLAYED                    ┃
┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛
                                   ↓
╔═════════════════════════════════════════════════════════════════════════╗
║                  ╔═══════════════════════════════════════════════════╗  ║
║                  ║      🏆 CERTIFICATE OF COMPLETION 🏆            ║  ║
║                  ║          Risee - Play & Learn                   ║  ║
║                  ║                                                 ║  ║
║                  ║  This is to certify that                        ║  ║
║                  ║                                                 ║  ║
║                  ║       JOHN DOE                                  ║  ║
║                  ║                                                 ║  ║
║                  ║  has successfully completed                     ║  ║
║                  ║                                                 ║  ║
║                  ║   Full Stack Web Development Bootcamp           ║  ║
║                  ║                                                 ║  ║
║                  ║  ─────────────────────────────────────────     ║  ║
║                  ║  Duration: 16 weeks                             ║  ║
║                  ║  Instructor: Angela Yu                          ║  ║
║                  ║  Completed: December 28, 2024                   ║  ║
║                  ║  ─────────────────────────────────────────     ║  ║
║                  ║                                                 ║  ║
║                  ║  ┌─────────────────────────────────────────┐   ║  ║
║                  ║  │  ✅ Verified Completion                │   ║  ║
║                  ║  │                                         │   ║  ║
║                  ║  │  👁️ Video Watched    : 100%            │   ║  ║
║                  ║  │  📊 Engagement       : 93%             │   ║  ║
║                  ║  │  ⏱️ Watch Time       : 235 minutes     │   ║  ║
║                  ║  │  ✓ Skip Attempts     : 2 (within limit)│   ║  ║
║                  ║  │  🔒 Anti-Cheating    : Verified ✓      │   ║  ║
║                  ║  │  🎯 Trust Score      : 95/100          │   ║  ║
║                  ║  └─────────────────────────────────────────┘   ║  ║
║                  ║                                                 ║  ║
║                  ║  Certificate ID: SKILL-J0HND0E20241228         ║  ║
║                  ║  Verified: 2024-12-28T10:45:00Z                ║  ║
║                  ║                                                 ║  ║
║                  ║  🔐 Anti-Cheating Verification:                ║  ║
║                  ║  ✓ Video Tracked • Engagement Monitored        ║  ║
║                  ║  ✓ Skip Detection Applied • Page Focus Verified║  ║
║                  ║                                                 ║  ║
║                  ║  ═════════════════════════════════════════════ ║  ║
║                  ║   This certificate proves legitimate learning  ║  ║
║                  ║   and is recognized by employers               ║  ║
║                  ║  ═════════════════════════════════════════════ ║  ║
║                  ╚═══════════════════════════════════════════════╝  ║
║                                                                    ║
║  [📥 Download Certificate] [📤 Share on LinkedIn] [✕ Close]       ║
╚═════════════════════════════════════════════════════════════════════╝
                                   ↓
                         [CERTIFICATE READY]
                                   ↓
                  USER CAN NOW:
                  ✅ Download as PDF
                  ✅ Share on LinkedIn
                  ✅ Share with employers
                  ✅ Add to resume
                  ✅ Display in portfolio
                  
                  CERTIFICATE HAS:
                  ✅ Unique ID
                  ✅ Verification timestamp
                  ✅ Anti-cheating badge
                  ✅ Watch metrics
                  ✅ Engagement proof
                  ✅ Digital signature (ready)
```

---

## Data Flow During Video Watching

```
                         USER WATCHING VIDEO
                              ↓
        ┌────────────────────────────────────────────┐
        │     EVERY 2 SECONDS - VERIFICATION LOOP    │
        └────────────────────────────────────────────┘
                              ↓
         ┌────────────────────────────────────────────────────────┐
         │ CHECK 1: How much watched?                             │
         │ Calculate: (currentTime / totalDuration) * 100          │
         │ Store: watchedDuration                                 │
         └────────────────────────────────────────────────────────┘
                              ↓
         ┌────────────────────────────────────────────────────────┐
         │ CHECK 2: Is user actively engaged?                     │
         │ Calculate: timeSpentLooking / totalWatchTime * 100     │
         │ Detect: Is user in focus?                             │
         │ Store: userEngagement (0-100%)                         │
         └────────────────────────────────────────────────────────┘
                              ↓
         ┌────────────────────────────────────────────────────────┐
         │ CHECK 3: Any skipping detected?                        │
         │ Compare: lastTime vs currentTime                       │
         │ If gap > 5 seconds: skipAttempts++                    │
         │ Show warning if skipping                              │
         └────────────────────────────────────────────────────────┘
                              ↓
         ┌────────────────────────────────────────────────────────┐
         │ CHECK 4: Is page in focus?                             │
         │ Use: document.hidden & visibilitychange event         │
         │ If hidden: pauseTracking()                            │
         │ If visible: resumeTracking()                          │
         └────────────────────────────────────────────────────────┘
                              ↓
         ┌────────────────────────────────────────────────────────┐
         │ UPDATE VIDEOPROGRESSCONTEXT                            │
         │ updateVideoProgress({                                 │
         │   videoId, watchedDuration, userEngagement,           │
         │   watchSessions, skipAttempts, completed              │
         │ })                                                     │
         └────────────────────────────────────────────────────────┘
                              ↓
         ┌────────────────────────────────────────────────────────┐
         │ UPDATE UI DISPLAY                                      │
         │ Show: Watch%, Engagement%, Skips, Progress            │
         │ Show: Warnings if needed                               │
         │ Show: Completion badge at 95%                         │
         └────────────────────────────────────────────────────────┘
                              ↓
         ┌────────────────────────────────────────────────────────┐
         │ SAVE TO LOCALSTORAGE                                   │
         │ localStorage.setItem('videoProgress',                 │
         │   JSON.stringify(videoProgress))                       │
         └────────────────────────────────────────────────────────┘
                              ↓
        ┌────────────────────────────────────────────┐
        │        [REPEAT EVERY 2 SECONDS]            │
        └────────────────────────────────────────────┘
```

---

## Certificate Issuance Decision Tree

```
USER COMPLETES ALL COURSE VIDEOS
        ↓
    CHECK CRITERIA
        ↓
┌─────────────────────────────────┐
│ Video 1: watchedPercentage >= 95? │
├─────────────────────────────────┤
│ NO  → Certificate Denied ❌      │
│ YES → Continue checking ↓        │
└─────────────────────────────────┘
        ↓
┌─────────────────────────────────┐
│ Video 1: engagement >= 70%?       │
├─────────────────────────────────┤
│ NO  → Certificate Denied ❌      │
│ YES → Continue checking ↓        │
└─────────────────────────────────┘
        ↓
┌─────────────────────────────────┐
│ Video 1: skipAttempts <= 3?      │
├─────────────────────────────────┤
│ NO  → Certificate Denied ❌      │
│ YES → Continue checking ↓        │
└─────────────────────────────────┘
        ↓
┌─────────────────────────────────┐
│ Video 1: trustScore >= 70?       │
├─────────────────────────────────┤
│ NO  → Certificate Denied ❌      │
│ YES → All checks passed ✓        │
└─────────────────────────────────┘
        ↓
    [REPEAT FOR ALL VIDEOS]
        ↓
    ALL VIDEOS PASSED
        ↓
    🎉 CERTIFICATE ISSUED 🎉
        ↓
    Certificate({
      id: SKILL-...,
      timestamp: now,
      verified: true,
      metrics: {
        watchedPercentage,
        engagement,
        skipAttempts,
        watchTime
      }
    })
```

---

## Summary

This system ensures:
1. **Only real learners** get certificates
2. **No way to fake** completion
3. **Transparent process** - users understand the rules
4. **Automatic issuance** - no manual review needed
5. **Verified credentials** - employers trust them

Result: **Risee certificates have real value!** 🎓
