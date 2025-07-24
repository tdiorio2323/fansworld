# 🎯 **Multi-Project Development Workflow Guide**

## 📁 **Project Organization**

You have multiple projects in `~/Documents/GitHub/`:

```
~/Documents/GitHub/
├── fansworld-lux-starter/           # 🚀 Cabana Creator Platform
│   ├── fansworld-fresh-new/         # ✅ WORKING VERSION (use this!)
│   ├── fansworld-fresh/             # ❌ Broken (PostCSS issues)
│   └── [other files]/
├── ai-beast/                        # 🤖 AI Project
├── TDSTUDIOS/                       # 🎬 TD Studios Project
├── canna/                          # 🌿 Cannabis Project
└── [other projects]/
```

## 🔥 **Proper Terminal Workflow**

### **1. 🎯 Always Use Full Paths**

**❌ WRONG (causes mixing):**
```bash
cd ~
npm run dev  # This runs from wrong directory!
```

**✅ CORRECT (isolated):**
```bash
# For Cabana project:
cd ~/Documents/GitHub/fansworld-lux-starter/fansworld-fresh-new
npm run dev

# For AI Beast project:
cd ~/Documents/GitHub/ai-beast
npm run dev

# For TD Studios project:
cd ~/Documents/GitHub/TDSTUDIOS
npm run dev
```

### **2. 🖥️ Use Separate Terminal Tabs**

**Terminal Tab 1: Cabana Development**
```bash
cd ~/Documents/GitHub/fansworld-lux-starter/fansworld-fresh-new
npm run dev
# Server runs on http://localhost:5173
```

**Terminal Tab 2: Other Project**
```bash
cd ~/Documents/GitHub/ai-beast
npm run dev
# Server runs on different port
```

**Terminal Tab 3: General Commands**
```bash
# Use for git commands, file operations, etc.
```

### **3. 🚨 Clean Start Protocol**

**Before switching projects:**
```bash
# Kill all running development servers
pkill -f vite
pkill -f node

# Navigate to your target project
cd ~/Documents/GitHub/fansworld-lux-starter/fansworld-fresh-new

# Start fresh
npm run dev
```

## 🚀 **Cabana Project Quick Start**

### **Current Working Setup:**
```bash
# 1. Navigate to working directory
cd ~/Documents/GitHub/fansworld-lux-starter/fansworld-fresh-new

# 2. Install dependencies (if needed)
npm install

# 3. Start development server
npm run dev

# 4. Open browser
open http://localhost:5173
```

### **Project Structure:**
```
fansworld-fresh-new/
├── src/
│   ├── App.tsx                    # Main app with waitlist + VIP demo
│   ├── components/
│   │   ├── VIPAccessSystem.tsx    # VIP access codes
│   │   ├── VIPDashboard.tsx       # User dashboard
│   │   ├── MessagingSystem.tsx    # 💬 Real-time messaging
│   │   └── AdminPanel.tsx         # 🏢 Admin management
│   └── pages/
│       └── VIPDemo.tsx            # VIP features demo
├── public/
│   └── luxury-architecture.jpg    # Background image
└── [config files]
```

## 🔄 **Project Switching Best Practices**

### **1. Save State Before Switching**
```bash
# In current project directory
git add .
git commit -m "WIP: current progress"
git push
```

### **2. Switch Projects Cleanly**
```bash
# Kill running processes
pkill -f vite

# Navigate to new project
cd ~/Documents/GitHub/[NEW_PROJECT]

# Start development
npm run dev
```

### **3. Return to Previous Project**
```bash
# Navigate back
cd ~/Documents/GitHub/fansworld-lux-starter/fansworld-fresh-new

# Pull latest changes (if working with team)
git pull

# Start development
npm run dev
```

## 🛠️ **Development Server Ports**

To avoid conflicts, each project should use different ports:

- **Cabana:** `localhost:5173` (default Vite)
- **AI Beast:** `localhost:3000` (if Next.js)
- **TD Studios:** `localhost:5174` (if Vite conflicts)

### **Force Specific Port:**
```bash
npm run dev -- --port 5174
```

## 🚨 **Common Issues & Solutions**

### **1. "Missing script: dev" Error**
**Problem:** Running `npm run dev` from wrong directory
**Solution:** Always `cd` to correct project first

### **2. PostCSS/Tailwind Errors**
**Problem:** Mixed configurations between projects
**Solution:** Use `fansworld-fresh-new` (working version)

### **3. Port Already in Use**
**Problem:** Multiple servers running
**Solution:** 
```bash
pkill -f vite
pkill -f node
# Then restart
```

### **4. Node Modules Conflicts**
**Problem:** Dependencies mixed between projects
**Solution:**
```bash
# In problem project
rm -rf node_modules package-lock.json
npm install
```

## 📋 **Daily Workflow Checklist**

### **Starting Work:**
- [ ] Open terminal in correct project directory
- [ ] Kill any running processes: `pkill -f vite`
- [ ] Navigate: `cd ~/Documents/GitHub/[PROJECT_NAME]`
- [ ] Start development: `npm run dev`
- [ ] Open browser to correct localhost port

### **Switching Projects:**
- [ ] Save current work: `git add . && git commit -m "WIP"`
- [ ] Kill processes: `pkill -f vite`
- [ ] Navigate to new project: `cd ~/Documents/GitHub/[NEW_PROJECT]`
- [ ] Start new development: `npm run dev`

### **Ending Work:**
- [ ] Save progress: `git add . && git commit -m "Progress update"`
- [ ] Push to remote: `git push`
- [ ] Kill processes: `pkill -f vite`

## 🎯 **Key Commands Reference**

```bash
# Navigate to Cabana project
cd ~/Documents/GitHub/fansworld-lux-starter/fansworld-fresh-new

# Check current directory
pwd

# List running processes
ps aux | grep node

# Kill all Node/Vite processes
pkill -f vite && pkill -f node

# Start development server
npm run dev

# Start with specific port
npm run dev -- --port 5174

# Check what's running on port
lsof -i :5173
```

## 🎨 **IDE/Editor Setup**

### **VS Code Workspaces**
Create separate workspace files for each project:

**cabana.code-workspace:**
```json
{
  "folders": [
    {
      "path": "~/Documents/GitHub/fansworld-lux-starter"
    }
  ]
}
```

**ai-beast.code-workspace:**
```json
{
  "folders": [
    {
      "path": "~/Documents/GitHub/ai-beast"
    }
  ]
}
```

This keeps project settings, extensions, and terminal sessions separate!

---

## 🚀 **Ready to Continue Cabana Development?**

```bash
cd ~/Documents/GitHub/fansworld-lux-starter/fansworld-fresh-new
npm run dev
```

Your Cabana platform is ready for the next features! 💎✨ 