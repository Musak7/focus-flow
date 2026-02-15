# 🚀 Jira Real-Time Integration - Setup Guide

## ✅ What I Just Fixed

Your Kanban board now has **full Jira integration** with:

1. ✅ **Real-time data fetching** from Jira (auto-refreshes every 10 seconds)
2. ✅ **Drag & Drop** to move tasks between columns (syncs to Jira instantly)
3. ✅ **Create new tasks** directly from the board (creates in Jira)
4. ✅ **Live status updates** with visual feedback
5. ✅ **Optimistic UI** - instant updates with automatic rollback on errors

---

## 🧪 Testing Instructions

### Step 1: Test Jira Connection

Run this command to verify your Jira credentials:

```bash
node test-jira-connection.js
```

**Expected Output:**
```
✅ Success! Found X issues:
  - SCRUM-1: Task name [To Do]
  - SCRUM-2: Another task [In Progress]
```

If you see errors, check your `.env.local` file.

---

### Step 2: Start the Development Server

```bash
npm run dev
```

Navigate to: http://localhost:3000/kanban

---

### Step 3: Test Features

#### ✅ **View Real Jira Tasks**
- The board should load your actual Jira tasks
- Check the console for: `Loading from Jira...`

#### ✅ **Create a New Task**
1. Click **"Create Task"** button (top right)
2. Enter a task name: "Test task from dashboard"
3. Click **"Create in Jira"**
4. Task should appear in "To Do" column
5. Verify in Jira web UI that the task was created

#### ✅ **Drag & Drop Tasks**
1. Drag a task from "To Do" to "In Progress"
2. Check the console for: `✅ Successfully moved SCRUM-X to In Progress`
3. Verify in Jira that the status updated
4. The board auto-refreshes every 10 seconds to stay in sync

#### ✅ **Manual Refresh**
- Click the **"Refresh"** button to manually sync with Jira

---

## 🔧 How It Works

### Architecture

```
┌─────────────────┐
│  KanbanBoard    │  ← React Component
│   (Frontend)    │
└────────┬────────┘
         │
         ├─ GET  /api/kanban          (Fetch all tasks)
         ├─ POST /api/kanban/create   (Create new task)
         └─ POST /api/kanban/move     (Move task status)
                 │
         ┌───────┴────────┐
         │  Next.js API   │
         │    Routes      │
         └───────┬────────┘
                 │
         ┌───────┴────────┐
         │   lib/jira.ts  │  ← Jira API wrapper
         └───────┬────────┘
                 │
         ┌───────┴────────┐
         │  Jira REST API │
         │  (Atlassian)   │
         └────────────────┘
```

### Key Files Modified/Created

1. **[components/KanbanBoard.tsx](components/KanbanBoard.tsx)**
   - Real-time data fetching
   - Drag & drop with @hello-pangea/dnd
   - Task creation UI
   - Auto-refresh every 10 seconds

2. **[app/api/kanban/move/route.ts](app/api/kanban/move/route.ts)** (NEW)
   - Handles drag & drop
   - Calls `moveJiraIssue()` from lib/jira.ts

3. **[app/api/kanban/create/route.ts](app/api/kanban/create/route.ts)** (NEW)
   - Handles task creation
   - Calls `createJiraIssue()` from lib/jira.ts

4. **[app/api/kanban/route.ts](app/api/kanban/route.ts)**
   - Updated with better status mapping
   - Maps Jira statuses to board columns

5. **[app/kanban/page.tsx](app/kanban/page.tsx)**
   - Updated UI to match your screenshot

---

## ⚠️ Important Status Mapping

Your Jira workflow must have these statuses (or similar):
- **"To Do"** (or "TODO", "Backlog")
- **"In Progress"** (or "InProgress", "Doing")
- **"Done"** (or "Completed", "Closed")

### Check Your Jira Workflow

1. Go to Jira Project Settings → Workflows
2. Click on your active workflow
3. Verify the status names
4. If different, update the `columns` array in [components/KanbanBoard.tsx:14-17](components/KanbanBoard.tsx#L14-L17)

Example:
```typescript
const columns = [
  { id: 'To Do', title: 'To Do', color: 'bg-blue-400' },
  { id: 'In Progress', title: 'In Progress', color: 'bg-amber-400' },
  { id: 'Done', title: 'Done', color: 'bg-emerald-400' },
];
```

---

## 🐛 Troubleshooting

### Issue: "Failed to connect to Jira"

**Solution:**
1. Check `.env.local` has correct credentials
2. Run `node test-jira-connection.js`
3. Verify Jira API token is valid (regenerate if expired)

---

### Issue: "Failed to move task"

**Possible Causes:**
- Jira workflow doesn't allow that transition
- Status name mismatch

**Solution:**
1. Check browser console for error details
2. Verify the transition is allowed in Jira workflow
3. Try manually moving the task in Jira web UI

---

### Issue: Tasks not showing up

**Checklist:**
- ✅ Jira project key is correct in `.env.local`
- ✅ You have issues in that project
- ✅ Issues are not in Sprint (check JQL filter)
- ✅ Check browser Network tab for API errors

---

### Issue: "Cannot move to XYZ status"

This means Jira's workflow doesn't allow that transition.

**Fix in Jira:**
1. Go to Project Settings → Workflows
2. Edit your workflow
3. Add missing transitions between statuses
4. Publish the workflow

---

## 🎯 Next Steps (Optional Enhancements)

1. **WebSocket Real-Time Sync** (instead of polling)
2. **Task Details Modal** (edit assignee, priority, description)
3. **Filtering by Assignee/Priority**
4. **Swimlanes by Epic/Sprint**
5. **Bulk Operations**
6. **Jira Comments Integration**

---

## 📝 Environment Variables Reference

```env
# .env.local
JIRA_BASE_URL=https://abdulahadd.atlassian.net
JIRA_DOMAIN=abdulahadd.atlassian.net
JIRA_EMAIL=musa4246192@gmail.com
JIRA_API_TOKEN=ATATT3xFfGF0Grv9rTYJyoHbr8kteezRRADR-xrlr38Dpjbwjs5YmYhmxPtv6cZMIJyxRjhRk6_-OnTlskrYnfUBgKR61zNSk7Fu-h0gaFuFBe2fJ4LQHqdBQdEvB8cS4m9LYwXCIno7CHw2tkuyV6UaXVdafhBpj7V4PR4KzR08DsfipwM1oz8=FDA5FA3B
JIRA_PROJECT_KEY=SCRUM
```

---

## ✨ Summary

Your Kanban board is now **fully connected to Jira** with:

✅ Real-time data fetching
✅ Drag & drop task movement
✅ Create tasks directly in Jira
✅ Auto-refresh every 10 seconds
✅ Visual feedback and error handling

**Test it now:** http://localhost:3000/kanban

Happy coding! 🚀
