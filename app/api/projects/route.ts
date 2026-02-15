import { NextResponse } from 'next/server';

// In-memory storage (in production, use a database)
let projects: any[] = [];

export async function GET() {
  return NextResponse.json({ projects });
}

export async function POST(request: Request) {
  try {
    const project = await request.json();

    const newProject = {
      id: `project-${Date.now()}`,
      name: project.name,
      description: project.description,
      epics: project.epics || [],
      assignments: project.assignments || [],
      jiraTickets: project.jiraTickets || [],
      createdAt: new Date().toISOString(),
      currentSprint: 'Sprint 1',
      healthScore: 85
    };

    projects.push(newProject);

    return NextResponse.json({
      success: true,
      project: newProject
    });
  } catch (error: any) {
    return NextResponse.json({
      error: 'Failed to create project',
      details: error.message
    }, { status: 500 });
  }
}
