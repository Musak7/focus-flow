import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { projectName, epics, assignments } = await request.json();

    const domain = process.env.JIRA_DOMAIN || process.env.JIRA_BASE_URL?.replace('https://', '');
    const email = process.env.JIRA_EMAIL;
    const apiToken = process.env.JIRA_API_TOKEN;
    const projectKey = process.env.JIRA_PROJECT_KEY || 'SCRUM';

    if (!domain || !email || !apiToken) {
      return NextResponse.json({
        error: 'Missing Jira credentials'
      }, { status: 500 });
    }

    const baseUrl = `https://${domain.replace('https://', '').replace('http://', '')}`;
    const auth = Buffer.from(`${email}:${apiToken}`).toString('base64');

    const createdTickets = [];

    // Create Jira issues for each epic
    for (const epic of epics) {
      try {
        // Find the assigned developer for this epic
        const assignment = assignments?.find((a: any) => a.epicId === epic.id);
        const assignedDev = assignment?.developer?.username;

        // Get assignee accountId if available
        let assigneeAccountId = null;
        if (assignedDev) {
          try {
            const userSearchResponse = await fetch(
              `${baseUrl}/rest/api/3/user/search?query=${assignedDev}`,
              {
                method: 'GET',
                headers: {
                  'Authorization': `Basic ${auth}`,
                  'Accept': 'application/json',
                },
              }
            );

            if (userSearchResponse.ok) {
              const users = await userSearchResponse.json();
              if (users && users.length > 0) {
                assigneeAccountId = users[0].accountId;
              }
            }
          } catch (error) {
            console.error('Error finding Jira user:', error);
          }
        }

        // Create the issue
        const issueData: any = {
          fields: {
            project: {
              key: projectKey
            },
            summary: epic.title,
            description: {
              type: 'doc',
              version: 1,
              content: [
                {
                  type: 'paragraph',
                  content: [
                    {
                      type: 'text',
                      text: epic.description || 'No description provided'
                    }
                  ]
                }
              ]
            },
            issuetype: {
              name: 'Story'
            }
          }
        };

        // Add assignee if found
        if (assigneeAccountId) {
          issueData.fields.assignee = {
            accountId: assigneeAccountId
          };
        }

        // Add priority if available
        if (epic.priority) {
          const priorityMap: any = {
            'High': 'High',
            'Medium': 'Medium',
            'Low': 'Low'
          };
          if (priorityMap[epic.priority]) {
            issueData.fields.priority = {
              name: priorityMap[epic.priority]
            };
          }
        }

        const createResponse = await fetch(`${baseUrl}/rest/api/3/issue`, {
          method: 'POST',
          headers: {
            'Authorization': `Basic ${auth}`,
            'Accept': 'application/json',
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(issueData)
        });

        if (!createResponse.ok) {
          const errorText = await createResponse.text();
          console.error('Jira issue creation failed:', errorText);
          continue;
        }

        const newIssue = await createResponse.json();
        createdTickets.push({
          key: newIssue.key,
          id: newIssue.id,
          epicTitle: epic.title,
          assignedTo: assignedDev || 'Unassigned'
        });

        console.log(`✅ Created Jira ticket: ${newIssue.key} - ${epic.title}`);
      } catch (error) {
        console.error(`Error creating ticket for epic ${epic.title}:`, error);
      }
    }

    return NextResponse.json({
      success: true,
      message: `Created ${createdTickets.length} Jira tickets`,
      tickets: createdTickets
    });

  } catch (error: any) {
    console.error('Error creating Jira project:', error);
    return NextResponse.json({
      error: 'Failed to create Jira tickets',
      details: error.message
    }, { status: 500 });
  }
}
