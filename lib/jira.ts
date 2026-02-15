// lib/jira.ts
const JIRA_DOMAIN = (process.env.JIRA_DOMAIN || "").replace(/^https?:\/\//, "").replace(/\/$/, "");
const EMAIL = process.env.JIRA_EMAIL;
const TOKEN = process.env.JIRA_API_TOKEN;
const auth = Buffer.from(`${EMAIL}:${TOKEN}`).toString("base64");

// Change this to your actual Jira Project Key (e.g., "SCRUM")
export const PROJECT_KEY = "SCRUM"; 

export async function fetchFromJira(endpoint: string, options: RequestInit = {}) {
  const url = `https://${JIRA_DOMAIN}/rest/api/3/${endpoint}`;
  const response = await fetch(url, {
    ...options,
    headers: {
      'Authorization': `Basic ${auth}`,
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      ...options.headers,
    },
    cache: "no-store",
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Jira Error ${response.status}: ${errorText}`);
  }

  if (response.status === 204) return null;
  return response.json();
}

export async function createJiraIssue(summary: string) {
  return await fetchFromJira(`issue`, {
    method: 'POST',
    body: JSON.stringify({
      fields: {
        project: { key: PROJECT_KEY },
        summary: summary,
        issuetype: { name: "Task" }, // Ensure "Task" exists in your Jira project
      }
    }),
  });
}

export async function moveJiraIssue(issueKey: string, targetStatus: string) {
  const data = await fetchFromJira(`issue/${issueKey}/transitions`);
  const transition = data.transitions.find((t: any) => 
    t.to.name.toLowerCase().includes(targetStatus.toLowerCase())
  );

  if (!transition) throw new Error(`Workflow error: Cannot move to "${targetStatus}"`);

  await fetchFromJira(`issue/${issueKey}/transitions`, {
    method: 'POST',
    body: JSON.stringify({ transition: { id: transition.id } }),
  });
}