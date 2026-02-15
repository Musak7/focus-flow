import { NextResponse } from 'next/server';
import { createJiraIssue } from '@/lib/jira';

export async function POST(request: Request) {
  try {
    const { summary } = await request.json();

    if (!summary || !summary.trim()) {
      return NextResponse.json(
        { error: 'Task summary is required' },
        { status: 400 }
      );
    }

    console.log(`📝 Creating new Jira task: "${summary}"...`);

    // Create the issue in Jira
    const newIssue = await createJiraIssue(summary);

    console.log(`✅ Created Jira issue: ${newIssue.key}`);

    return NextResponse.json({
      success: true,
      key: newIssue.key,
      id: newIssue.id,
      message: `Created task ${newIssue.key}`,
    });

  } catch (error: any) {
    console.error('❌ Create Issue Error:', error.message);
    return NextResponse.json(
      { error: 'Failed to create issue', details: error.message },
      { status: 500 }
    );
  }
}
