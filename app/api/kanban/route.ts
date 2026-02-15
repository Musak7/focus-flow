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
    const apiUrl = `${baseUrl}/rest/api/3/search?jql=${encodeURIComponent(jql)}&maxResults=50`;
    
    console.log("Target URL:", apiUrl);

    // 4. Auth
    const auth = Buffer.from(`${email}:${apiToken}`).toString('base64');

    // 5. Fetch
    const response = await fetch(apiUrl, {
      method: 'GET',
      headers: {
        'Authorization': `Basic ${auth}`,
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
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
    console.log(`Success! Found ${data.issues.length} issues.`);

    // 7. Format
    const formattedIssues = data.issues.map((issue: any) => ({
      id: issue.key,
      title: issue.fields.summary,
      status: issue.fields.status.name,
      assignee: issue.fields.assignee ? issue.fields.assignee.displayName : "Unassigned",
      priority: issue.fields.priority ? issue.fields.priority.name : "Medium"
    }));

    return NextResponse.json(formattedIssues);

  } catch (error: any) {
    console.error("Server Crash:", error);
    return NextResponse.json({ error: "Server Crash", details: error.message }, { status: 500 });
  }
}