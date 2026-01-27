# 🎨 PROFILE EDIT FEATURE - VISUAL DIAGRAMS

## 1️⃣ Component Architecture Diagram

```
┌─────────────────────────────────────────────────────┐
│                   App Component                     │
└────────────────────────┬────────────────────────────┘
                         │
                         ↓
        ┌────────────────────────────────┐
        │    SocialProvider (Context)    │
        │  - userProfile state           │
        │  - updateProfile function      │
        │  - posts management            │
        └────────────────────┬───────────┘
                             │
                             ↓
                  ┌──────────────────────┐
                  │    Profile Page      │
                  │  (src/pages/)        │
                  └──────────┬───────────┘
                             │
                             ↓
                ┌────────────────────────────┐
                │  StudentProfile Component  │
                │  (src/components/)         │
                │                            │
                │  ├─ Profile Display       │
                │  ├─ Edit Button           │
                │  └─ Edit Dialog           │
                │     ├─ Name Input         │
                │     ├─ Bio Textarea       │
                │     ├─ Hobbies Input      │
                │     ├─ Skills Textarea    │
                │     ├─ Cancel Button      │
                │     └─ Save Button        │
                └──────────────────────────┘
```

---

## 2️⃣ Data Flow Diagram

```
USER INTERACTION FLOW
═════════════════════════════════════════════════════════

User Opens Profile Page
         │
         ↓
StudentProfile Component Mounts
         │
         ↓ (useEffect)
SocialContext.loadProfile()
         │
         ↓
API Call: getUserProfile()
         │
         ├─── Success ───→ Update State
         │                     │
         │                     ↓
         │            Update localStorage
         │                     │
         │                     ↓
         │            Display in UI
         │
         └─── Error ───→ Use localStorage fallback

User Clicks Edit Button
         │
         ↓
setShowEditDialog(true)
         │
         ↓
Dialog Opens (pre-filled with current data)
         │
         ↓
User Modifies Fields
         │
         ↓
User Clicks Save
         │
         ↓
handleSaveProfile() called
         │
         ↓
setIsSaving(true) ─→ Button shows "Saving..."
         │
         ↓
updateProfile(data) ─→ async call
         │
         ├─── API Layer ───┐
         │                 ↓
         │         API Call: updateUserProfile()
         │                 │
         ├─── Backend ─────┤
         │                 ↓
         │         /api/auth/updatedetails (PUT)
         │                 │
         ├─ Validation ────┤
         │                 ↓
         │         Check fields & constraints
         │                 │
         ├─ Database ──────┤
         │                 ↓
         │         User.findByIdAndUpdate()
         │                 │
         │         Save to MongoDB
         │                 │
         ├─ Response ──────┤
         │                 ↓
         │         Return Updated User
         │
         ↓
Frontend Receives Response
         │
         ↓
Update React State
         │
         ↓
Update localStorage
         │
         ↓
setIsSaving(false)
         │
         ↓
setShowEditDialog(false)
         │
         ↓
Dialog Closes
         │
         ↓
Profile Updates on UI
         │
         ↓
✅ SUCCESS!
```

---

## 3️⃣ Authentication Flow

```
CLIENT SIDE          NETWORK          SERVER SIDE
═════════════════════════════════════════════════════════

User Login
   │
   ├─→ POST /api/auth/login ─────────→ │
                                       ↓
                                  Verify Credentials
                                       │
                                  Generate JWT Token
                                       │
                  ←────── {token, user} ────
   │
   ↓
Save Token in localStorage
   │
   setAuthToken(token)
   │
   ↓

Subsequent API Calls:
   │
   ├─→ GET /api/auth/me ───────────→ │
   │  Authorization: Bearer <token>   │
   │                                   ↓
   │                           Verify Token
   │                                   │
   │                           Find User
   │                                   │
   │                  ←── Return User Profile ──
   │
   ↓
Update Component State

Update Profile (Save):
   │
   ├─→ PUT /api/auth/updatedetails ──→ │
   │  Authorization: Bearer <token>    │
   │  Body: {name, bio, hobbies,...}   │
   │                                    ↓
   │                           Verify Token
   │                                    │
   │                           Validate Fields
   │                                    │
   │                           Update MongoDB
   │                                    │
   │                  ←── Return Updated User ──
   │
   ↓
Update State & UI
```

---

## 4️⃣ Database Schema Diagram

```
MONGODB - USER COLLECTION
═════════════════════════════════════════════════════════

User Document:
┌─────────────────────────────────────────────┐
│  _id: ObjectId (auto-generated)             │
├─────────────────────────────────────────────┤
│  AUTHENTICATION FIELDS                      │
│  ├─ name: "John Doe"                        │
│  ├─ email: "john@example.com" (unique)      │
│  ├─ password: "$2a$10$hash..." (hashed)     │
│  └─ role: "student" | "instructor"          │
├─────────────────────────────────────────────┤
│  PROFILE FIELDS                             │
│  ├─ avatar: "https://..."                   │
│  ├─ bio: "Learning to code 🚀"              │
│  ├─ hobbies: ["coding", "gaming"]           │
│  └─ skills: ["JavaScript", "React"]         │
├─────────────────────────────────────────────┤
│  PLATFORM INTEGRATIONS                      │
│  ├─ github: "https://github.com/john"       │
│  ├─ linkedin: "https://linkedin.com/john"   │
│  ├─ leetcode: "https://leetcode.com/john"   │
│  └─ [...more platforms...]                 │
├─────────────────────────────────────────────┤
│  PLATFORM STATISTICS                        │
│  ├─ githubStats: {                          │
│  │    repos: 45,                            │
│  │    stars: 234,                           │
│  │    followers: 123,                       │
│  │    contributions: 1547                   │
│  │  }                                       │
│  └─ leetcodeStats: {                        │
│       solved: 456,                          │
│       ranking: 12345,                       │
│       badges: ["Badge1", "Badge2"]          │
│     }                                       │
├─────────────────────────────────────────────┤
│  SOCIAL METRICS                             │
│  ├─ followers: 15                           │
│  ├─ following: 25                           │
│  └─ totalLikes: 234                         │
├─────────────────────────────────────────────┤
│  RELATIONS                                  │
│  ├─ enrolledCourses: [ObjectId1, ...]       │
│  └─ registeredEvents: [ObjectId2, ...]      │
├─────────────────────────────────────────────┤
│  TIMESTAMPS                                 │
│  ├─ createdAt: "2024-12-31T..."             │
│  └─ updatedAt: "2024-12-31T..."             │
└─────────────────────────────────────────────┘
```

---

## 5️⃣ API Endpoint Flow

```
CLIENT REQUEST
═════════════════════════════════════════════════════════

┌─────────────────────────────────────────────┐
│  GET /api/auth/me                           │
│  ├─ Headers:                                │
│  │  Authorization: "Bearer token123"        │
│  │  Content-Type: "application/json"        │
│  └─ Body: (none)                            │
└────────────────┬────────────────────────────┘
                 │
                 ↓
        [MIDDLEWARE PROCESSING]
                 │
                 ├─→ protect (Check Auth)
                 │   └─ Verify JWT Token
                 │
                 ↓
        [ROUTE HANDLER]
                 │
                 ├─→ getMe()
                 │   └─ Find User
                 │   └─ Populate Relations
                 │   └─ Select -password
                 │
                 ↓
        [DATABASE QUERY]
                 │
                 ├─→ User.findById()
                 │   ├─.select('-password')
                 │   ├─.populate('enrolledCourses')
                 │   └─.populate('registeredEvents')
                 │
                 ↓
        [RESPONSE]
                 │
┌────────────────▼────────────────────────────┐
│  200 OK                                     │
│  {                                          │
│    "status": "success",                     │
│    "data": {                                │
│      "user": {                              │
│        "id": "...",                         │
│        "name": "John Doe",                  │
│        "email": "john@example.com",         │
│        "bio": "...",                        │
│        ... all fields ...                   │
│      }                                      │
│    }                                        │
│  }                                          │
└─────────────────────────────────────────────┘


PUT REQUEST
═════════════════════════════════════════════════════════

┌─────────────────────────────────────────────┐
│  PUT /api/auth/updatedetails                │
│  ├─ Headers:                                │
│  │  Authorization: "Bearer token123"        │
│  │  Content-Type: "application/json"        │
│  ├─ Body:                                   │
│  │  {                                       │
│  │    "name": "Jane Doe",                   │
│  │    "bio": "New bio 🚀",                  │
│  │    "hobbies": ["coding"],                │
│  │    "skills": ["React"]                   │
│  │  }                                       │
│  └─ Validation:                             │
│     ├─ Check token                          │
│     ├─ Whitelist fields                     │
│     └─ Validate constraints                 │
└────────────────┬────────────────────────────┘
                 │
                 ↓
        [BACKEND PROCESSING]
                 │
                 ├─→ protect (Check Auth)
                 ├─→ updateDetails()
                 │   ├─ Filter fields
                 │   ├─ Validate input
                 │   └─ Find and Update
                 │
                 ↓
        [DATABASE UPDATE]
                 │
                 ├─→ User.findByIdAndUpdate()
                 │   ├─ Apply changes
                 │   ├─ Run validators
                 │   └─ Return new doc
                 │
                 ↓
        [RESPONSE]
                 │
┌────────────────▼────────────────────────────┐
│  200 OK                                     │
│  {                                          │
│    "status": "success",                     │
│    "data": {                                │
│      "user": {                              │
│        "id": "...",                         │
│        "name": "Jane Doe",                  │
│        "bio": "New bio 🚀",                 │
│        "hobbies": ["coding"],               │
│        "skills": ["React"],                 │
│        ... updated fields ...               │
│      }                                      │
│    }                                        │
│  }                                          │
└─────────────────────────────────────────────┘
```

---

## 6️⃣ State Management Flow

```
CONTEXT API - SOCIAL CONTEXT
═════════════════════════════════════════════════════════

┌──────────────────────────────────┐
│   SocialContext Root             │
│  (src/contexts/SocialContext)    │
└────────────┬─────────────────────┘
             │
    ┌────────┴────────┐
    │                 │
    ↓                 ↓
┌────────────┐    ┌──────────────┐
│   State    │    │   Functions  │
├────────────┤    ├──────────────┤
│ posts      │    │ addPost()    │
│ userProfile│    │ likePost()   │
│ loading    │    │ addComment() │
│ error      │    │ updateProfile│
└────────────┘    │ refreshProfile
                  │ importFromPlatform
                  └──────────────┘

COMPONENT USAGE:
═════════════════════════════════════════════════════════

const { userProfile, updateProfile } = useSocial();
                    │                      │
                    └──────┬───────────────┘
                           │
              ┌────────────┴────────────┐
              │                         │
              ↓                         ↓
        Display Profile          Click Save
              │                         │
              └────────────┬────────────┘
                           │
                    updateProfile()
                           │
                    ┌──────┴──────┐
                    │             │
                    ↓             ↓
             API Call      Update State
                    │             │
                    └──────┬──────┘
                           │
                   Update localStorage
                           │
                    Re-render Component
```

---

## 7️⃣ Edit Dialog State Management

```
EDIT DIALOG LIFECYCLE
═════════════════════════════════════════════════════════

Initial State:
┌─────────────────────────────────────┐
│ showEditDialog: false               │
│ editData: {}                        │
│ isSaving: false                     │
└─────────────────────────────────────┘

Click Edit Button:
         │
         ↓
┌──────────────────────────────────────────┐
│ handleOpenEdit()                         │
│ ├─ setEditData(current values)           │
│ └─ setShowEditDialog(true)               │
└──────────────────────────────────────────┘
         │
         ↓
Dialog Opens:
┌──────────────────────────────────────────┐
│ showEditDialog: true                     │
│ editData: {                              │
│   name: "John Doe",                      │
│   bio: "...",                            │
│   hobbies: "coding, gaming",             │
│   skills: "JavaScript, React"            │
│ }                                        │
│ isSaving: false                          │
└──────────────────────────────────────────┘

User Modifies Fields:
         │
         ↓
┌──────────────────────────────────────────┐
│ setEditData({ ...editData, name: value })│
│                                          │
│ editData: {                              │
│   name: "Jane Doe",  ← Changed           │
│   bio: "...",                            │
│   hobbies: "...",                        │
│   skills: "..."                          │
│ }                                        │
└──────────────────────────────────────────┘

Click Save:
         │
         ↓
┌──────────────────────────────────────────┐
│ handleSaveProfile()                      │
│ ├─ setIsSaving(true)                     │
│ └─ await updateProfile(editData)         │
└──────────────────────────────────────────┘
         │
    ┌────┴────┐
    │          │
    ↓          ↓
Success      Error
    │          │
    ├─ API    ├─ Log Error
    │  Call   │
    │  OK     ├─ Show Alert
    │         │
    ↓         ↓
Close      Keep Dialog
Dialog      Open
    │          │
    └──────┬───┘
           │
    setIsSaving(false)
           │
           ↓
Final State:
┌──────────────────────────────────┐
│ showEditDialog: false            │
│ editData: {} (reset)             │
│ isSaving: false                  │
│ userProfile: (updated)           │
└──────────────────────────────────┘
```

---

## 8️⃣ Error Handling Flow

```
ERROR HANDLING STRATEGY
═════════════════════════════════════════════════════════

CLIENT ERROR
    │
    ├─→ Validation Error
    │   ├─ Invalid email format
    │   ├─ Fields too long
    │   └─ Missing required fields
    │
    └─→ Network Error
        ├─ No internet connection
        ├─ Server unreachable
        └─ Request timeout

HANDLING:
    │
    ├─→ Try-Catch Block
    │   ├─ Catch error
    │   ├─ Log to console
    │   └─ Show user alert
    │
    └─→ Fallback
        ├─ Use localStorage
        └─ Allow offline mode

USER NOTIFICATION
    │
    ├─→ Loading State
    │   ├─ Show "Saving..."
    │   └─ Disable buttons
    │
    └─→ Error Message
        ├─ Alert box
        ├─ Toast notification
        └─ Error component

RECOVERY
    │
    ├─→ Automatic
    │   ├─ Use cached data
    │   └─ Try again later
    │
    └─→ Manual
        ├─ Retry button
        └─ Re-login if needed
```

---

## 9️⃣ Responsive Design Breakdown

```
MOBILE (< 768px)
═════════════════════════════════════════════════════════
┌─────────────────────┐
│  Profile Header     │  - Stacked layout
│                     │  - Full width
│  Edit Button        │  - Large touch targets
│                     │
│  Tabs (vertical)    │  - Scrollable tabs
│                     │
│  Content            │  - Single column
└─────────────────────┘

Edit Dialog:
┌─────────────────────┐
│  Dialog              │  - Full screen
│  ├─ Title           │  - Scroll on overflow
│  ├─ Input 1         │  - Large form fields
│  ├─ Input 2         │  - Full width buttons
│  ├─ Input 3         │
│  ├─ Buttons         │
│  └─ Footer          │
└─────────────────────┘


TABLET (768px - 1024px)
═════════════════════════════════════════════════════════
┌──────────────────────────────┐
│  Profile Header              │  - Flex layout
│  ├─ Avatar (left)            │  - Better spacing
│  ├─ Info (center)            │
│  └─ Badge (right)            │
│                              │
│  Grid Layout (2 cols)        │
└──────────────────────────────┘

Edit Dialog:
┌──────────────────────────────┐
│  Dialog (max-width: 512px)   │  - Centered modal
│  ├─ Form Fields             │  - Wider fields
│  └─ Buttons                 │  - Side-by-side buttons
└──────────────────────────────┘


DESKTOP (> 1024px)
═════════════════════════════════════════════════════════
┌────────────────────────────────────────────┐
│  Profile Header (flex)                     │  - Full layout
│  ├─ Avatar (left)                          │  - Optimal spacing
│  ├─ Info (center, flex-1)                  │  - Good typography
│  └─ Badge (right)                          │
│                                            │
│  Grid Layout (auto)                        │
└────────────────────────────────────────────┘

Edit Dialog:
                ┌──────────────────┐
                │  Dialog          │  - Centered
                │  (max-w-2xl)     │  - Comfortable width
                │  ├─ Form Fields  │  - Good readability
                │  └─ Buttons      │  - Elegant layout
                └──────────────────┘
```

---

## 🔟 Complete User Journey Map

```
USER JOURNEY: PROFILE EDIT
═════════════════════════════════════════════════════════

AWARENESS
    │
    ├─ Sees profile in navigation
    └─ Clicks profile link

ARRIVAL
    │
    ├─ Page loads
    ├─ Component mounts
    └─ Data fetches from backend

ENGAGEMENT
    │
    ├─ Sees profile information
    ├─ Notices "Edit Profile ⚡" button
    └─ Considers making changes

ACTION
    │
    ├─ Clicks edit button
    ├─ Dialog opens
    ├─ Form shows current data
    └─ User makes changes

SUBMISSION
    │
    ├─ Clicks "Save Profile 🔥"
    ├─ Button shows "Saving..."
    ├─ Data sends to API
    └─ Backend validates

PROCESSING
    │
    ├─ Server updates database
    ├─ Returns confirmation
    └─ Frontend receives response

COMPLETION
    │
    ├─ State updates
    ├─ localStorage syncs
    ├─ Dialog closes
    └─ Profile refreshes

SATISFACTION
    │
    ├─ User sees updated profile
    ├─ Changes persisted
    └─ Ready for next action
```

---

**Visual diagrams complete!** 📊

These diagrams show:
- Component hierarchy
- Data flow
- Authentication process
- Database schema
- API endpoints
- State management
- Error handling
- Responsive design
- Complete user journey

All interconnected for a complete understanding of the system! 🎯
