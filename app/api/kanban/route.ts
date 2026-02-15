import { NextResponse } from 'next/server';

export async function GET() {
  try {
    console.log("--- STARTING JIRA FETCH ---");

    // 1. Get Variables
    // We check for JIRA_DOMAIN (from your screenshot) OR JIRA_BASE_URL
    let domain = process.env.JIRA_DOMAIN || process.env.JIRA_BASE_URL;
    const email = process.env.JIRA_EMAIL;
    const apiToken = process.env.JIRA_API_TOKEN;
    const projectKey = process.env.JIRA_PROJECT_KEY || "SCRUM";

    // 2. Debug Logging (Check your VS Code Terminal to see these!)
    console.log("Email:", email);
    console.log("Project:", projectKey);
    console.log("Domain Raw:", domain);

    if (!domain || !email || !apiToken) {
      return NextResponse.json({ 
        error: "Missing Credentials", 
        details: "Check .env.local. Need JIRA_DOMAIN, JIRA_EMAIL, JIRA_API_TOKEN" 
      }, { status: 500 });
    }

    // 3. Fix URL formatting (Remove https:// if it exists, then add it back)
    // This ensures it works whether you put 'abdulahadd...' or 'https://abdulahadd...'
    domain = domain.replace("https://", "").replace("http://", "").replace(/\/$/, ""); 
    const baseUrl = `https://${domain}`;

    const jql = `project=${projectKey} ORDER BY created DESC`;
    // NEW API: Use /rest/api/3/search/jql instead of /rest/api/3/search
    const apiUrl = `${baseUrl}/rest/api/3/search/jql`;

    console.log("Target URL:", apiUrl);
    console.log("JQL Query:", jql);

    // 4. Auth
    const auth = Buffer.from(`${email}:${apiToken}`).toString('base64');

    // 5. Fetch (POST method with JQL in body)
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${auth}`,
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        jql: jql,
        maxResults: 50,
        fields: ['summary', 'status', 'assignee', 'priority', 'created']
      }),
      cache: 'no-store'
    });

    // 6. Error Handling
    if (!response.ok) {
      const errorText = await response.text();
      console.error("Jira Failed:", response.status, errorText);
      return NextResponse.json({ 
        error: "Jira Rejected Request", 
        status: response.status,
        details: errorText 
      }, { status: response.status });
    }

    const data = await response.json();
    console.log('🔍 Raw Jira Response:', JSON.stringify(data, null, 2));
    console.log(`Success! Found ${data.issues?.length || 0} issues.`);

    // 7. Format with proper status mapping
    const formattedIssues = (data.issues || []).map((issue: any) => {
      const jiraStatus = issue.fields.status.name;

      // Map Jira status to board columns
      let boardStatus = jiraStatus;
      if (jiraStatus.toLowerCase().includes('to do') || jiraStatus.toLowerCase() === 'todo') {
        boardStatus = 'To Do';
      } else if (jiraStatus.toLowerCase().includes('in progress') || jiraStatus.toLowerCase() === 'inprogress') {
        boardStatus = 'In Progress';
      } else if (jiraStatus.toLowerCase() === 'done' || jiraStatus.toLowerCase() === 'completed') {
        boardStatus = 'Done';
      }

      return {
        id: issue.key,
        title: issue.fields.summary,
        status: boardStatus,
        assignee: issue.fields.assignee ? issue.fields.assignee.displayName : "Unassigned",
        priority: issue.fields.priority ? issue.fields.priority.name : "Medium"
      };
    });

    return NextResponse.json(formattedIssues);

  } catch (error: any) {
    console.error("Server Crash:", error);
    return NextResponse.json({ error: "Server Crash", details: error.message }, { status: 500 });
  }
}