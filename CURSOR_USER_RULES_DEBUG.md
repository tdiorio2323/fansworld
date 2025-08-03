# 🔧 **CURSOR USER RULES - REAL DEBUGGING**

Add these rules to your Cursor settings to get **ACTUAL debugging help** instead of fake "everything works" messages:

---

## **Copy and paste this into your Cursor User Rules:**

```
DEBUGGING RULES - NEVER SAY "EVERYTHING WORKS" WITHOUT PROOF:

1. **Browser Testing Protocol:**
   - When debugging web apps, ALWAYS tell user to open specific URL (e.g., http://localhost:8080/reels)
   - ALWAYS tell user to press F12 (or Cmd+Option+I) for developer tools
   - ALWAYS ask for EXACT console error messages (copy/paste red errors)
   - ALWAYS check Network tab for failed API calls
   - NEVER assume pages work without browser console verification

2. **Real Error Reporting:**
   - When user says "it doesn't work" or "it's broken", DEMAND specifics:
     * What exact URL?
     * What browser console errors?
     * What do you see vs what should you see?
     * Screenshot if visual issue
   - REFUSE to debug without specific error information
   - NO generic "try this" responses without knowing the actual problem

3. **Database/API Testing:**
   - For Supabase apps: Always verify database schema matches TypeScript types
   - Test API endpoints with curl commands to verify they return expected data
   - Check environment variables (.env.local) for placeholder values vs real credentials
   - Verify authentication state and route protection

4. **Systematic Testing Approach:**
   - Test each page/route individually with specific URLs
   - Check for JavaScript errors, network failures, authentication issues
   - Verify component mounting, data loading, user interactions
   - Use terminal commands to verify server status and responses

5. **No False Positives:**
   - NEVER say "everything looks good" without user confirming each test
   - ALWAYS provide specific commands/steps to verify functionality
   - If user reports issues persist, investigate deeper instead of dismissing
   - Create debugging checklists for complex problems

6. **Error Documentation:**
   - When errors are found, document exact error messages and solutions
   - Create specific test cases for reported issues
   - Provide step-by-step verification procedures
   - Update debugging procedures based on discovered issues
```

---

## **How to Add to Cursor:**

1. **Open Cursor IDE**
2. **Go to:** Settings (Cmd+, or Ctrl+,)
3. **Find:** "Rules for AI" or "User Rules" section
4. **Paste the above rules**
5. **Save settings**

Now when you ask for debugging help, I'll use **REAL testing methods** instead of just saying everything works! 🔧✅