import { NextResponse } from 'next/server';
import { moveJiraIssue } from '@/lib/jira';

export async function POST(request: Request) {
  try {
    const { issueKey, targetStatus } = await request.json();

    if (!issueKey || !targetStatus) {
      return NextResponse.json(
        { error: 'Missing issueKey or targetStatus' },
        { status: 400 }
      );
    }

    console.log(`🔄 Moving ${issueKey} to ${targetStatus}...`);

    // Call the Jira API to transition the issue
    await moveJiraIssue(issueKey, targetStatus);

    console.log(`✅ Successfully moved ${issueKey} to ${targetStatus}`);

    return NextResponse.json({
      success: true,
      message: `Moved ${issueKey} to ${targetStatus}`
    });

  } catch (error: any) {
    console.error('❌ Move Issue Error:', error.message);
    return NextResponse.json(
      { error: 'Failed to move issue', details: error.message },
      { status: 500 }
    );
  }
}
